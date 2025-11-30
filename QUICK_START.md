# 🚀 QUICK REFERENCE GUIDE

## System Overview

You now have a **fully functional AI Lesson Planning System backend**. Here's everything that's been implemented:

---

## 📌 Key Files & Their Locations

### Core Utilities (Ready to Use)
```
✅ /app/Lib/utils/groq.ts           → AI generation with Groq
✅ /app/Lib/firebase/firestore.ts   → Database operations
✅ /app/Lib/utils/pdf.ts            → PDF export
✅ /app/Lib/utils/validation.ts     → Form schemas with Zod
✅ /app/Lib/utils/toast.ts          → Notifications
```

### API Endpoints (Ready)
```
✅ /api/generate-lesson-plan        → Create lesson plans
✅ /api/generate-quiz               → Create quizzes
✅ /api/generate-rubric             → Create rubrics
✅ /api/generate-scheme-of-work     → Create schemes
✅ /api/generate-activity           → Create activities
✅ /api/unit-plan                   → CRUD unit plans
```

### React Components (Ready)
```
✅ /app/components/ReusableForm.tsx → Generic form builder
✅ /app/components/UI.tsx           → Button, Card, Badge, Alert
✅ /app/components/Loading.tsx      → Spinners, skeletons
✅ /app/components/Dashboard.tsx    → Dashboard components
```

---

## 🔄 How Everything Works Together

### Flow Diagram
```
User Form
   ↓
ReusableForm (with Zod validation)
   ↓
API Route (/api/generate-*)
   ↓
Groq AI (generates content)
   ↓
Firestore (saves to database)
   ↓
Dashboard (displays saved items)
   ↓
PDF Export (download as PDF)
```

---

## 💡 HOW TO USE EACH COMPONENT

### 1. Create a Form Page

**Example: `/reb-lesson-plan/page.tsx`**

```tsx
'use client';
import { ReusableForm } from '@/app/components/ReusableForm';
import { RebLessonPlanSchema, RebLessonPlanFormData } from '@/app/Lib/utils/validation';
import { useAuth } from '@/app/Lib/hooks/useAuth';
import { useState } from 'react';

export default function RebLessonPlanPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: RebLessonPlanFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user?.id,
          format: 'REB',
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate');
      const result = await response.json();
      // Handle success - show result, allow download, etc
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReusableForm
      schema={RebLessonPlanSchema}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      title="Create REB Lesson Plan"
      fields={{
        schoolName: { label: 'School Name', required: true },
        subject: { label: 'Subject', required: true },
        className: { label: 'Class Name', required: true },
        duration: { label: 'Duration (minutes)', type: 'number', required: true },
        // ... more fields
      }}
    />
  );
}
```

### 2. Call API from Frontend

```tsx
// Example in a form submission
const response = await fetch('/api/generate-lesson-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: user?.id,
    format: 'REB',
    subject: 'Mathematics',
    // ... other fields
  }),
});

const data = await response.json();
if (data.success) {
  console.log('Generated:', data.data.content);
  console.log('Saved ID:', data.data.id);
}
```

### 3. Load Data from Firestore

```tsx
import { getUserLessonPlans } from '@/app/Lib/firebase/firestore';

// In a useEffect
const plans = await getUserLessonPlans(userId, 50);
console.log(plans); // Array of lesson plans
```

### 4. Export to PDF

```tsx
import { exportLessonPlanToPDF } from '@/app/Lib/utils/pdf';

// When user clicks export button
const lessonPlan = { /* plan data */ };
exportLessonPlanToPDF(lessonPlan, 'my-lesson-plan.pdf');
```

### 5. Show Notifications

```tsx
import { showSuccessToast, showErrorToast } from '@/app/Lib/utils/toast';

// On success
showSuccessToast('Lesson plan created successfully!');

// On error
showErrorToast('Failed to create lesson plan');
```

---

## 🎨 Form Fields Available

### For Lesson Plans
```typescript
schoolName: string         // School name
subject: string           // Subject (Math, English, etc)
className: string         // Class (P1-P6, S1-S6)
duration: number          // Minutes
objectives: string        // Learning objectives
```

