/**
 * LifeCare Hospital Queue & Appointment Management System - Client App
 */

// Global State
let state = {
  currentUser: JSON.parse(localStorage.getItem('lifecare_user') || 'null'),
  currentTab: 'home',
  doctors: [],
  appointments: [],
  analytics: null
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  setupSessionUI();
  loadAllData();
  
  // Auto-refresh queue every 4 seconds for live sync
  setInterval(() => {
    loadAllData(true);
  }, 4000);

  // Restore current tab from hash or default to home
  const initialTab = window.location.hash.replace('#', '') || 'home';
  switchTab(initialTab);
});

// Live Digital Clock
function initClock() {
  const clockEl = document.getElementById('liveClock');
  function updateTime() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: true });
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// Session badge UI
function setupSessionUI() {
  const badge = document.getElementById('userSessionBadge');
  const nameEl = document.getElementById('sessionUserName');
  const roleEl = document.getElementById('sessionUserRole');

  if (state.currentUser) {
    badge.classList.remove('hidden');
    badge.classList.add('flex');
    nameEl.textContent = state.currentUser.name || state.currentUser.username;
    roleEl.textContent = state.currentUser.role;
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
  }

  updatePortalAuthState();
}

function updatePortalAuthState() {
  // Patient Portal State
  const patAuthBox = document.getElementById('patientAuthBox');
  const patLoggedInSec = document.getElementById('patientLoggedInSection');
  if (state.currentUser && state.currentUser.role === 'patient') {
    patAuthBox.classList.add('hidden');
    patLoggedInSec.classList.remove('hidden');
    document.getElementById('patProfileName').textContent = state.currentUser.name;
    document.getElementById('patProfilePhone').textContent = `Phone: ${state.currentUser.phone || state.currentUser.username}`;
    loadPatientAppointments();
  } else {
    patAuthBox.classList.remove('hidden');
    patLoggedInSec.classList.add('hidden');
  }

  // Doctor Chamber State
  const docAuthBox = document.getElementById('doctorAuthBox');
  const docChamberSec = document.getElementById('doctorChamberSection');
  if (state.currentUser && state.currentUser.role === 'doctor') {
    docAuthBox.classList.add('hidden');
    docChamberSec.classList.remove('hidden');
    renderDoctorChamber();
  } else {
    docAuthBox.classList.remove('hidden');
    docChamberSec.classList.add('hidden');
  }

  // Admin Portal State
  const adminAuthBox = document.getElementById('adminAuthBox');
  const adminDashSec = document.getElementById('adminDashboardSection');
  if (state.currentUser && state.currentUser.role === 'admin') {
    adminAuthBox.classList.add('hidden');
    adminDashSec.classList.remove('hidden');
    renderAdminDashboard();
  } else {
    adminAuthBox.classList.remove('hidden');
    adminDashSec.classList.add('hidden');
  }
}

// User Logout
function logoutUser() {
  state.currentUser = null;
  localStorage.removeItem('lifecare_user');
  setupSessionUI();
  showToast('Logged out successfully', 'info');
}

// ==================== NAVIGATION TABS ====================
function switchTab(tabId) {
  state.currentTab = tabId;
  window.location.hash = tabId;

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeNav = document.getElementById(`nav-${tabId}`);
  if (activeNav) activeNav.classList.add('active');

  // Toggle content sections
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  const targetTab = document.getElementById(`tab-${tabId}`);
  if (targetTab) targetTab.classList.remove('hidden');

  // Load specific tab data
  if (tabId === 'home') renderHomeView();
  if (tabId === 'patient' && state.currentUser?.role === 'patient') loadPatientAppointments();
  if (tabId === 'doctor' && state.currentUser?.role === 'doctor') renderDoctorChamber();
  if (tabId === 'admin' && state.currentUser?.role === 'admin') renderAdminDashboard();
  if (tabId === 'display') renderLiveDisplayBoard();
}

// ==================== DATA API CALLS ====================
async function loadAllData(silent = false) {
  try {
    const [docsRes, apptsRes, analyticsRes] = await Promise.all([
      fetch('/api/doctors'),
      fetch('/api/appointments'),
      fetch('/api/admin/analytics')
    ]);

    const docsData = await docsRes.json();
    const apptsData = await apptsRes.json();
    const analyticsData = await analyticsRes.json();

    if (docsData.success) state.doctors = docsData.doctors;
    if (apptsData.success) state.appointments = apptsData.appointments;
    if (analyticsData.success) state.analytics = analyticsData.stats;

    // Refresh current view
    if (state.currentTab === 'home') renderHomeView();
    if (state.currentTab === 'patient' && state.currentUser?.role === 'patient') renderPatientAppointments();
    if (state.currentTab === 'doctor' && state.currentUser?.role === 'doctor') renderDoctorChamber();
    if (state.currentTab === 'admin' && state.currentUser?.role === 'admin') renderAdminDashboard();
    if (state.currentTab === 'display') renderLiveDisplayBoard();

    // Populate dropdowns in modals
    populateDoctorDropdowns();
  } catch (err) {
    if (!silent) console.error('Error fetching data:', err);
  }
}

