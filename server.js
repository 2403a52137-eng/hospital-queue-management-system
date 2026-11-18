/**
 * Hospital Queue & Appointment Management System - Backend Server
 * Built with pure Node.js (Zero external dependencies needed!)
 * Port: 3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Utility: Read Data
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { users: [], doctors: [], appointments: [] };
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading data:', err);
    return { users: [], doctors: [], appointments: [] };
  }
}

// Utility: Save Data
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper to send JSON responses
function sendJSON(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

// Parse Request Body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Server handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // ==================== API ROUTES ====================
  if (pathname.startsWith('/api/')) {
    const data = readData();

    // ---------------- AUTHENTICATION ----------------
    // POST /api/auth/login
    if (method === 'POST' && pathname === '/api/auth/login') {
      try {
        const { username, password, role } = await parseRequestBody(req);
        if (!username || !password) {
          return sendJSON(res, 400, { success: false, message: 'Username/Phone and Password required' });
        }

        const queryTerm = username.trim().toLowerCase();
        const user = data.users.find(u => {
          const matchUser = u.username && u.username.toLowerCase() === queryTerm;
          const matchPhone = u.phone && u.phone === queryTerm;
          const matchName = u.name && u.name.toLowerCase() === queryTerm;
          const matchDocId = u.doctorId && u.doctorId.toLowerCase() === queryTerm;
          return (matchUser || matchPhone || matchName || matchDocId) && u.password === password;
        });

        if (!user) {
          return sendJSON(res, 401, { success: false, message: 'Invalid credentials. Please check your username and password.' });
        }

        if (role && user.role !== role) {
          return sendJSON(res, 403, { success: false, message: `Access denied. User is not registered as a ${role}.` });
        }

        let doctorDetails = null;
        if (user.role === 'doctor' && user.doctorId) {
          doctorDetails = data.doctors.find(d => d.id === user.doctorId);
        }

        return sendJSON(res, 200, {
          success: true,
          message: 'Login successful',
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            phone: user.phone || null,
            doctorId: user.doctorId || null,
            doctorDetails: doctorDetails
          }
        });
      } catch (err) {
        return sendJSON(res, 400, { success: false, message: 'Invalid login payload' });
      }
    }

    // POST /api/auth/register-patient
    if (method === 'POST' && pathname === '/api/auth/register-patient') {
      try {
        const { name, phone, password, age, gender } = await parseRequestBody(req);
        if (!name || !phone || !password) {
          return sendJSON(res, 400, { success: false, message: 'Name, Phone, and Password are required' });
        }

        const existing = data.users.find(u => u.phone === phone || u.username === phone);
        if (existing) {
          return sendJSON(res, 409, { success: false, message: 'A user with this phone number already exists. Please login.' });
        }

        const newUser = {
          id: `USR-PAT-${data.users.length + 1}`,
          username: phone,
          phone: phone,
          password: password,
          name: name,
          role: 'patient',
          age: parseInt(age) || 30,
          gender: gender || 'Other'
        };

        data.users.push(newUser);
        saveData(data);

        return sendJSON(res, 201, {
          success: true,
          message: 'Patient registered successfully! You can now log in.',
          user: {
            id: newUser.id,
            name: newUser.name,
            phone: newUser.phone,
            role: newUser.role
          }
        });
      } catch (err) {
        return sendJSON(res, 400, { success: false, message: 'Error processing registration' });
      }
    }

    // ---------------- DOCTORS ----------------
    // GET /api/doctors
    if (method === 'GET' && pathname === '/api/doctors') {
      const doctorsWithStats = data.doctors.map(doc => {
        const docAppts = data.appointments.filter(a => a.doctorId === doc.id);
        const currentServing = docAppts.find(a => a.status === 'IN_CONSULTATION');
        const emergencyWaiting = docAppts.filter(a => a.isEmergency && a.status === 'EMERGENCY_WAITING').length;
        const regularWaiting = docAppts.filter(a => !a.isEmergency && a.status === 'WAITING').length;
        const totalCompleted = docAppts.filter(a => a.status === 'COMPLETED').length;

        return {
          ...doc,
          currentServingDisplay: currentServing 
            ? (currentServing.isEmergency ? `🚨 EMERGENCY: ${currentServing.patientName}` : `Token ${currentServing.tokenNumber} (${currentServing.patientName})`)
            : 'Idle (No Patient)',
          currentServingPatient: currentServing ? currentServing.patientName : null,
          currentServingToken: currentServing ? currentServing.tokenNumber : null,
          currentServingIsEmergency: currentServing ? currentServing.isEmergency : false,
          emergencyQueueCount: emergencyWaiting,
          regularQueueCount: regularWaiting,
          totalWaitingCount: emergencyWaiting + regularWaiting,
          completedCount: totalCompleted
        };
      });

      return sendJSON(res, 200, { success: true, doctors: doctorsWithStats });
    }

    // ---------------- APPOINTMENTS & QUEUE ----------------
    // GET /api/appointments
    if (method === 'GET' && pathname === '/api/appointments') {
      const doctorId = parsedUrl.query.doctorId;
      const status = parsedUrl.query.status;
      const phone = parsedUrl.query.phone;
      const isEmergency = parsedUrl.query.isEmergency;

      let list = [...data.appointments];

      if (doctorId) {
        list = list.filter(a => a.doctorId === doctorId);
      }
      if (status) {
        list = list.filter(a => a.status === status);
      }
      if (phone) {
        list = list.filter(a => a.phone === phone);
      }
      if (isEmergency !== undefined) {
        const boolVal = isEmergency === 'true';
        list = list.filter(a => a.isEmergency === boolVal);
      }

      // Priority sort: Emergency (0) first, then Regular (1), sorted by createdAt
      list.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      return sendJSON(res, 200, { success: true, appointments: list });
    }

    // POST /api/appointments/book - Regular Appointment (Generates Token Number)
    if (method === 'POST' && pathname === '/api/appointments/book') {
      try {
        const body = await parseRequestBody(req);
        const { patientName, age, gender, phone, doctorId, symptoms } = body;

        if (!patientName || !phone || !doctorId) {
          return sendJSON(res, 400, { success: false, message: 'Patient Name, Phone, and Doctor are required.' });
        }

        const doctor = data.doctors.find(d => d.id === doctorId);
        if (!doctor) {
          return sendJSON(res, 404, { success: false, message: 'Selected doctor not found.' });
        }

        // Calculate next Token Number for this doctor
        const existingDocTokens = data.appointments.filter(a => a.doctorId === doctorId && !a.isEmergency);
        const nextTokenIndex = existingDocTokens.length + 1;
        const tokenNumber = `T-${String(nextTokenIndex).padStart(2, '0')}`;

        const newAppointment = {
          id: `APT-${1000 + data.appointments.length + 1}`,
          patientName,
          age: parseInt(age) || 30,
          gender: gender || 'Other',
          phone,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          isEmergency: false,
          tokenNumber: tokenNumber, // Assigned regular sequential token
          priority: 1, // Regular Priority
          status: 'WAITING',
          symptoms: symptoms || 'Routine OPD consultation',
          createdAt: new Date().toISOString()
        };

        data.appointments.push(newAppointment);
        saveData(data);

        // Calculate queue position ahead
        const waitingAhead = data.appointments.filter(a => 
          a.doctorId === doctorId && 
          (a.status === 'WAITING' || a.status === 'EMERGENCY_WAITING') && 
          a.id !== newAppointment.id
        ).length;

        return sendJSON(res, 201, {
          success: true,
          message: `Appointment booked! Your Token Number is ${tokenNumber}.`,
          appointment: newAppointment,
          waitingAhead: waitingAhead,
          estimatedWaitMinutes: waitingAhead * 12
        });
      } catch (err) {
        return sendJSON(res, 400, { success: false, message: 'Invalid booking data.' });
      }
    }

    // POST /api/appointments/emergency - EMERGENCY FAST-TRACK (NO TOKEN NUMBER NEEDED)
    if (method === 'POST' && pathname === '/api/appointments/emergency') {
      try {
        const body = await parseRequestBody(req);
        const { patientName, age, gender, phone, emergencyCategory, symptoms, doctorId } = body;

        if (!patientName || !phone) {
          return sendJSON(res, 400, { success: false, message: 'Patient Name and Contact Phone are required for Emergency admission.' });
        }

        // Assign doctor: selected or dedicated Emergency Trauma specialist
        let doctor = data.doctors.find(d => d.id === doctorId);
        if (!doctor) {
          doctor = data.doctors.find(d => d.specialty.toLowerCase().includes('emergency')) || data.doctors[0];
        }

        const emergencyPassCode = `EMG-PASS-${Math.floor(1000 + Math.random() * 9000)}`;

        const newEmergencyAppointment = {
          id: `EMG-${1000 + data.appointments.length + 1}`,
          patientName,
          age: parseInt(age) || 0,
          gender: gender || 'Unspecified',
          phone,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          isEmergency: true,
          tokenNumber: null, // NO TOKEN NUMBER! Direct Emergency Entry
          emergencyPassCode: emergencyPassCode,
          priority: 0, // Priority 0 (Super Priority - Preempts all regular tokens)
          status: 'EMERGENCY_WAITING',
          emergencyCategory: emergencyCategory || 'Critical Trauma / Acute Medical Emergency',
          symptoms: symptoms || 'Immediate emergency medical intervention required',
          createdAt: new Date().toISOString()
        };

        data.appointments.push(newEmergencyAppointment);
        saveData(data);

        return sendJSON(res, 201, {
          success: true,
          message: '🚨 EMERGENCY DIRECT ENTRY GRANTED! No token wait required. Proceed directly to the hospital/cabin.',
          appointment: newEmergencyAppointment,
          hospitalGuide: {
            assignedDoctor: doctor.name,
            specialty: doctor.specialty,
            room: doctor.room,
            instructions: 'Show this Emergency Pass Code at ER Entrance. You will be attended immediately ahead of standard queues.'
          }
        });
      } catch (err) {
        return sendJSON(res, 400, { success: false, message: 'Invalid emergency payload.' });
      }
    }

    // POST /api/doctors/:id/call-next - Doctor calls the next patient using Priority Queue
    const callNextMatch = pathname.match(/^\/api\/doctors\/([^/]+)\/call-next$/);
    if (method === 'POST' && callNextMatch) {
      const docId = callNextMatch[1];
      const doctor = data.doctors.find(d => d.id === docId);
      if (!doctor) {
        return sendJSON(res, 404, { success: false, message: 'Doctor not found.' });
      }

      // Finish current patient if in consultation
      const currentPatient = data.appointments.find(a => a.doctorId === docId && a.status === 'IN_CONSULTATION');
      if (currentPatient) {
        currentPatient.status = 'COMPLETED';
        currentPatient.completedAt = new Date().toISOString();
      }

      // Priority Queue: Find all waiting patients for this doctor
      const waitingList = data.appointments.filter(a => 
        a.doctorId === docId && (a.status === 'WAITING' || a.status === 'EMERGENCY_WAITING')
      );

      // Sort with Emergency (priority 0) first, then regular tokens by order
      waitingList.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority; // 0 comes before 1
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      if (waitingList.length === 0) {
        saveData(data);
        return sendJSON(res, 200, {
          success: true,
          message: 'No more waiting patients for this doctor.',
          nowServing: null
        });
      }

      const nextPatient = waitingList[0];
      nextPatient.status = 'IN_CONSULTATION';
      nextPatient.consultationStartedAt = new Date().toISOString();

      saveData(data);

      return sendJSON(res, 200, {
        success: true,
        message: nextPatient.isEmergency
          ? `🚨 EMERGENCY PATIENT CALLED: ${nextPatient.patientName} (DIRECT ENTRY - NO TOKEN)`
          : `Calling Token ${nextPatient.tokenNumber}: ${nextPatient.patientName}`,
        nowServing: nextPatient
      });
    }

    // PUT /api/appointments/:id/status - Update status
    const statusMatch = pathname.match(/^\/api\/appointments\/([^/]+)\/status$/);
    if (method === 'PUT' && statusMatch) {
      try {
        const apptId = statusMatch[1];
        const { status } = await parseRequestBody(req);

        const appt = data.appointments.find(a => a.id === apptId);
        if (!appt) {
          return sendJSON(res, 404, { success: false, message: 'Appointment not found' });
        }

        appt.status = status;
        if (status === 'COMPLETED') {
          appt.completedAt = new Date().toISOString();
        }

        saveData(data);
        return sendJSON(res, 200, { success: true, message: 'Status updated', appointment: appt });
      } catch (err) {
        return sendJSON(res, 400, { success: false, message: 'Failed to update status' });
      }
    }

    // GET /api/admin/analytics - Admin summary stats
    if (method === 'GET' && pathname === '/api/admin/analytics') {
      const totalAppointments = data.appointments.length;
      const emergencyCases = data.appointments.filter(a => a.isEmergency);
      const regularTokens = data.appointments.filter(a => !a.isEmergency);
      const activeEmergency = emergencyCases.filter(a => a.status === 'EMERGENCY_WAITING').length;
      const inConsultation = data.appointments.filter(a => a.status === 'IN_CONSULTATION').length;
      const completed = data.appointments.filter(a => a.status === 'COMPLETED').length;
      const totalWaiting = data.appointments.filter(a => a.status === 'WAITING' || a.status === 'EMERGENCY_WAITING').length;

      return sendJSON(res, 200, {
        success: true,
        stats: {
          totalAppointments,
          totalEmergency: emergencyCases.length,
          totalRegular: regularTokens.length,
          activeEmergency,
          inConsultation,
          completed,
          totalWaiting,
          totalDoctors: data.doctors.length,
          avgWaitMinutes: totalWaiting > 0 ? Math.round((totalWaiting * 12) / Math.max(data.doctors.length, 1)) : 0
        }
      });
    }

    // POST /api/admin/doctors - Admin adds new doctor
    if (method === 'POST' && pathname === '/api/admin/doctors') {
      try {
        const body = await parseRequestBody(req);
        const { name, specialty, room, experience, phone, username, password } = body;

        if (!name || !specialty || !room) {
          return sendJSON(res, 400, { success: false, message: 'Doctor Name, Specialty, and Room are required.' });
        }

        const newDocId = `DOC-${data.doctors.length + 1}`;
        const docUser = username || `dr.${name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8)}`;

        const newDoc = {
          id: newDocId,
          name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
          specialty,
          room,
          status: 'Available',
          experience: experience || '5 Years',
          phone: phone || '+91 98480 00000',
          username: docUser
        };

        data.doctors.push(newDoc);

        // Add doctor user credentials
        data.users.push({
          id: `USR-${newDocId}`,
          username: docUser,
          password: password || 'doc123',
          name: newDoc.name,
          role: 'doctor',
          doctorId: newDocId
        });

        saveData(data);
        return sendJSON(res, 201, { success: true, message: 'Doctor added successfully', doctor: newDoc });
      } catch (err) {
        return sendJSON(res, 400, { success: false, message: 'Failed to add doctor' });
      }
    }

    // DELETE /api/admin/doctors/:id - Admin deletes doctor
    const deleteDocMatch = pathname.match(/^\/api\/admin\/doctors\/([^/]+)$/);
    if (method === 'DELETE' && deleteDocMatch) {
      const docId = deleteDocMatch[1];
      const index = data.doctors.findIndex(d => d.id === docId);
      if (index === -1) {
        return sendJSON(res, 404, { success: false, message: 'Doctor not found' });
      }

      data.doctors.splice(index, 1);
      data.users = data.users.filter(u => u.doctorId !== docId);
      saveData(data);
      return sendJSON(res, 200, { success: true, message: 'Doctor removed successfully' });
    }

    // POST /api/admin/reset-queue - Reset Queue for new shift
    if (method === 'POST' && pathname === '/api/admin/reset-queue') {
      data.appointments = [];
      saveData(data);
      return sendJSON(res, 200, { success: true, message: 'Queue reset successfully for all departments.' });
    }

    return sendJSON(res, 404, { success: false, message: 'API route not found' });
  }

  // ==================== STATIC FILE SERVING ====================
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const extname = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (fallbackErr, fallbackContent) => {
          if (fallbackErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fallbackContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`==================================================================`);
  console.log(`  🏥 Hospital Queue & Appointment Management System Server Running`);
  console.log(`  🌐 Local URL: http://localhost:${PORT}`);
  console.log(`  ⚡ Mode: Zero-dependency Node.js Standard HTTP Server`);
  console.log(`==================================================================`);
});
