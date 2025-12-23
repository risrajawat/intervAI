# 🚀 IntervAI – AI-Powered Mock Interviews with Voice

**IntervAI** is an AI-powered mock interview platform that simulates real interview experiences using a **voice-based AI interviewer**.  
Users can practice interviews based on their **skills, role, and experience level**, receive adaptive questions, and get actionable feedback — all in a pressure-free environment.

> 🎙️ Talk to an AI interviewer  
> 🎯 Practice real interview questions  
> 📊 Improve confidence, clarity, and concepts

---

## ✨ Why IntervAI?

Preparing for interviews is hard — especially without realistic practice.  
Most platforms are text-based, static, and don’t feel like real interviews.

**IntervAI solves this by:**
- Using a **voice AI interviewer** for natural conversation
- Dynamically adapting questions based on user responses
- Providing structured mock interviews tailored to your skills

---

## 🧠 Key Features

- 🎤 **AI Voice Interviewer**  
  Talk to an AI interviewer in real time using voice (powered by Vapi)

- 🧩 **Skill-Based Interview Generation**  
  Choose your role, skills, and experience level

- 🔁 **Adaptive Follow-up Questions**  
  Questions evolve based on your answers — just like real interviews

- 🔐 **Authentication & User Sessions**  
  Secure login and saved interview history

- 📂 **Interview History Dashboard**  
  View past interviews and track progress

- ⚡ **Fast & Modern UI**  
  Built with Next.js, Tailwind, and shadcn/ui

---

## 🏗️ Tech Stack

### Frontend & Backend
- **Next.js (App Router)**
- **TypeScript**

### UI & Styling
- **Tailwind CSS**
- **shadcn/ui**

### AI & Voice
- **Gemini** – LLM for interview logic and question generation  
- **Vapi** – Real-time AI voice agent

### Database & Authentication
- **Firebase**
  - Authentication
  - Firestore for sessions & reports

---

## 🧩 System Architecture (High-Level)

1. User interacts via voice

2. Voice input is captured by Vapi Voice Agent

3. Request is forwarded to Next.js API routes

4. Gemini LLM processes interview logic and generates questions

5. Response flows back through Next.js

6. Vapi converts AI response into voice output

---

## 🚀 How to Run Locally

Follow these steps to set up and run the project on your local machine:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/risrajawat/intervAI.git
cd intervAI
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file in the root folder and add your keys:
# Firebase Admin (Server-side only)
```bash
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project_id.iam.gserviceaccount.com
```

---

### 4️⃣ Run the Development Server
```bash
npm run dev
```

---

## 👨‍💻 Developer
Built by **Rishabh Singh**

---