// Populate doctor select options in modals and doctor login
function populateDoctorDropdowns() {
  const rtnSelect = document.getElementById('rtnDoctorId');
  const emgSelect = document.getElementById('emgDoctorId');
  const docLoginSelect = document.getElementById('docLoginSelect');
  const docDirectoryList = document.getElementById('doctorDirectoryList');

  if (rtnSelect && state.doctors.length > 0) {
    const curVal = rtnSelect.value;
    rtnSelect.innerHTML = state.doctors.map(d => `
      <option value="${d.id}">${d.name} (${d.specialty} - ${d.room})</option>
    `).join('');
    if (curVal) rtnSelect.value = curVal;
  }

  if (emgSelect && state.doctors.length > 0) {
    const curVal = emgSelect.value;
    emgSelect.innerHTML = `<option value="">Default: Dedicated Emergency Specialist</option>` + state.doctors.map(d => `
      <option value="${d.id}">${d.name} (${d.specialty} - ${d.room})</option>
    `).join('');
    if (curVal) emgSelect.value = curVal;
  }

  // Populate Doctor Login Dropdown
  if (docLoginSelect && state.doctors.length > 0) {
    const curVal = docLoginSelect.value;
    docLoginSelect.innerHTML = `<option value="">-- Choose Doctor Name (or type below) --</option>` + state.doctors.map(d => `
      <option value="${d.username || d.name}">${d.name} — ${d.specialty} (${d.room})</option>
    `).join('');
    if (curVal) docLoginSelect.value = curVal;
  }

  // Populate Doctor Directory Reference
  if (docDirectoryList && state.doctors.length > 0) {
    docDirectoryList.innerHTML = state.doctors.map(d => `
      <div class="py-2 flex justify-between items-center text-xs hover:bg-slate-100 px-2 rounded-lg transition cursor-pointer" onclick="fillDoctorCredentials('${d.username || d.name}')">
        <div>
          <span class="font-bold text-slate-800">${d.name}</span>
          <span class="text-slate-500 block text-[11px]">${d.specialty} (${d.room})</span>
        </div>
        <div class="text-right">
          <span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono text-[10px] border border-emerald-200">Select</span>
        </div>
      </div>
    `).join('');
  }
}

// Doctor selection change
function onDoctorSelectChange(sel) {
  const input = document.getElementById('docLoginUser');
  if (sel.value) {
    input.value = sel.value;
    const passInput = document.getElementById('docLoginPass');
    if (passInput) passInput.focus();
  }
}

// Fill doctor credentials into input WITHOUT auto-login
function fillDoctorCredentials(usernameOrName) {
  const userInput = document.getElementById('docLoginUser');
  const selectDropdown = document.getElementById('docLoginSelect');
  const passInput = document.getElementById('docLoginPass');
  if (userInput) userInput.value = usernameOrName;
  if (selectDropdown) selectDropdown.value = usernameOrName;
  if (passInput) {
    passInput.focus();
    showToast(`Selected ${usernameOrName}. Please enter your password to sign in.`, 'info');
  }
}

// ==================== AUDIO ALERT (WEB AUDIO SYNTH) ====================
function playEmergencyChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15); // A4
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3); // A5
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    // Audio context may require prior user interaction
  }
}

