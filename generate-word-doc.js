/**
 * Script to generate professional Word Document (.doc and .docx)
 * for LifeCare Hospital Queue & Appointment System
 * Student: J. Akshitha (Roll No: 2403A52137)
 */

const fs = require('fs');
const path = require('path');
const { 
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, 
  WidthType, AlignmentType, BorderStyle, ShadingType 
} = require('docx');

// Create Word DOCX using `docx` library
async function generateDocx() {
  const doc = new Document({
    creator: "J. Akshitha",
    title: "LifeCare Hospital Queue and Appointment System - Project Report",
    description: "Software Engineering & System Design Course Project Report",
    sections: [
      {
        properties: {},
        children: [
          // COVER PAGE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "“LIFECARE – SMART HOSPITAL QUEUE AND APPOINTMENT MANAGEMENT SYSTEM WITH EMERGENCY FAST-TRACK BYPASS”",
                bold: true,
                size: 32, // 16pt
                color: "0F4C81",
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: "A Course Project Report",
                bold: true,
                size: 26,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({
                text: "Submitted in partial fulfillment of the completion of the course",
                size: 22,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({
                text: "SOFTWARE ENGINEERING AND SYSTEM DESIGN (24CS301PC311)",
                bold: true,
                size: 26,
                color: "0A2540",
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 200 },
            children: [
              new TextRun({
                text: "In III Year, I Semester B. Tech - CSE",
                bold: true,
                size: 24,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 50 },
            children: [
              new TextRun({
                text: "Submitted by",
                bold: true,
                size: 22,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({
                text: "J. AKSHITHA",
                bold: true,
                size: 28,
                color: "D9381E",
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 250 },
            children: [
              new TextRun({
                text: "Roll Number: 2403A52137",
                bold: true,
                size: 24,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 50 },
            children: [
              new TextRun({
                text: "Under the supervision of the faculty",
                size: 22,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 300 },
            children: [
              new TextRun({
                text: "School of Computer Science & Artificial Intelligence\n2026 – 2027",
                bold: true,
                size: 22,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 50 },
            children: [
              new TextRun({
                text: "Department of Computer Science & Artificial Intelligence",
                bold: true,
                size: 26,
                color: "0F4C81",
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 400 },
            children: [
              new TextRun({
                text: "SR UNIVERSITY\nWarangal, Telangana, India",
                bold: true,
                size: 24,
                font: "Calibri"
              })
            ]
          }),

          // PAGE BREAK FOR REPORT STRUCTURE
          new Paragraph({ pageBreakBefore: true }),

          // REPORT STRUCTURE
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({ text: "REPORT STRUCTURE", bold: true, color: "0F4C81", size: 28, font: "Calibri" })
            ]
          }),

          // Table of Contents
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "S. No.", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Contents", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Page No.", bold: true })] })] }),
                ]
              }),
              ...[
                ["1", "Abstract", "3"],
                ["2", "Introduction", "4"],
                ["2.1", "Problem Statement", "4"],
                ["2.2", "Objectives", "5"],
                ["2.3", "Scope", "5"],
                ["3", "Software Requirements Specification (SRS)", "6"],
                ["3.1", "Functional Requirements", "6"],
                ["3.2", "Non-Functional Requirements", "7"],
                ["3.3", "Hardware and Software Requirements", "8"],
                ["4", "System Analysis", "9"],
                ["4.1", "Existing System", "9"],
                ["4.2", "Proposed System", "10"],
                ["5", "System Design", "11"],
                ["5.1", "System Architecture", "11"],
                ["5.2", "Use Case Diagram", "13"],
                ["5.3", "Class Diagram", "15"],
                ["5.4", "Sequence Diagram", "17"],
                ["5.5", "Activity Diagram", "19"],
                ["6", "Methodology", "21"],
                ["7", "Implementation", "22"],
                ["8", "Testing", "24"],
                ["9", "Output Screenshots & Description", "25"],
                ["10", "Conclusion", "28"],
                ["11", "References", "29"]
              ].map(([sno, title, page]) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: sno })] }),
                  new TableCell({ children: [new Paragraph({ text: title })] }),
                  new TableCell({ children: [new Paragraph({ text: page })] }),
                ]
              }))
            ]
          }),

          // 1. ABSTRACT
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "1. ABSTRACT", bold: true, color: "0F4C81", size: 28 })]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "LifeCare is a Smart Hospital Queue and Appointment Management System engineered to digitize outpatient department (OPD) queue operations, reduce patient waiting times, and enforce an automated Emergency Fast-Track Bypass protocol for acute, critical patients. In conventional hospital setups, patients must physically stand in crowded queues to receive manual tokens, creating immense discomfort and dangerous delays. Crucially, during acute life-threatening medical emergencies (such as cardiac arrest, trauma from road accidents, or acute pediatric distress), forcing patients to queue behind standard tokens can be fatal.",
                size: 22,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "The LifeCare web application provides four dedicated, role-based modules: Patient Portal, Doctor Chamber, Hospital Administrator, and a public Live OPD Digital Signage Display Board.",
                size: 22,
                font: "Calibri"
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Patients ", bold: true }),
              new TextRun({ text: "can register, log in, browse doctors across 12 distinct medical specialties, book routine OPD appointments, receive sequential token numbers (T-01, T-02, etc.), view real-time queue position (\"X patients ahead\"), and track estimated waiting times." })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Emergency Bypass Protocol: ", bold: true, color: "D9381E" }),
              new TextRun({ text: "For urgent medical emergencies, patients or relatives can request an Instant Emergency Pass with a single click. The system completely bypasses token numbering, issues an authorized Priority Level 0 Emergency Pass (EMG-PASS-XXXX), triggers an instant audio-visual chime in the doctor's cabin, and pre-empts all routine tokens so the patient is directed straight into the consultation room with zero wait time." })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Doctor Chamber ", bold: true }),
              new TextRun({ text: "allows medical practitioners across 12 specialties to view their live queue split into two sections: high-priority Emergency Admissions and sequential routine tokens. The \"Call Next Patient\" algorithm executes a pre-emptive Priority Queue that automatically summons emergency cases first before serving routine tokens." })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Admin Dashboard ", bold: true }),
              new TextRun({ text: "provides real-time hospital analytics (total patient footfall, active emergency cases, doctor rosters, average wait times), doctor profile management, and master queue control." })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            bullet: { level: 0 },
            children: [
              new TextRun({ text: "Live Digital Signage Display ", bold: true }),
              new TextRun({ text: "functions as a waiting-hall TV display, broadcasting chamber rooms, active doctor names, currently consulting tokens, and emergency alert notices in real time." })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "The application is built using Node.js, Express REST API architecture, HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), and JSON-based persistent storage. LifeCare successfully eliminates physical queue bottlenecks, enforces pre-emptive emergency triage, and provides a modern healthcare experience.",
                size: 22,
                font: "Calibri"
              })
            ]
          }),

          // 2. INTRODUCTION
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "2. INTRODUCTION", bold: true, color: "0F4C81", size: 28 })]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "Healthcare operations require speed, accuracy, and compassionate accessibility. Outpatient departments (OPD) in hospitals handle hundreds to thousands of patients daily. Traditionally, patients arrive at the hospital, stand in long reception queues to obtain paper slips or physical tokens, and wait for uncertain hours in congested waiting areas without knowing their turn or queue status.",
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "Such unorganized crowding leads to patient frustration, administrative chaos, and cross-infections. More severely, when an acute emergency occurs, traditional reception lines lack an automated mechanism to dynamically re-prioritize clinical attention, often causing catastrophic treatment delays.",
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "LifeCare addresses these challenges by digitizing the appointment booking, queue tracking, and clinical triage workflow into a single responsive web platform. Patients can book OPD tokens from their smartphones or computers, track their live waiting status remotely, and arrive at the doctor's chamber right on time. During emergency situations, the application offers an automated Zero-Token Emergency Bypass, ensuring immediate doctor assignment and instant clinical intervention.",
                size: 22
              })
            ]
          }),

          // 2.1 Problem Statement
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "2.1 Problem Statement", bold: true, size: 24 })]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "Traditional hospital appointment and queue management systems rely heavily on manual reception counters and physical paper tokens. This manual approach causes several critical problems:",
                size: 22
              })
            ]
          }),
          ...[
            "Prolonged Physical Waiting: Patients and their caregivers spend multiple unproductive hours waiting in crowded hospital lobbies.",
            "Lack of Real-Time Queue Transparency: Patients have no visibility into how many patients are ahead of them or the estimated time remaining for their consultation.",
            "Emergency Bottleneck: In critical medical emergencies, there is no automated digital mechanism to pre-empt standard queues, risking life-threatening delays.",
            "Administrative Overload: Manual tracking of doctor availability, room allocation, and patient records creates errors and excessive administrative burden.",
            "No Centralized Signage Display: Waiting halls lack synchronized digital display boards to guide patients to their respective doctor rooms."
          ].map(point => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: point, size: 22 })]
          })),

          // 2.2 Objectives
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "2.2 Objectives", bold: true, size: 24 })]
          }),
          ...[
            "To develop an online hospital queue and appointment management website.",
            "To provide patient registration and secure login facilities.",
            "To display 12 medical specialties and doctor chamber profiles with room numbers.",
            "To implement an automated sequential token generation algorithm (T-01, T-02) for routine OPD bookings.",
            "To provide dynamic queue tracking showing patients ahead and estimated wait times.",
            "To implement an Emergency Fast-Track Bypass system that dispenses Zero-Token Emergency Passes with Priority Level 0.",
            "To trigger real-time audio-visual sirens and alerts in doctor chambers during emergency arrivals.",
            "To build a dedicated Doctor Chamber portal with pre-emptive priority calling (\"Emergency First, FIFO Regular Next\").",
            "To provide an Admin Control Center for monitoring hospital KPIs, doctor rosters, and master queue flushes.",
            "To create a public Digital Waiting Signage board for hospital waiting hall TV screens."
          ].map(obj => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: obj, size: 22 })]
          })),

          // 2.3 Scope
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "2.3 Scope", bold: true, size: 24 })]
          }),
          ...[
            "Patient Management: Self-registration, phone/username login, specialty browsing, routine token generation, live queue tracker, active passes, and consultation history.",
            "Emergency Triage Module: Instant emergency booking without token numbers, classification by acute emergency category, automated Priority 0 tag, Emergency Pass code issuance, and doctor room routing.",
            "Doctor Chamber Module: Secure doctor login across 12 clinical specialties, real-time chamber queue split (Emergency vs Regular), Priority Queue \"Call Next\" engine, consultation timer, and completion logger.",
            "Admin & Analytics Module: Executive KPI dashboard (total visits, active emergency count, average wait time), doctor roster maintenance (add/delete doctors, assign rooms), and hospital-wide queue monitoring.",
            "Digital Display Signage: Full-screen digital display mode for waiting lobby screens with live 4-second synchronization."
          ].map(s => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: s, size: 22 })]
          })),

          // 3. SRS
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "3. SOFTWARE REQUIREMENTS SPECIFICATION (SRS)", bold: true, color: "0F4C81", size: 28 })]
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 100 },
            children: [new TextRun({ text: "3.1 Functional Requirements", bold: true, size: 24 })]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Module", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Functional Requirements", bold: true })] })] }),
                ]
              }),
              ...[
                ["Patient Registration & Login", "Patients can register with name, phone, age, gender, and password. Registered patients can log in securely using phone/username."],
                ["Doctor Catalog", "Displays all 12 registered hospital doctors with specialty, experience, room number, contact, and live availability."],
                ["Routine Token Booking", "Patients choose doctor and symptoms to generate sequential tokens (T-01, T-02) with calculated wait times."],
                ["Emergency Fast-Track (No Token)", "Patients bypass token queues during acute emergencies; generates EMG-PASS-XXXX with Priority 0 for instant doctor routing."],
                ["Live Queue Tracking", "Patients track live queue progress (\"Now Serving\", \"Patients Ahead\", \"Estimated Wait Time\")."],
                ["Doctor Authentication", "Doctors log in using Doctor Name / Username (dr.vikram, dr.ramesh) and password (doc123)."],
                ["Priority Queue Engine", "\"Call Next Patient\" algorithm evaluates priority: Priority 0 (Emergency) called first, followed by FIFO routine tokens."],
                ["Consultation Management", "Doctors can start consultation, complete consultation, or mark absent/skipped patients."],
                ["Emergency Siren Alert", "Generates synthetic Web Audio API chime and blinking visual alerts in doctor cabins upon emergency booking."],
                ["Admin Analytics", "Real-time calculation of total visits, active emergencies, in-consultation count, and average wait time."],
                ["Doctor Roster Management", "Administrators can add new doctors, specify room numbers, and remove doctors from the roster."],
                ["Master Queue Reset", "Administrators can flush shift queues for new OPD sessions."],
                ["Public Display Board", "Auto-refreshing digital signage view displaying room numbers, doctor names, and now-serving tokens."]
              ].map(([m, r]) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: m, bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: r })] }),
                ]
              }))
            ]
          }),

          // 3.2 Non-Functional Requirements
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "3.2 Non-Functional Requirements", bold: true, size: 24 })]
          }),
          ...[
            "Usability: Clean, intuitive UI built with Tailwind CSS, accessible across mobile phones, tablets, and desktop displays.",
            "Performance & Latency: API endpoints respond in under 50 milliseconds; live queue polls and updates every 4 seconds.",
            "Reliability & Pre-emption: Emergency cases immediately pre-empt standard queues without data loss or race conditions.",
            "Portability & Zero Dependencies: Pure Node.js standard library implementation runs out of the box on Windows, Linux, or Cloud.",
            "Security & RBAC: Role-Based Access Control isolates Patient, Doctor, and Administrator capabilities.",
            "Maintainability: Modular separation between API routes, persistent JSON store, and client-side view logic.",
            "Availability: 24/7 cloud readiness compatible with Render, Railway, or local intranet deployment."
          ].map(nf => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: nf, size: 22 })]
          })),

          // 3.3 Hardware and Software Requirements
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "3.3 Hardware and Software Requirements", bold: true, size: 24 })]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Hardware Component", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Minimum Requirement", bold: true })] })] }),
                ]
              }),
              ...[
                ["Processor", "Intel Core i3 (2.0 GHz) or AMD Ryzen 3"],
                ["RAM", "4 GB Minimum"],
                ["Storage", "500 MB free hard drive space"],
                ["Input Devices", "Keyboard and Mouse / Touchscreen"],
                ["Display Device", "1366 x 768 Resolution Monitor"]
              ].map(([h, r]) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: h, bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: r })] }),
                ]
              }))
            ]
          }),
          new Paragraph({ spacing: { before: 100, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Software Component", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Technology / Specification", bold: true })] })] }),
                ]
              }),
              ...[
                ["Operating System", "Windows 10/11, macOS, or Ubuntu Linux"],
                ["Programming Language", "JavaScript (Node.js v18/v20 LTS, ES6+)"],
                ["Backend Framework", "Node.js Built-in HTTP Engine / Express.js REST Framework"],
                ["Frontend Framework", "HTML5, Tailwind CSS (CDN), FontAwesome 6 Icons"],
                ["Database / Storage", "Persistent JSON Database (data.json) / REST Store"],
                ["Code Editor", "Visual Studio Code (VS Code)"],
                ["Web Browser", "Google Chrome, Microsoft Edge, or Mozilla Firefox"],
                ["Cloud Deployment", "Render.com Cloud Web Service / Localhost"]
              ].map(([s, t]) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: s, bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: t })] }),
                ]
              }))
            ]
          }),

          // 4. SYSTEM ANALYSIS
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "4. SYSTEM ANALYSIS", bold: true, color: "0F4C81", size: 28 })]
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 100 },
            children: [new TextRun({ text: "4.1 Existing System", bold: true, size: 24 })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "In the existing manual or legacy hospital OPD system, patients must physically travel to the hospital early in the morning, stand in long admission lines, receive a handwritten slip or mechanical token, and wait in crowded lobbies.",
                size: 22
              })
            ]
          }),
          ...[
            "Unpredictable Waiting Times: Patients have no estimate of when their consultation will begin, resulting in hours of idle waiting.",
            "Fatal Emergency Delays: Critical patients arriving during rush hours must negotiate manual reception desks or risk being queued behind non-critical routine consultations.",
            "High Administrative Overhead: Manual registration registers, doctor availability boards, and physical token counters require extensive human labor.",
            "Lobby Congestion & Infection Risk: Overcrowded waiting halls increase hospital-acquired cross-infections among immunocompromised patients.",
            "No Unified Communication: Doctors have no real-time dashboard to preview incoming emergency trauma cases before the patient reaches the door."
          ].map(lim => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: lim, size: 22 })]
          })),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "4.2 Proposed System", bold: true, size: 24 })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "The proposed LifeCare system replaces manual counters with an intelligent, multi-portal digital appointment and queue engine. Patients book appointments remotely, receive digital tokens, and track queue movement live.",
                size: 22
              })
            ]
          }),
          ...[
            "Zero-Wait Emergency Admissions: Immediate clinical attention for critical cardiac, trauma, stroke, and pediatric emergencies.",
            "Predictable Routine Visits: Patients monitor live wait times from home and arrive just before their token is called.",
            "Dynamic Pre-emptive Priority Queue: Intelligent algorithmic sorting of patients based on urgency rather than simple arrival time.",
            "Centralized Hospital Management: Administrators maintain doctor rosters and track facility KPIs from an executive dashboard.",
            "Real-Time Waiting Signage: Waiting rooms feature automated digital signage synchronized every 4 seconds."
          ].map(adv => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: adv, size: 22 })]
          })),

          // 5. SYSTEM DESIGN
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "5. SYSTEM DESIGN", bold: true, color: "0F4C81", size: 28 })]
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 100 },
            children: [new TextRun({ text: "5.1 System Architecture", bold: true, size: 24 })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "LifeCare follows a 3-Tier Web Architecture comprising Presentation Tier (HTML/Tailwind UI), Application Tier (Node.js REST Services), and Data Tier (Persistent JSON DB).",
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            bullet: { level: 0 },
            children: [new TextRun({ text: "Presentation Layer: ", bold: true }), new TextRun({ text: "HTML5, Tailwind CSS, FontAwesome icons, and Vanilla JavaScript single page interface." })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            bullet: { level: 0 },
            children: [new TextRun({ text: "Application Layer: ", bold: true }), new TextRun({ text: "Node.js REST backend handling authentication, token generation, emergency pass issuance, and Priority Queue scheduling." })]
          }),
          new Paragraph({
            spacing: { after: 150 },
            bullet: { level: 0 },
            children: [new TextRun({ text: "Data Layer: ", bold: true }), new TextRun({ text: "JSON database file (data.json) maintaining users, doctors, tokens, and active consultation queues." })]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "5.2 Use Case Diagram", bold: true, size: 24 })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "The Use Case model defines interactions across three core actors:\n1. Patient: Registers, logs in, browses doctors, books routine OPD tokens, requests Emergency Pass (no token), tracks queue status.\n2. Doctor: Logs in, monitors live chamber queue, summons patients using \"Call Next Patient\" (priority engine), completes or skips consultations.\n3. Administrator: Logs in, reviews hospital KPIs (total patients, active emergencies, avg wait), adds/removes doctors, flushes shift queues.",
                size: 22
              })
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "5.3 Class Diagram", bold: true, size: 24 })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "The main entity classes in LifeCare are User (parent class with attributes id, username, password, role), Patient (inherits User, methods: bookRoutineToken, requestEmergencyPass), Doctor (inherits User, attributes: specialty, room, status, methods: callNextPatient, completeConsultation), Appointment (stores patientName, doctorId, isEmergency, tokenNumber, priority, status), and Admin (methods: viewAnalytics, addDoctor, resetQueue).",
                size: 22
              })
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "5.4 Sequence Diagram", bold: true, size: 24 })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "The sequence diagrams depict two vital interaction paths:\n- Routine Booking Sequence: Patient selects doctor -> submits symptoms -> Server generates sequential token T-(N+1) with Priority = 1 -> enqueues in DB -> displays token and wait time.\n- Emergency Bypass Sequence: Patient clicks Emergency CTA -> enters trauma details -> Server sets tokenNumber = NULL, priority = 0, generates EMG-PASS-XXXX -> alerts Doctor cabin -> Doctor clicks Call Next -> Priority engine summons emergency patient ahead of all waiting tokens.",
                size: 22
              })
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: "5.5 Activity Diagram", bold: true, size: 24 })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "The activity workflow demonstrates the dual-path decision tree: If Emergency, system immediately assigns Priority 0 pass and routes directly to the doctor with audio alerts. If Non-Emergency, the patient logs in, chooses specialty, receives a sequential token, and waits in FIFO order.",
                size: 22
              })
            ]
          }),

          // 6. METHODOLOGY
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "6. METHODOLOGY", bold: true, color: "0F4C81", size: 28 })]
          }),
          ...[
            "Requirement Analysis: Identifying hospital bottlenecks, OPD congestion factors, and critical triage protocols.",
            "System Design: Designing 3-tier architecture, database objects, and UML diagrams.",
            "Frontend Development: Creating responsive views using HTML5, Tailwind CSS, and Vanilla JavaScript.",
            "Backend Development: Implementing Node.js REST API endpoints, routing, and token allocation algorithms.",
            "Database Development: Formulating JSON persistent storage structures for users, doctors, and queues.",
            "Testing: Executing functional, black-box, and priority queue test cases.",
            "Implementation & Deployment: Hosting locally via node server.js and deploying globally via GitHub and Render.com.",
            "Maintenance: Real-time queue sync optimization and live doctor roster controls."
          ].map(m => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: m, size: 22 })]
          })),

          // 7. IMPLEMENTATION
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "7. IMPLEMENTATION", bold: true, color: "0F4C81", size: 28 })]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "File / Module", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Implementation Details", bold: true })] })] }),
                ]
              }),
              ...[
                ["server.js", "Pure Node.js REST API server; handles requests, token allocation, emergency pass generation, and Priority Queue sorting."],
                ["server-express.js", "Alternative Express framework server for enterprise routing and middleware expansion."],
                ["data.json", "Persistent JSON database storing accounts, 12 doctor profiles, tokens, and active appointments."],
                ["package.json", "Project metadata, scripts (npm start), and dependencies."],
                ["public/index.html", "Single Page Application containing Patient Portal, Doctor Chamber, Admin Control Center, and Live Display."],
                ["public/app.js", "Client JavaScript managing 4-second polling synchronization, audio siren synthesis, and modal states."],
                ["public/styles.css", "Custom CSS animations, emergency pulsing glow, and printable pass layout."],
                ["start-app.bat", "Windows 1-click execution script to launch the server and open Chrome automatically."]
              ].map(([f, d]) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: f, bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: d })] }),
                ]
              }))
            ]
          }),
          new Paragraph({ spacing: { before: 150, after: 100 } }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "Core Implemented Features:", bold: true, size: 24 })]
          }),
          ...[
            "12 Multi-Specialty Doctor Chambers: Emergency & Trauma (Dr. Vikram), General Medicine (Dr. Ramesh), Cardiology (Dr. Priya), Orthopedics (Dr. Suresh), Pediatrics (Dr. Ananya), Neurology (Dr. Rajesh), Dermatology (Dr. Sneha), Pulmonology (Dr. Arvind), Gynecology (Dr. Meenakshi), ENT (Dr. Harish), Ophthalmology (Dr. Deepa), Gastroenterology (Dr. Sanjay).",
            "Emergency Zero-Token Protocol: Explicitly bypasses token numbers (tokenNumber = null), assigns Priority = 0, generates EMG-PASS-XXXX, and grants direct room access.",
            "Pre-emptive Priority Queue: Queue Order = min(Priority) -> FIFO(CreatedAt). Priority 0 patients are summoned immediately ahead of standard tokens.",
            "Synthetic Web Audio Alert: Built-in 880Hz/440Hz synthesizer chime sounds in doctor chambers when an emergency occurs.",
            "Waiting Hall Digital Signage: Public display mode broadcasting current serving tokens and room status every 4 seconds."
          ].map(f => new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text: f, size: 22 })]
          })),

          // 8. TESTING
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "8. TESTING", bold: true, color: "0F4C81", size: 28 })]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Test Case", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Scenario & Inputs", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Expected Result", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })] }),
                ]
              }),
              ...[
                ["TC-01", "Home Page Loading", "Home dashboard loads with live doctor chambers", "PASS"],
                ["TC-02", "Routine Token Booking", "Sequential token (T-01) generated with wait time", "PASS"],
                ["TC-03", "Token Increment Test", "Next token increments to T-02 for same doctor", "PASS"],
                ["TC-04", "Emergency Booking (No Token)", "Token is NULL, EMG-PASS issued, Priority = 0", "PASS"],
                ["TC-05", "Pre-emptive Priority Queue", "Emergency patient summoned first ahead of T-01", "PASS"],
                ["TC-06", "Doctor Authentication", "Access granted to Doctor Chamber with doc123", "PASS"],
                ["TC-07", "Doctor Name Matching", "Access granted via full doctor name Dr. Ramesh Varma", "PASS"],
                ["TC-08", "Invalid Login Handling", "Access rejected with error message", "PASS"],
                ["TC-09", "Consultation Status Cycle", "Status transitions to COMPLETED", "PASS"],
                ["TC-10", "Admin Authentication", "Admin Control Center unlocked with admin123", "PASS"],
                ["TC-11", "Add Doctor via Admin", "New doctor added immediately to hospital roster", "PASS"],
                ["TC-12", "Live Sync & Signage", "Digital signage updates within 4 seconds", "PASS"]
              ].map(([tc, sc, er, st]) => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: tc, bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: sc })] }),
                  new TableCell({ children: [new Paragraph({ text: er })] }),
                  new TableCell({ children: [new Paragraph({ text: st, bold: true, color: "008000" })] }),
                ]
              }))
            ]
          }),

          // 9. OUTPUT SCREENSHOTS
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "9. OUTPUT SCREENSHOTS & DESCRIPTION", bold: true, color: "0F4C81", size: 28 })]
          }),
          ...[
            ["Fig 9.1: Home Dashboard & Live Chamber Status", "Displays the live doctor chambers for all 12 specialties, ER hotline ticker, and main portal cards."],
            ["Fig 9.2: Patient Care Portal & Routine Token Booking", "Displays patient sign-in and OPD token generation (Token T-01, Token T-02) with calculated wait times."],
            ["Fig 9.3: Emergency Fast-Track Admission (Zero Token Pass)", "Displays the modal and the printable Emergency Direct Pass (EMG-PASS-8357), stating \"PRIORITY 0 • ZERO TOKEN • DIRECT ADMIT\"."],
            ["Fig 9.4: Doctor Chamber Dashboard & Priority Calling Console", "Displays Dr. Vikram Rao's chamber console with pending emergency cases in pulsing red and the \"Call Next Patient\" priority button."],
            ["Fig 9.5: Hospital Administrator Dashboard & Analytics", "Displays hospital executive KPIs (Total Patients Today, Active Emergency Cases, Avg Wait Time), doctor management table, and master queue."],
            ["Fig 9.6: Live Digital Signage Waiting Hall Display Board", "Displays the full-screen waiting hall board broadcasting chamber rooms and active tokens with 4-second live synchronization."]
          ].map(([fig, desc]) => new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: fig + "\n", bold: true, size: 24, color: "0F4C81" }),
              new TextRun({ text: desc, size: 22 }),
              new TextRun({ text: "\n[Insert Actual Screenshot Here in Printed Document]\n", italic: true, color: "777777" })
            ]
          })),

          // 10. CONCLUSION
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "10. CONCLUSION", bold: true, color: "0F4C81", size: 28 })]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "The LifeCare Hospital Queue and Appointment Management System with Emergency Fast-Track Bypass successfully addresses the severe limitations of traditional paper tokens and congested hospital waiting rooms. By engineering a dual-path system—providing sequential tokens with live queue tracking for routine OPD patients and a pre-emptive Zero-Token Emergency Pass for acute cases—LifeCare ensures that healthcare delivery is both convenient and life-saving.",
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "Built on pure Node.js with modern REST APIs and a responsive Tailwind CSS frontend, the project demonstrates key principles of Software Engineering: Pre-emptive Priority Queue Scheduling, Role-Based Access Control (RBAC), Real-Time Digital Display Synchronization, and Zero-Dependency Lightweight Deployment.",
                size: 22
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "In conclusion, LifeCare stands as an end-to-end, full-stack software solution that eliminates queue chaos, enhances clinical readiness, and guarantees that no emergency patient is delayed by a queue number.",
                size: 22
              })
            ]
          }),

          // 11. REFERENCES
          new Paragraph({ pageBreakBefore: true }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [new TextRun({ text: "11. REFERENCES", bold: true, color: "0F4C81", size: 28 })]
          }),
          ...[
            "1. Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner's Approach (9th ed.). McGraw-Hill Education.",
            "2. Sommerville, I. (2016). Software Engineering (10th ed.). Pearson Education.",
            "3. Node.js Foundation. (2026). Node.js v20 LTS Documentation & Architecture Reference. https://nodejs.org/docs/",
            "4. World Health Organization (WHO). (2022). Emergency and trauma care in hospital outpatient settings: Operational guidelines.",
            "5. Tailwind Labs. (2026). Tailwind CSS Utility-First Framework Documentation. https://tailwindcss.com/docs",
            "6. MDN Web Docs. (2026). Web Audio API: Synthesizing Audio Chimes & Oscillators. Mozilla Developer Network."
          ].map(ref => new Paragraph({
            spacing: { after: 80 },
            children: [new TextRun({ text: ref, size: 22 })]
          }))
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.join(__dirname, 'LifeCare_Hospital_Project_Report.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Word DOCX file generated successfully: ${docxPath}`);
}

generateDocx().catch(err => {
  console.error("Error generating DOCX:", err);
});
