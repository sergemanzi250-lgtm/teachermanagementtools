# 🧠 FULL SYSTEM DEVELOPMENT PROMPT  
**Build Complete AI Lesson Planning System using Next.js, Groq (Llama 3.1 70B), Firebase & Tailwind**

You are my senior full-stack engineer.  
Your goal is to build a **complete AI-powered educational content generator** with multiple tools (Lesson Plans, Unit Plans, Schemes of Work, Quizzes, Rubrics, Activities) using:

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Groq API with Llama 3.1 70B
- Firebase Authentication
- Firebase Firestore
- jsPDF or pdfmake for PDF export

Follow all instructions exactly.  
Generate clean, production-ready code and a full project structure.

---

# 🎯 SYSTEM PURPOSE
Build an AI platform like **lessonplan.nexvecta.com**, but **better**, faster, customizable, and multi-tool.

Users can:
- Generate full lesson plans  
- Generate schemes of work  
- Generate quizzes/tests  
- Generate unit plans  
- Generate rubrics/marking guides  
- Generate student activities  
- Save, edit, export and manage outputs in a dashboard  

---

# ⚙️ TECH STACK
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind  
- **Backend:** API routes using Groq SDK  
- **Database:** Firebase Firestore  
- **Auth:** Firebase Authentication  
- **AI Model:** Llama 3.1 70B (model: `llama3-70b-8192`)  
- **PDF Export:** jsPDF or pdfmake  
- **Deployment:** Vercel  

---

# 🧱 REQUIRED FEATURES (BUILD ALL)

## 1️⃣ Lesson Plan Generator
Input fields:
- Subject  
- Grade/Level  
- Topic  
- Duration  
- Learning Objectives  
- Notes  

Output structure:
- Lesson Title  
- Learning Objectives  
- Materials  
- Introduction  
- Warm-up  
- Activities  
- Differentiated Activities  
- Assessment  
- Homework  
- Teacher Notes  

---

## 2️⃣ Scheme of Work Generator
Inputs:
- Subject  
- Grade  
- Weeks  
- List of Topics  

Output:
- Weekly plan  
- Objectives  
- Materials  
- Assessment  

---

## 3️⃣ Unit Plan Generator
Inputs:
- Unit Title  
- Duration  
- Competencies  

Output:
- Unit breakdown  
- Activities  
- Skills focus  
- Assessments  

---

## 4️⃣ Quiz / Test Generator
Inputs:
- Topic  
- Number of questions  
- Difficulty  

Output:
- MCQs  
- True/False  
- Short Answer  
- Answer Key  

---

## 5️⃣ Rubric / Marking Guide Generator
Inputs:
- Assignment description  
- Skills  

Output:
- Performance levels  
- Descriptors  
- Score breakdown  

---

## 6️⃣ Student Activity Generator
Inputs:
- Topic  
- Age group  
- Activity type (group, hands-on, creative, individual)

Output:
- Title  
- Objective  
- Materials  
- Steps  
- Teacher guidance  

---

## 7️⃣ Save All Results to Firestore
Save:
- userId  
- type (lesson, quiz, rubric, etc.)  
- content  
- createdAt  

---

## 8️⃣ Dashboard
Pages:
- Home  
- Lessons  
- Schemes  
- Quizzes  
- Rubrics  
- Unit Plans  
- Activities  

Each item:
- View  
- Edit  
- Delete  
- Export (PDF)  

---

## 9️⃣ PDF Export
Implement:
- Export lesson plan to PDF  
- Export quiz  
- Export rubric  
- Export anything  

Use jsPDF or pdfmake.

---

## 🔟 Clean UI (Tailwind)
- Professional layout  
- Card-based pages  
- Nice spacing  
- Light modern theme  
- Loading spinners  
- Toast messages  
- Copy text button  

---

# 🤖 AI MODEL SETTINGS (IMPORTANT)
Always call the AI using:

```ts
model: "llama3-70b-8192",
temperature: 0.4,
max_tokens: 4096,