// ==================== HOME TAB RENDERING ====================
function renderHomeView() {
  const table = document.getElementById('homeDoctorTable');
  if (!table) return;

  if (state.doctors.length === 0) {
    table.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">No doctors registered yet.</td></tr>`;
    return;
  }

  table.innerHTML = state.doctors.map(doc => {
    const isServingEmergency = doc.currentServingIsEmergency;
    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="px-6 py-4 font-bold text-slate-900">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs">
            <i class="fa-solid fa-door-closed text-slate-400"></i> ${doc.room}
          </span>
        </td>
        <td class="px-6 py-4">
          <div class="font-bold text-slate-900">${doc.name}</div>
          <div class="text-xs text-brand-600 font-medium">${doc.specialty}</div>
        </td>
        <td class="px-6 py-4">
          ${doc.currentServingToken ? `
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isServingEmergency ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-800'}">
              <i class="fa-solid ${isServingEmergency ? 'fa-truck-medical text-red-600' : 'fa-circle-check text-emerald-600'}"></i>
              ${doc.currentServingDisplay}
            </span>
          ` : `
            <span class="text-xs text-slate-400 font-medium italic">Idle (Chamber Ready)</span>
          `}
        </td>
        <td class="px-6 py-4">
          ${doc.emergencyQueueCount > 0 ? `
            <span class="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full animate-bounce">
              <i class="fa-solid fa-triangle-exclamation text-amber-300"></i> ${doc.emergencyQueueCount} Emergency
            </span>
          ` : `
            <span class="text-xs text-slate-400">0</span>
          `}
        </td>
        <td class="px-6 py-4 font-semibold text-slate-700">
          ${doc.regularQueueCount > 0 ? `
            <span class="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-bold">
              ${doc.regularQueueCount} Tokens Waiting (~${doc.regularQueueCount * 10}m)
            </span>
          ` : `
            <span class="text-xs text-emerald-600 font-bold">No Wait</span>
          `}
        </td>
        <td class="px-6 py-4 text-center">
          <button onclick="openBookModalForDoctor('${doc.id}')" class="text-xs bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-3 py-1.5 rounded-lg border border-brand-200 transition">
            Book Token
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openBookModalForDoctor(docId) {
  openBookModal();
  const select = document.getElementById('rtnDoctorId');
  if (select) select.value = docId;
}

// ==================== PATIENT AUTH & ACTIONS ====================
function switchPatientAuthMode(mode) {
  const loginBtn = document.getElementById('btnPatientAuthLogin');
  const regBtn = document.getElementById('btnPatientAuthRegister');
  const loginForm = document.getElementById('formPatientLogin');
  const regForm = document.getElementById('formPatientRegister');

  if (mode === 'login') {
    loginBtn.className = 'flex-1 pb-3 text-brand-600 border-b-2 border-brand-600 font-bold';
    regBtn.className = 'flex-1 pb-3 text-slate-400 border-b-2 border-transparent font-bold';
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
  } else {
    loginBtn.className = 'flex-1 pb-3 text-slate-400 border-b-2 border-transparent font-bold';
    regBtn.className = 'flex-1 pb-3 text-brand-600 border-b-2 border-brand-600 font-bold';
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
  }
}

async function handlePatientLogin(e) {
  e.preventDefault();
  const username = document.getElementById('patientLoginUser').value.trim();
  const password = document.getElementById('patientLoginPass').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role: 'patient' })
    });
    const data = await res.json();

    if (data.success) {
      state.currentUser = data.user;
      localStorage.setItem('lifecare_user', JSON.stringify(data.user));
      setupSessionUI();
      showToast(`Welcome back, ${data.user.name}!`, 'success');
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (err) {
    showToast('Network error during login', 'error');
  }
}

async function handlePatientRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regPatientName').value.trim();
  const age = document.getElementById('regPatientAge').value;
  const gender = document.getElementById('regPatientGender').value;
  const phone = document.getElementById('regPatientPhone').value.trim();
  const password = document.getElementById('regPatientPass').value;

  try {
    const res = await fetch('/api/auth/register-patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, age, gender, phone, password })
    });
    const data = await res.json();

    if (data.success) {
      showToast(data.message, 'success');
      switchPatientAuthMode('login');
      document.getElementById('patientLoginUser').value = phone;
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (err) {
    showToast('Failed to register', 'error');
  }
}

function loadPatientAppointments() {
  if (!state.currentUser) return;
  renderPatientAppointments();
}

