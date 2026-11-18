/**
 * Hospital Queue & Appointment Management System - Express Backend Server
 * (Alternative Express.js implementation)
 * Run: npm install express cors && node server-express.js
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper: Read & Save Data
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    return { users: [], doctors: [], appointments: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 1. Auth Login
app.post('/api/auth/login', (req, res) => {
  const { username, password, role } = req.body;
  const data = readData();
  const queryTerm = username.trim().toLowerCase();
  const user = data.users.find(u => {
    const matchUser = u.username && u.username.toLowerCase() === queryTerm;
    const matchPhone = u.phone && u.phone === queryTerm;
    const matchName = u.name && u.name.toLowerCase() === queryTerm;
    const matchDocId = u.doctorId && u.doctorId.toLowerCase() === queryTerm;
    return (matchUser || matchPhone || matchName || matchDocId) && u.password === password;
  });

  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  if (role && user.role !== role) return res.status(403).json({ success: false, message: `Access denied for role ${role}` });

  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user.id, username: user.username, name: user.name, role: user.role, phone: user.phone, doctorId: user.doctorId }
  });
});

// 2. Register Patient
app.post('/api/auth/register-patient', (req, res) => {
  const { name, phone, password, age, gender } = req.body;
  const data = readData();
  if (data.users.find(u => u.phone === phone)) {
    return res.status(409).json({ success: false, message: 'Phone number already registered' });
  }

  const newUser = {
    id: `USR-PAT-${data.users.length + 1}`,
    username: phone,
    phone,
    password,
    name,
    role: 'patient',
    age: parseInt(age) || 30,
    gender: gender || 'Other'
  };
  data.users.push(newUser);
  saveData(data);
  res.status(201).json({ success: true, message: 'Registered successfully', user: newUser });
});

// 3. Get Doctors with Live Stats
app.get('/api/doctors', (req, res) => {
  const data = readData();
  const doctorsWithStats = data.doctors.map(doc => {
    const docAppts = data.appointments.filter(a => a.doctorId === doc.id);
    const currentServing = docAppts.find(a => a.status === 'IN_CONSULTATION');
    const emergencyWaiting = docAppts.filter(a => a.isEmergency && a.status === 'EMERGENCY_WAITING').length;
    const regularWaiting = docAppts.filter(a => !a.isEmergency && a.status === 'WAITING').length;

    return {
      ...doc,
      currentServingDisplay: currentServing 
        ? (currentServing.isEmergency ? `🚨 EMERGENCY: ${currentServing.patientName}` : `Token ${currentServing.tokenNumber} (${currentServing.patientName})`)
        : 'Idle',
      currentServingPatient: currentServing ? currentServing.patientName : null,
      currentServingToken: currentServing ? currentServing.tokenNumber : null,
      currentServingIsEmergency: currentServing ? currentServing.isEmergency : false,
      emergencyQueueCount: emergencyWaiting,
      regularQueueCount: regularWaiting,
      totalWaitingCount: emergencyWaiting + regularWaiting
    };
  });
  res.json({ success: true, doctors: doctorsWithStats });
});

// 4. Get Appointments
app.get('/api/appointments', (req, res) => {
  const data = readData();
  const { doctorId, status, phone } = req.query;
  let list = [...data.appointments];
  if (doctorId) list = list.filter(a => a.doctorId === doctorId);
  if (status) list = list.filter(a => a.status === status);
  if (phone) list = list.filter(a => a.phone === phone);

  // Priority Sort (0 = Emergency first, 1 = Regular)
  list.sort((a, b) => (a.priority !== b.priority ? a.priority - b.priority : new Date(a.createdAt) - new Date(b.createdAt)));
  res.json({ success: true, appointments: list });
});

// 5. Book Routine Appointment (With Token)
app.post('/api/appointments/book', (req, res) => {
  const { patientName, age, gender, phone, doctorId, symptoms } = req.body;
  const data = readData();
  const doctor = data.doctors.find(d => d.id === doctorId);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

  const existingTokens = data.appointments.filter(a => a.doctorId === doctorId && !a.isEmergency);
  const tokenNumber = `T-${String(existingTokens.length + 1).padStart(2, '0')}`;

  const newAppt = {
    id: `APT-${1000 + data.appointments.length + 1}`,
    patientName,
    age: parseInt(age) || 30,
    gender: gender || 'Other',
    phone,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    isEmergency: false,
    tokenNumber,
    priority: 1,
    status: 'WAITING',
    symptoms: symptoms || 'Routine consultation',
    createdAt: new Date().toISOString()
  };

  data.appointments.push(newAppt);
  saveData(data);
  res.status(201).json({ success: true, message: `Booked! Token ${tokenNumber}`, appointment: newAppt });
});

// 6. Book Emergency Fast-Track (NO TOKEN NUMBER!)
app.post('/api/appointments/emergency', (req, res) => {
  const { patientName, age, gender, phone, emergencyCategory, doctorId, symptoms } = req.body;
  const data = readData();
  let doctor = data.doctors.find(d => d.id === doctorId) || data.doctors[0];

  const newEmergency = {
    id: `EMG-${1000 + data.appointments.length + 1}`,
    patientName,
    age: parseInt(age) || 0,
    gender: gender || 'Unspecified',
    phone,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    isEmergency: true,
    tokenNumber: null, // NO TOKEN NUMBER
    emergencyPassCode: `EMG-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
    priority: 0, // Highest Priority
    status: 'EMERGENCY_WAITING',
    emergencyCategory: emergencyCategory || 'Critical Emergency',
    symptoms: symptoms || 'Urgent care',
    createdAt: new Date().toISOString()
  };

  data.appointments.push(newEmergency);
  saveData(data);
  res.status(201).json({
    success: true,
    message: 'Emergency Direct Entry Authorized. No token required.',
    appointment: newEmergency
  });
});

// 7. Doctor Call Next Patient
app.post('/api/doctors/:id/call-next', (req, res) => {
  const docId = req.params.id;
  const data = readData();

  // Complete current patient
  const cur = data.appointments.find(a => a.doctorId === docId && a.status === 'IN_CONSULTATION');
  if (cur) cur.status = 'COMPLETED';

  // Find waiting patients sorted by priority (Emergency 0 first)
  const waiting = data.appointments.filter(a => a.doctorId === docId && (a.status === 'WAITING' || a.status === 'EMERGENCY_WAITING'));
  waiting.sort((a, b) => (a.priority !== b.priority ? a.priority - b.priority : new Date(a.createdAt) - new Date(b.createdAt)));

  if (waiting.length === 0) {
    saveData(data);
    return res.json({ success: true, message: 'Queue is empty', nowServing: null });
  }

  const nextPatient = waiting[0];
  nextPatient.status = 'IN_CONSULTATION';
  saveData(data);

  res.json({
    success: true,
    message: nextPatient.isEmergency ? `EMERGENCY CALLED: ${nextPatient.patientName}` : `Now Calling Token ${nextPatient.tokenNumber}`,
    nowServing: nextPatient
  });
});

// 8. Update Status
app.put('/api/appointments/:id/status', (req, res) => {
  const data = readData();
  const appt = data.appointments.find(a => a.id === req.params.id);
  if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
  appt.status = req.body.status;
  saveData(data);
  res.json({ success: true, appointment: appt });
});

// 9. Admin Analytics
app.get('/api/admin/analytics', (req, res) => {
  const data = readData();
  const total = data.appointments.length;
  const emergency = data.appointments.filter(a => a.isEmergency).length;
  const inConsult = data.appointments.filter(a => a.status === 'IN_CONSULTATION').length;
  const waiting = data.appointments.filter(a => a.status === 'WAITING' || a.status === 'EMERGENCY_WAITING').length;

  res.json({
    success: true,
    stats: {
      totalAppointments: total,
      totalEmergency: emergency,
      totalRegular: total - emergency,
      inConsultation: inConsult,
      totalWaiting: waiting,
      totalDoctors: data.doctors.length,
      avgWaitMinutes: waiting * 10
    }
  });
});

// 10. Admin Reset Queue
app.post('/api/admin/reset-queue', (req, res) => {
  const data = readData();
  data.appointments = [];
  saveData(data);
  res.json({ success: true, message: 'Queue reset successfully' });
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Hospital Management Express Server running on port ${PORT}`);
});