### For Quizzes
```typescript
topic: string             // Quiz topic
numberOfQuestions: number // 1-100
difficulty: 'easy' | 'medium' | 'hard'
questionTypes?: string[]  // MCQ, True/False, etc
```

### For Rubrics
```typescript
assignmentDescription: string    // What's being graded
skills: string[]                 // Skills to assess
performanceLevels?: number       // 3-6 levels
```

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# See all tasks
npm run
```

---

## ⚠️ Required Configuration

### 1. Set Groq API Key
```bash
# In .env.local
NEXT_PUBLIC_GROQ_API_KEY=gsk_xxxxxxxxx
```

### 2. Firebase Must Be Configured
- `firebaseConf.ts` is already set up
- Make sure your Firebase credentials are correct

### 3. Firestore Collections (Auto-created)
```
- lessonPlans
- quizzes
- rubrics
- schemesOfWork
- unitPlans
- activities
```

---

## 📚 Validation Schemas Ready to Use

```typescript
// Import any of these from @/app/Lib/utils/validation
export {
  RebLessonPlanSchema,
  RtbSessionPlanSchema,
  NurseryLessonPlanSchema,
  QuizSchema,
  RubricSchema,
  SchemeOfWorkSchema,
  ActivitySchema,
  UnitPlanSchema,
  SignInSchema,
  SignUpSchema,
}

// And their types
export type {
  RebLessonPlanFormData,
  RtbSessionPlanFormData,
  // ... etc
}
```

---

## 🎯 Typical Workflow

1. **User fills form** → ReusableForm validates with Zod
2. **Form submitted** → POST to `/api/generate-*`
3. **API receives request** → validates, calls Groq
4. **Groq generates content** → Returns structured response
5. **Save to Firestore** → Auto-saves with user ID & timestamps
6. **Show result** → Display content with UI components
7. **User downloads** → exportToPDF functions
8. **Dashboard shows** → Fetches from Firestore automatically

---

## 🐛 Common Patterns

### Pattern: Fetch and Display
```tsx
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getUserItems(userId).then(setItems).finally(() => setLoading(false));
}, [userId]);

if (loading) return <LoadingSpinner />;
return <DashboardList items={items} />;
```

### Pattern: Generate and Save
```tsx
const handleGenerate = async (formData) => {
  const res = await fetch('/api/generate-xyz', {
    method: 'POST',
    body: JSON.stringify({ ...formData, userId }),
  });
  
  const { data } = await res.json();
  showSuccessToast('Created!');
  return data; // Has id, content, etc
};
```

### Pattern: Export Document
```tsx
const handleExport = (item) => {
  exportToPDF(item.content, item.title, `${item.title}.pdf`);
  showSuccessToast('Downloaded!');
};
```

---

## 🔐 Authentication

Already set up in `AuthContext.tsx`:

```tsx
const { user, loading, isAuthenticated, signOut } = useAuth();

// Use in components
if (!user) redirect('/signin');
```

---

## 📞 Support

### If API Fails:
1. Check Groq API key in `.env.local`
2. Check network in browser DevTools
3. Check response status in Network tab
4. Check Firestore permissions

### If Forms Don't Work:
1. Check field names match schema
2. Check Zod schema definition
3. Check form data passed to ReusableForm

### If PDF Export Fails:
1. Check jsPDF is imported
2. Check data has required fields
3. Check browser console for errors

---

## 🎓 Next Steps to Complete System

### 3 Priority Pages to Build:
1. **Sign-In Page** (Copy from template above)
2. **REB Lesson Plan Page** (Uses RebLessonPlanSchema)
3. **Dashboard/Lessons Page** (Uses DashboardList)

### Then Create:
- Quiz form page
- Rubric form page
- Activity form page
- View/Edit pages for each type

---

## 🚀 You're Ready!

Everything you need is built. Just create the form pages and connect them to the APIs. The system will handle:
- ✅ AI generation
- ✅ Database storage
- ✅ PDF export
- ✅ Notifications
- ✅ Validation
- ✅ Loading states

**Time to complete:** 3-5 more days with focused work!