function renderPatientAppointments() {
  const container = document.getElementById('patientAppointmentsContainer');
  if (!container || !state.currentUser) return;

  const userPhone = state.currentUser.phone || state.currentUser.username;
  const myAppts = state.appointments.filter(a => a.phone === userPhone || a.patientName === state.currentUser.name);

  // Update active count
  const activeCount = myAppts.filter(a => a.status === 'WAITING' || a.status === 'EMERGENCY_WAITING' || a.status === 'IN_CONSULTATION').length;
  document.getElementById('patActiveCount').textContent = activeCount;

  if (myAppts.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <i class="fa-solid fa-calendar-xmark text-4xl mb-3 text-slate-300"></i>
        <p class="font-medium text-sm">No appointment bookings found for your account.</p>
        <p class="text-xs text-slate-400 mt-1">Book an OPD token or get an Emergency pass to see it here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = myAppts.map(a => {
    const isEmg = a.isEmergency;
    let statusBadge = '';
    if (a.status === 'WAITING' || a.status === 'EMERGENCY_WAITING') {
      statusBadge = isEmg 
        ? `<span class="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-full animate-pulse">EMERGENCY ADMIT (NO TOKEN)</span>`
        : `<span class="bg-amber-100 text-amber-800 font-bold text-xs px-2.5 py-1 rounded-full">Waiting in Queue</span>`;
    } else if (a.status === 'IN_CONSULTATION') {
      statusBadge = `<span class="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full animate-bounce">NOW CONSULTING IN CHAMBER</span>`;
    } else if (a.status === 'COMPLETED') {
      statusBadge = `<span class="bg-slate-100 text-slate-600 font-medium text-xs px-2.5 py-1 rounded-full">Completed</span>`;
    }

    return `
      <div class="py-4 flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${isEmg ? 'bg-red-600 text-white shadow-md shadow-red-500/30' : 'bg-brand-50 text-brand-700 border border-brand-200'}">
            ${isEmg ? `
              <i class="fa-solid fa-bolt text-amber-300 text-lg"></i>
              <span class="text-[9px] uppercase tracking-wider font-extrabold">EMG PASS</span>
            ` : `
              <span class="text-xs font-semibold">TOKEN</span>
              <span class="text-lg leading-none">${a.tokenNumber}</span>
            `}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-900">${a.doctorName}</span>
              <span class="text-xs text-slate-500">(${a.specialty})</span>
            </div>
            <div class="text-xs text-slate-500 mt-0.5">
              ${isEmg ? `Emergency: <strong class="text-red-600">${a.emergencyCategory || a.symptoms}</strong>` : `Symptoms: ${a.symptoms}`}
            </div>
            <div class="text-[11px] text-slate-400 mt-1">Booked: ${new Date(a.createdAt).toLocaleTimeString()}</div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          ${statusBadge}
          ${isEmg ? `
            <button onclick="displayEmergencyPassModal(${JSON.stringify(a).replace(/"/g, '&quot;')})" class="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg border border-red-200">
              View Direct Pass
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ==================== DOCTOR PORTAL LOGIC ====================
async function handleDoctorLogin(e) {
  e.preventDefault();
  const username = document.getElementById('docLoginUser').value.trim();
  const password = document.getElementById('docLoginPass').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role: 'doctor' })
    });
    const data = await res.json();

    if (data.success) {
      state.currentUser = data.user;
      localStorage.setItem('lifecare_user', JSON.stringify(data.user));
      setupSessionUI();
      showToast(`Welcome, ${data.user.name}!`, 'success');
    } else {
      showToast(data.message || 'Doctor login failed', 'error');
    }
  } catch (err) {
    showToast('Login request error', 'error');
  }
}

function quickLoginDoctor(username, password) {
  fillDoctorCredentials(username);
}

