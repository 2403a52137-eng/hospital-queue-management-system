# 🏥 Hospital Queue & Appointment Management System
> **Software Engineering Web Application Project**  
> Features: Multi-Role Portals (Patient, Doctor, Admin), Real-Time Queue Tracking, Digital Waiting Signage, and **Zero-Token Emergency Fast-Track Bypass**.

---

## 🌟 Key Highlights & Problem Solved

In traditional hospital Outpatient Departments (OPD):
1. **Queue Congestion:** Patients wait hours without knowing how many people are ahead or when their turn will come.
2. **Emergency Bottleneck:** In critical conditions (heart attack, acute trauma, asthma attack, pediatric seizure), **making patients wait in a token queue can be fatal**.

### 💡 The Solution Implemented in this Project:
- **Regular Appointments:** Automated sequential token generation (`T-01`, `T-02`, etc.) with real-time wait time calculation and live status tracking.
- **🚨 Emergency Fast-Track (NO TOKEN NUMBER):** When an emergency is flagged, the system **completely bypasses token numbering**, issues an authorized **Emergency Direct Pass (Priority Level 0)**, triggers an instant audio-visual alert in the doctor's chamber, and pre-empts the routine queue so the patient proceeds directly to the doctor with zero wait time.

---

## 🏛️ System Architecture & Role Portals

| Role | Access URL / Portal | Key Capabilities |
| :--- | :--- | :--- |
| **🚨 Emergency Fast-Track** | Direct Modal on Home | **Zero-Token Bypass**. Instant Emergency Pass (Priority 0), direct doctor/ER room assignment, doctor screen alert. |
| **👤 Patient Portal** | `/index.html#patient` | Register / Login, Book OPD tokens, live queue position ("X patients ahead"), view active passes. |
| **👨‍⚕️ Doctor Chamber** | `/index.html#doctor` | Dedicated OPD chamber dashboard, view Priority 0 emergency cases at top in flashing red, "Call Next Patient" algorithm. |
| **🛡️ Admin Control** | `/index.html#admin` | Live hospital KPI counters (Total patients, emergency count, average wait times), add/remove doctors, queue flushing. |
| **📺 Digital Display Board** | `/index.html#display` | Public waiting-hall digital signage displaying chamber rooms, now-serving tokens, and emergency alert notices. |

---

## ⚙️ How Emergency Bypass Works (Priority Queue Algorithm)

This project implements a **Priority Queue Data Structure** (Pre-emptive Scheduling):

```
                        [ Patient Enters Hospital ]
                                    |
                    +---------------+---------------+
                    |                               |
          [ Routine Consultation ]          [ 🚨 Acute Emergency ]
                    |                               |
       Assign Sequential Token (T-01)      Bypass Token Numbering!
           Priority Level = 1               Priority Level = 0 (Highest)
                    |                               |
       Enters FIFO Queue Waiting List       Direct Emergency Pass (EMG-PASS)
                    |                               |
                    +---------------+---------------+
                                    |
                    [ Doctor Chamber Queue Engine ]
                                    |
                    Is there any Priority 0 Patient?
                     /                            \
                  (YES)                           (NO)
                   /                                \
     Call Emergency Patient Immediately       Call Next Sequential Token
     (Bypasses All Regular Tokens)             (FIFO Order: T-01, T-02...)
```

---

## 🚀 How to Run the Application

This application is built with **pure Node.js** and standard web technologies. It has **zero external dependency headaches** and runs instantly on any machine!

### Step 1: Open Terminal / Command Prompt
Navigate to the project directory:
```bash
cd "C:\Users\jinna\.gemini\antigravity\scratch\hospital-management-system"
```

### Step 2: Start the Web Server
```bash
node server.js
```
You will see:
```text
==================================================================
  🏥 Hospital Queue & Appointment Management System Server Running
  🌐 Local URL: http://localhost:3000
  ⚡ Mode: Zero-dependency Node.js Standard HTTP Server
==================================================================
```

### Step 3: Open in Any Web Browser
Open your browser and visit:
👉 **`http://localhost:3000`**

---

## 🔑 Demo Login Credentials

