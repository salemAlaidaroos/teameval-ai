# 🪞 MIRA'AH — AI-Powered Team Evaluation System

## About the Project

**Mira'ah** (Mirror) is an intelligent platform developed during the **Academic Integrity Hackathon** — winning **3rd Place** 🏆 — designed to eliminate the "free-riding" phenomenon in collaborative university projects and ensure academic fairness.

The system leverages AI to analyze project requirements, divide tasks with fair weights, and evaluate student contributions accurately and objectively based on actual effort — creating a transparent and equitable academic environment.

---

## ✨ Key Features

- **AI-Powered Fair Distribution:** Automatically splits project requirements into clear tasks, replacing random manual division.
- **"Effort Weights" System (Task Pricing):** Assigns a numerical value to each task based on its complexity level, preventing monopolization of easy tasks.
- **Real-Time Contribution Evaluation:** Analyzes uploaded texts and files to assess the actual quality of a student's work (Critical, Major, Minor).
- **Monitoring & Red Card System:** Early detection of sudden inactivity or unusual activity spikes before final deadlines.
- **Documented Reports (PDF Export):** Exports comprehensive official reports showing each student's contribution percentage, for use by the judging committee or course instructor.

---

## 🛠️ Technologies Used

- **Frontend:** React.js · TypeScript · Vite
- **Styling:** Tailwind CSS (Dark Mode & UI/UX Design)
- **AI Model:** Google Gemini API (`gemini-2.0-flash-preview`)

---

## 📁 File Structure

```
teameval-ai/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx        # Main integrity control panel
│   │   ├── RiskHeatmap.tsx      # Risk heatmap
│   │   ├── SetupWizard.tsx      # Smart project setup screen
│   │   ├── StudentPortal.tsx    # Student portal for submitting contributions
│   │   └── TimelineGraph.tsx    # Project progress tracking graph
│   ├── services/
│   │   └── gemini.ts            # AI model integration services
│   ├── types.ts                 # Data structures
│   ├── App.tsx
│   └── main.tsx
├── .env                         # Environment variables
├── package.json
└── vite.config.ts
```

---

## 🖥️ Platform Screen Tour

### 1. Smart Project Setup & Task Distribution

These screens allow the team leader to input project requirements — either via text or file upload — then the AI model steps in to suggest a task list and "price" each task (assigning a weight from 1 to 10) based on the effort required, ensuring a balanced workload among team members from day one. Team members' names are then entered.

<p align="center">
  <img src="https://github.com/user-attachments/assets/5fd180a8-90a8-4d07-a124-9978025718af" width="800" title="Project Description Input"><br><br>
  <img src="https://github.com/user-attachments/assets/fa5de5b1-10ac-4198-a9fc-35f180cdba67" width="800" title="Task Pricing"><br><br>
  <img src="https://github.com/user-attachments/assets/fbaa60ba-e2b7-4dc5-b712-c65be65a685b" width="800" title="Adding Team Members">
</p>

---

### 2. Student Portal & Contribution Documentation

A dedicated space for each student to view their current tasks. The interface lets students upload their contributions — whether code, files, or direct links. The platform also supports documenting "leadership tasks" to preserve students' credit for organizational work outside of coding.

<p align="center">
  <img src="https://github.com/user-attachments/assets/f9da66cc-900d-446e-9582-4ebb81e3fc31" width="800" title="Student Current Tasks"><br><br>
  <img src="https://github.com/user-attachments/assets/b5f15985-ae60-475d-a3fa-5071c1e79054" width="800" title="Uploading a New Contribution">
</p>

---

### 3. Academic Integrity Dashboard

The beating heart of the platform, designed for evaluators. The dashboard provides live, real-time analysis including:

- **Risk Heatmap:** Detects suspicious behaviors and triggers alerts such as "sudden inactivity" or "abnormal activity."
- **True Distribution:** A chart showing each member's completion percentage.
- **Live Contribution Log:** Automatic AI evaluation of each contribution, classifying it (Critical, Major, Minor) to determine its actual impact on the project.

<p align="center">
  <img src="https://github.com/user-attachments/assets/4f9f32a9-d3bd-4bb3-a285-bad03fbb731c" width="800" title="Dashboard & Risk Heatmap">
</p>

---

### 4. Final Report (PDF Export)

With a single click, the system generates and exports a professionally formatted PDF report. It includes a summary of team efforts, a percentage distribution bar, and a detailed contribution record for each student — serving as the final, fair reference for evaluation.

<p align="center">
  <img src="https://github.com/user-attachments/assets/e53d90fb-dba8-4206-a494-8c84f5911ff1" width="800" title="Final PDF Report">
</p>

---

##  How to Run

> Make sure **Node.js** is installed on your machine before starting.

**1. Add your Gemini API key to the `.env` file:**

```env
VITE_GEMINI_API_KEY="your_api_key_here"
```

**2. Install dependencies:**

```bash
npm install
```

**3. Start the development server:**

```bash
npm run dev
```

## 👥 The Team
* **Salem Zain Alaidaroos** 
* **Omar Ibrahim Al-Ali** 
* **Abdulaziz Khamis Batis** 
* **Osayd Jameel Al-Mezjaji**

---
*Built with ❤️ for the Academic Integrity Hackathon — 🏆 **3rd Place Winners!***