function renderDoctorChamber() {
  if (!state.currentUser || state.currentUser.role !== 'doctor') return;
  const docId = state.currentUser.doctorId;
  const doctor = state.doctors.find(d => d.id === docId);

  if (doctor) {
    document.getElementById('chamberDocName').textContent = doctor.name;
    document.getElementById('chamberDocRoom').textContent = doctor.room;
    document.getElementById('chamberDocSpecialty').textContent = `${doctor.specialty} • ${doctor.experience || 'Specialist'}`;
  }

  // Filter appointments for this doctor
  const docAppts = state.appointments.filter(a => a.doctorId === docId);

  // Currently in consultation
  const currentServing = docAppts.find(a => a.status === 'IN_CONSULTATION');
  const currentContainer = document.getElementById('currentPatientContainer');

  if (currentServing) {
    const isEmg = currentServing.isEmergency;
    currentContainer.innerHTML = `
      <div class="flex flex-wrap justify-between items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black ${isEmg ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/40' : 'bg-emerald-600 text-white'}">
            ${isEmg ? `
              <i class="fa-solid fa-truck-medical text-xl text-amber-300"></i>
              <span class="text-[9px] uppercase tracking-wider font-extrabold">EMG DIRECT</span>
            ` : `
              <span class="text-xs uppercase font-medium">TOKEN</span>
              <span class="text-2xl font-black">${currentServing.tokenNumber}</span>
            `}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-2xl font-black text-slate-900">${currentServing.patientName}</h3>
              <span class="text-xs text-slate-500 font-semibold">${currentServing.age} Yrs / ${currentServing.gender}</span>
              ${isEmg ? `<span class="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Priority 0 Emergency</span>` : ''}
            </div>
            <div class="text-xs text-slate-600 mt-1">
              <strong>Chief Complaint:</strong> ${currentServing.emergencyCategory || currentServing.symptoms}
            </div>
            <div class="text-xs text-slate-400 mt-0.5">Phone: ${currentServing.phone}</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="updateAppointmentStatus('${currentServing.id}', 'COMPLETED')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition flex items-center gap-1.5">
            <i class="fa-solid fa-check"></i> Complete Consultation
          </button>
          <button onclick="updateAppointmentStatus('${currentServing.id}', 'SKIPPED')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition">
            Mark Absent / Skip
          </button>
        </div>
      </div>
    `;
  } else {
    currentContainer.innerHTML = `
      <div class="text-center py-6 text-slate-400">
        <i class="fa-solid fa-person-circle-question text-4xl mb-2 text-slate-300"></i>
        <p class="font-medium text-sm">Chamber is currently idle. Click "CALL NEXT PATIENT" to begin consultation.</p>
      </div>
    `;
  }

  // Emergency Queue List (Priority 0)
  const emergencyWaiting = docAppts.filter(a => a.isEmergency && a.status === 'EMERGENCY_WAITING');
  document.getElementById('docEmergencyCountBadge').textContent = `${emergencyWaiting.length} Critical`;
  const emgListEl = document.getElementById('docEmergencyQueueList');

  if (emergencyWaiting.length === 0) {
    emgListEl.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs">No pending emergency patients</div>`;
  } else {
    emgListEl.innerHTML = emergencyWaiting.map(a => `
      <div class="py-3 flex justify-between items-center gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-black text-red-600 tracking-wider">🚨 DIRECT PASS</span>
            <span class="font-bold text-slate-900 text-sm">${a.patientName} (${a.age}y, ${a.gender})</span>
          </div>
          <div class="text-xs text-red-700 font-semibold mt-0.5">${a.emergencyCategory || a.symptoms}</div>
          <div class="text-[11px] text-slate-400">Contact: ${a.phone}</div>
        </div>
        <button onclick="callSpecificPatient('${a.id}')" class="bg-red-600 hover:bg-red-700 text-white font-black px-3 py-1.5 rounded-lg text-xs shadow transition">
          Admit Now
        </button>
      </div>
    `).join('');
  }

  // Regular Tokens Queue List
  const regularWaiting = docAppts.filter(a => !a.isEmergency && a.status === 'WAITING');
  document.getElementById('docRegularCountBadge').textContent = `${regularWaiting.length} Waiting`;
  const regListEl = document.getElementById('docRegularQueueList');

  if (regularWaiting.length === 0) {
    regListEl.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs">No regular tokens in queue</div>`;
  } else {
    regListEl.innerHTML = regularWaiting.map(a => `
      <div class="py-3 flex justify-between items-center gap-3">
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-center">
            ${a.tokenNumber}
          </span>
          <div>
            <div class="font-bold text-slate-900 text-sm">${a.patientName} (${a.age}y)</div>
            <div class="text-xs text-slate-500">${a.symptoms}</div>
          </div>
        </div>
        <button onclick="callSpecificPatient('${a.id}')" class="bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold px-3 py-1.5 rounded-lg text-xs border border-brand-200 transition">
          Call Token
        </button>
      </div>
    `).join('');
  }
}

// Doctor calls next patient (Priority Queue: Emergency first, then regular token)
async function doctorCallNext() {
  if (!state.currentUser || state.currentUser.role !== 'doctor') return;
  const docId = state.currentUser.doctorId;

  try {
    const res = await fetch(`/api/doctors/${docId}/call-next`, { method: 'POST' });
    const data = await res.json();

    if (data.success) {
      showToast(data.message, data.nowServing?.isEmergency ? 'warning' : 'success');
      if (data.nowServing?.isEmergency) playEmergencyChime();
      loadAllData();
    } else {
      showToast(data.message || 'Could not call next patient', 'error');
    }
  } catch (err) {
    showToast('Failed to call next patient', 'error');
  }
}

// Call a specific patient directly
async function callSpecificPatient(apptId) {
  await updateAppointmentStatus(apptId, 'IN_CONSULTATION');
}

// Update appointment status
async function updateAppointmentStatus(apptId, status) {
  try {
    const res = await fetch(`/api/appointments/${apptId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Status updated to ${status}`, 'info');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to update status', 'error');
  }
}