For demonstration and viva presentation, pre-configured accounts are ready to use:

### 1. Hospital Administrator
- **Username:** `admin`
- **Password:** `admin123`
- *Access:* Overall hospital statistics, doctor management, master appointment records.

### 2. Doctors (OPD & Emergency Chambers)
*Default password for all doctors:* `doc123`

| Doctor Name | Department / Specialty | Room | Username / Login Name |
| :--- | :--- | :--- | :--- |
| **Dr. Vikram Rao** | Emergency & Trauma Care | ER Chamber 1 | `dr.vikram` or `Dr. Vikram Rao` |
| **Dr. Ramesh Varma** | General Medicine | Room 101 | `dr.ramesh` or `Dr. Ramesh Varma` |
| **Dr. Priya Sharma** | Cardiology (Heart Care) | Room 102 | `dr.priya` or `Dr. Priya Sharma` |
| **Dr. Suresh Kumar** | Orthopedics & Bone Care | Room 103 | `dr.suresh` or `Dr. Suresh Kumar` |
| **Dr. Ananya Reddy** | Pediatrics (Child Specialist)| Room 104 | `dr.ananya` or `Dr. Ananya Reddy` |
| **Dr. Rajesh Kulkarni** | Neurology & Brain Spine | Room 105 | `dr.rajesh` or `Dr. Rajesh Kulkarni` |
| **Dr. Sneha Mukherjee** | Dermatology (Skin & Hair) | Room 106 | `dr.sneha` or `Dr. Sneha Mukherjee` |
| **Dr. Arvind Swamy** | Pulmonology & Chest Care | Room 107 | `dr.arvind` or `Dr. Arvind Swamy` |
| **Dr. Meenakshi Sundaram**| Obstetrics & Gynecology | Room 108 | `dr.meenakshi` or `Dr. Meenakshi Sundaram` |
| **Dr. Harish Chandra** | ENT (Ear, Nose, Throat) | Room 109 | `dr.harish` or `Dr. Harish Chandra` |
| **Dr. Deepa Nambiar** | Ophthalmology (Eye Care) | Room 110 | `dr.deepa` or `Dr. Deepa Nambiar` |
| **Dr. Sanjay Verma** | Gastroenterology (Digestive) | Room 111 | `dr.sanjay` or `Dr. Sanjay Verma` |

### 3. Patient Account
- **Phone / Username:** `9876543210` (or `srinivas`)
- **Password:** `pat123`
- *(Patients can also self-register with their mobile number in 5 seconds)*

---

## 📁 File Structure

```
hospital-management-system/
├── server.js              # Pure Node.js REST API + Static Server (Zero external dependencies)
├── data.json              # Persistent JSON database (Doctors, Appointments, Users)
├── package.json           # Project metadata and run scripts
├── public/
│   ├── index.html         # Responsive Single Page Application UI with Tailwind CSS
│   ├── app.js             # Client-side logic, Live queue sync (4s poll), Audio chime
│   └── styles.css         # Custom animations, emergency pulse glow, print styles
└── README.md              # Project documentation and software engineering report
```

---

## 🎓 Software Engineering Subject Viva Q&A Guide

**Q1: What is the main objective of this project?**  
*Answer:* To optimize patient waiting times in hospitals through a smart queue algorithm, while ensuring that life-threatening emergencies completely bypass token queues for immediate doctor intervention.

**Q2: How does the system handle emergencies without tokens?**  
*Answer:* Routine bookings receive sequential FIFO tokens (`T-01`, `T-02`) with `Priority = 1`. When an emergency is registered, the system skips token assignment, sets `Priority = 0`, generates an Emergency Pass code, alerts the doctor chamber, and places the patient at the head of the doctor's consultation queue regardless of how many regular tokens are waiting.

**Q3: What data structures and architectural patterns are used?**  
*Answer:*  
- **Architecture:** Client-Server RESTful architecture and Single Page Application (SPA).  
- **Data Structure:** Priority Queue (Min-Heap principle: lowest priority number = highest urgency).  
- **Design Pattern:** Role-Based Access Control (RBAC) separating Patient, Doctor, and Administrator capabilities.