// ==================== ADMIN PORTAL LOGIC ====================
async function handleAdminLogin(e) {
  e.preventDefault();
  const username = document.getElementById('adminLoginUser').value.trim();
  const password = document.getElementById('adminLoginPass').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role: 'admin' })
    });
    const data = await res.json();

    if (data.success) {
      state.currentUser = data.user;
      localStorage.setItem('lifecare_user', JSON.stringify(data.user));
      setupSessionUI();
      showToast('Admin logged in successfully', 'success');
    } else {
      showToast(data.message || 'Invalid admin credentials', 'error');
    }
  } catch (err) {
    showToast('Login request error', 'error');
  }
}

function renderAdminDashboard() {
  if (!state.currentUser || state.currentUser.role !== 'admin') return;

  // Render KPI Metrics
  if (state.analytics) {
    document.getElementById('kpiTotalAppts').textContent = state.analytics.totalAppointments;
    document.getElementById('kpiEmergencyCases').textContent = state.analytics.totalEmergency;
    document.getElementById('kpiInConsultation').textContent = state.analytics.inConsultation;
    document.getElementById('kpiAvgWait').textContent = `${state.analytics.avgWaitMinutes} min`;
  }

  // Render Doctors Table
  const docTable = document.getElementById('adminDoctorsTable');
  if (docTable) {
    docTable.innerHTML = state.doctors.map(d => `
      <tr class="hover:bg-slate-50 transition">
        <td class="px-6 py-4 font-bold text-slate-900">${d.name}</td>
        <td class="px-6 py-4 text-xs font-semibold text-brand-600">${d.specialty}</td>
        <td class="px-6 py-4 text-xs font-mono text-slate-700">${d.room}</td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${d.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
            <span class="w-1.5 h-1.5 rounded-full ${d.status === 'Available' ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
            ${d.status}
          </span>
        </td>
        <td class="px-6 py-4 text-xs font-bold text-slate-700">
          ${d.totalWaitingCount} (${d.emergencyQueueCount} Emergency)
        </td>
        <td class="px-6 py-4 text-right">
          <button onclick="adminDeleteDoctor('${d.id}')" class="text-red-500 hover:text-red-700 text-xs font-bold p-1">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Render Master Appointments Table
  const apptsTable = document.getElementById('adminAppointmentsTable');
  if (apptsTable) {
    if (state.appointments.length === 0) {
      apptsTable.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400 text-xs">No appointments in the queue.</td></tr>`;
      return;
    }

    apptsTable.innerHTML = state.appointments.map(a => {
      const isEmg = a.isEmergency;
      return `
        <tr class="hover:bg-slate-50 transition ${isEmg ? 'bg-red-50/40' : ''}">
          <td class="px-6 py-3">
            ${isEmg ? `
              <span class="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                EMERGENCY
              </span>
            ` : `
              <span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                ROUTINE OPD
              </span>
            `}
          </td>
          <td class="px-6 py-3 font-mono font-bold text-xs ${isEmg ? 'text-red-700' : 'text-brand-700'}">
            ${isEmg ? (a.emergencyPassCode || 'DIRECT PASS') : a.tokenNumber}
          </td>
          <td class="px-6 py-3">
            <div class="font-bold text-slate-900 text-xs">${a.patientName}</div>
            <div class="text-[11px] text-slate-400">${a.phone}</div>
          </td>
          <td class="px-6 py-3 text-xs text-slate-700 font-medium">
            ${a.doctorName}
          </td>
          <td class="px-6 py-3 font-bold text-xs">
            ${isEmg ? `<span class="text-red-600">Priority 0 (Immediate)</span>` : `<span class="text-slate-500">Priority 1 (FIFO)</span>`}
          </td>
          <td class="px-6 py-3">
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${
              a.status === 'IN_CONSULTATION' ? 'bg-emerald-100 text-emerald-800' :
              a.status === 'COMPLETED' ? 'bg-slate-100 text-slate-500' :
              isEmg ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
            }">
              ${a.status}
            </span>
          </td>
          <td class="px-6 py-3 text-center">
            ${a.status !== 'COMPLETED' ? `
              <button onclick="updateAppointmentStatus('${a.id}', 'COMPLETED')" class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">
                Finish
              </button>
            ` : `<span class="text-xs text-slate-400">Done</span>`}
          </td>
        </tr>
      `;
    }).join('');
  }
}

async function adminDeleteDoctor(docId) {
  if (!confirm('Are you sure you want to remove this doctor?')) return;
  try {
    const res = await fetch(`/api/admin/doctors/${docId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Doctor removed', 'info');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to delete doctor', 'error');
  }
}

async function adminResetQueue() {
  if (!confirm('Are you sure you want to flush the queue? All waiting appointments will be cleared for the new shift.')) return;
  try {
    const res = await fetch('/api/admin/reset-queue', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast('Queue reset successfully', 'success');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to reset queue', 'error');
  }
}

// Add Doctor
function openAddDoctorModal() {
  document.getElementById('modalAddDoctor').classList.remove('hidden');
}
function closeAddDoctorModal() {
  document.getElementById('modalAddDoctor').classList.add('hidden');
}

async function handleAddDoctorSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('newDocName').value.trim();
  const specialty = document.getElementById('newDocSpecialty').value.trim();
  const room = document.getElementById('newDocRoom').value.trim();
  const experience = document.getElementById('newDocExp').value.trim();
  const username = document.getElementById('newDocUsername').value.trim();
  const password = document.getElementById('newDocPassword').value.trim();

  try {
    const res = await fetch('/api/admin/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, specialty, room, experience, username, password })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Doctor added successfully!', 'success');
      closeAddDoctorModal();
      document.getElementById('formAddDoctor').reset();
      loadAllData();
    } else {
      showToast(data.message || 'Failed to add doctor', 'error');
    }
  } catch (err) {
    showToast('Error adding doctor', 'error');
  }
}

// ==================== LIVE DISPLAY BOARD (WAITING SIGNAGE) ====================
function renderLiveDisplayBoard() {
  const grid = document.getElementById('signageGrid');
  if (!grid) return;

  grid.innerHTML = state.doctors.map(doc => {
    const isServingEmergency = doc.currentServingIsEmergency;
    return `
      <div class="bg-slate-800/90 rounded-2xl p-6 border ${isServingEmergency ? 'border-red-500 emergency-glow' : 'border-slate-700'} flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start">
            <div>
              <span class="text-xs font-bold text-amber-400 font-mono tracking-wider">${doc.room}</span>
              <h3 class="text-xl font-black text-white mt-0.5">${doc.name}</h3>
              <p class="text-xs text-slate-400">${doc.specialty}</p>
            </div>
            ${doc.emergencyQueueCount > 0 ? `
              <span class="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full animate-bounce">
                🚨 ${doc.emergencyQueueCount} EMG
              </span>
            ` : ''}
          </div>

          <!-- NOW SERVING DISPLAY -->
          <div class="mt-6 text-center bg-slate-900/90 p-5 rounded-2xl border border-slate-700">
            <div class="text-[10px] font-extrabold uppercase tracking-widest ${isServingEmergency ? 'text-red-400 animate-pulse' : 'text-slate-400'}">
              ${isServingEmergency ? '🚨 EMERGENCY IN PROGRESS' : 'NOW CONSULTING'}
            </div>
            <div class="text-3xl font-black tracking-tight mt-1 ${isServingEmergency ? 'text-red-400' : 'text-emerald-400'}">
              ${doc.currentServingToken ? (isServingEmergency ? 'DIRECT EMG PASS' : doc.currentServingToken) : '-- IDLE --'}
            </div>
            ${doc.currentServingPatient ? `
              <div class="text-xs text-slate-300 font-semibold mt-1 truncate">
                ${doc.currentServingPatient}
              </div>
            ` : ''}
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
          <span>Tokens Waiting: <strong class="text-white">${doc.regularQueueCount}</strong></span>
          <span>Avg Wait: <strong class="text-amber-400">${doc.regularQueueCount * 10} min</strong></span>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== MODALS & BOOKING HANDLERS ====================
// Emergency Modal
function openEmergencyModal() {
  document.getElementById('modalEmergency').classList.remove('hidden');
  populateDoctorDropdowns();
}
function closeEmergencyModal() {
  document.getElementById('modalEmergency').classList.add('hidden');
}

// Emergency Submission (NO TOKEN NUMBER!)
async function handleEmergencySubmit(e) {
  e.preventDefault();
  const patientName = document.getElementById('emgPatientName').value.trim();
  const age = document.getElementById('emgAge').value;
  const gender = document.getElementById('emgGender').value;
  const phone = document.getElementById('emgPhone').value.trim();
  const emergencyCategory = document.getElementById('emgCategory').value;
  const doctorId = document.getElementById('emgDoctorId').value;
  const symptoms = document.getElementById('emgSymptoms').value.trim();

  try {
    const res = await fetch('/api/appointments/emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName, age, gender, phone, emergencyCategory, doctorId, symptoms })
    });
    const data = await res.json();

    if (data.success) {
      closeEmergencyModal();
      document.getElementById('formEmergencyBooking').reset();
      
      // Play emergency alert chime
      playEmergencyChime();

      // Show Toast
      showToast('EMERGENCY FAST-TRACK REGISTERED! Direct Entry Granted.', 'warning');

      // Display Emergency Pass Receipt
      displayEmergencyPassModal(data.appointment, data.hospitalGuide);
      
      // Reload Data
      loadAllData();
    } else {
      showToast(data.message || 'Emergency registration failed', 'error');
    }
  } catch (err) {
    showToast('Failed to connect for emergency admission', 'error');
  }
}

// Display Emergency Pass Receipt Modal
function displayEmergencyPassModal(appt, guide) {
  const modal = document.getElementById('modalEmergencyPassReceipt');
  const container = document.getElementById('emergencyPassReceiptContent');

  container.innerHTML = `
    <div class="bg-red-50 p-4 rounded-2xl border border-red-200 text-center">
      <div class="text-xs font-bold text-red-600 uppercase tracking-wider">Emergency Pass Identifier</div>
      <div class="text-2xl font-black text-red-700 tracking-wider mt-1">${appt.emergencyPassCode || appt.id}</div>
      <div class="text-xs font-black text-red-800 mt-1 inline-block bg-white px-2.5 py-0.5 rounded-full border border-red-300">
        PRIORITY 0 • PRE-EMPTIVE PASS
      </div>
    </div>

    <div class="space-y-2 text-xs divide-y divide-slate-100">
      <div class="pt-2 flex justify-between">
        <span class="text-slate-500">Patient Name:</span>
        <span class="font-bold text-slate-900">${appt.patientName} (${appt.age}y / ${appt.gender})</span>
      </div>
      <div class="pt-2 flex justify-between">
        <span class="text-slate-500">Emergency Type:</span>
        <span class="font-bold text-red-600 text-right">${appt.emergencyCategory || 'Critical Emergency'}</span>
      </div>
      <div class="pt-2 flex justify-between">
        <span class="text-slate-500">Assigned Chamber:</span>
        <span class="font-bold text-slate-900">${appt.doctorName} (${appt.specialty})</span>
      </div>
      <div class="pt-2 flex justify-between">
        <span class="text-slate-500">Token Requirement:</span>
        <span class="font-black text-emerald-600">ZERO TOKEN (BYPASS AUTHORIZED)</span>
      </div>
      <div class="pt-2 flex justify-between">
        <span class="text-slate-500">Time Registered:</span>
        <span class="font-mono text-slate-700">${new Date(appt.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>

    <div class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
      <i class="fa-solid fa-triangle-exclamation text-amber-600 mr-1"></i>
      <strong>Action Required:</strong> Proceed immediately to the emergency triage / chamber door. Show this screen or pass code to the nurse for instant escort.
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeEmergencyReceipt() {
  document.getElementById('modalEmergencyPassReceipt').classList.add('hidden');
}

// Routine Booking Modal
function openBookModal() {
  document.getElementById('modalBookRoutine').classList.remove('hidden');
  populateDoctorDropdowns();
}
function closeBookModal() {
  document.getElementById('modalBookRoutine').classList.add('hidden');
}

async function handleRoutineSubmit(e) {
  e.preventDefault();
  const patientName = document.getElementById('rtnPatientName').value.trim();
  const age = document.getElementById('rtnAge').value;
  const gender = document.getElementById('rtnGender').value;
  const phone = document.getElementById('rtnPhone').value.trim();
  const doctorId = document.getElementById('rtnDoctorId').value;
  const symptoms = document.getElementById('rtnSymptoms').value.trim();

  try {
    const res = await fetch('/api/appointments/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName, age, gender, phone, doctorId, symptoms })
    });
    const data = await res.json();

    if (data.success) {
      closeBookModal();
      document.getElementById('formRoutineBooking').reset();
      showToast(`Appointment Confirmed! Token: ${data.appointment.tokenNumber}`, 'success');
      loadAllData();
      
      // Auto-switch to patient tab if logged in or show alert
      if (state.currentUser && state.currentUser.role === 'patient') {
        switchTab('patient');
      }
    } else {
      showToast(data.message || 'Failed to book appointment', 'error');
    }
  } catch (err) {
    showToast('Error booking appointment', 'error');
  }
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');

  const bgColors = {
    info: 'bg-slate-900 text-white',
    success: 'bg-emerald-600 text-white',
    warning: 'bg-red-600 text-white font-bold',
    error: 'bg-red-700 text-white'
  };

  toast.className = `${bgColors[type] || bgColors.info} px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center gap-2 transform transition-all duration-300 pointer-events-auto`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-emerald-300' : type === 'warning' ? 'fa-triangle-exclamation text-amber-300' : 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-4');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
