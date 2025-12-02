import { z } from 'zod';

// Lesson Plan Form Schemas
export const RebLessonPlanSchema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  term: z.string().min(1, 'Term is required'),
  subject: z.string().min(1, 'Subject is required'),
  className: z.string().min(1, 'Class name is required'),
  teacherName: z.string().min(1, 'Teacher name is required'),
  lessonUnit: z.string().min(1, 'Lesson unit is required'),
  lessonNumber: z.string().min(1, 'Lesson number is required'),
  duration: z.number().min(10, 'Duration must be at least 10 minutes'),
  key_unity_competence: z.string().min(1, 'Key unity competence is required'),
  title: z.string().min(1, 'Lesson title is required'),
  general_competencies: z.string().min(1, 'General competencies are required'),
  learning_materials: z.string().min(1, 'Learning materials are required'),
  type_of_special_educational_needs: z.string().optional(),
  location: z.string().optional(),
});

export const RtbSessionPlanSchema = z.object({
  schoolName: z.string().min(1, 'School/Institution name is required'),
  courseTitle: z.string().min(1, 'Course title is required'),
  courseCode: z.string().min(1, 'Course code is required'),
  instructorName: z.string().min(1, 'Instructor name is required'),
  sessionNumber: z.number().min(1, 'Session number must be at least 1'),
  duration: z.number().min(10, 'Duration must be at least 10 minutes'),
  sessionObjective: z.string().min(1, 'Session objective is required'),
  keyCompetencies: z.string().min(1, 'Key competencies are required'),
  sessionOutcome: z.string().min(1, 'Session outcome is required'),
  practicalActivities: z.string().min(1, 'Practical activities are required'),
  equipmentRequired: z.string().min(1, 'Equipment required list is required'),
  safetyConsiderations: z.string().min(1, 'Safety considerations are required'),
  assessmentMethod: z.string().min(1, 'Assessment method is required'),
  assessmentCriteria: z.string().min(1, 'Assessment criteria are required'),
});

export const NurseryLessonPlanSchema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  ageGroup: z.string().min(1, 'Age group is required'),
  theme: z.string().min(1, 'Theme is required'),
  teacherName: z.string().min(1, 'Teacher name is required'),
  duration: z.number().min(10, 'Duration must be at least 10 minutes'),
  learningObjectives: z.string().min(1, 'Learning objectives are required'),
  developmentalAreas: z.string().min(1, 'Developmental areas are required'),
  introductionActivity: z.string().min(1, 'Introduction activity is required'),
  mainActivities: z.string().min(1, 'Main activities are required'),
  closingActivity: z.string().min(1, 'Closing activity is required'),
  playBasedLearning: z.string().min(1, 'Play-based learning description is required'),
  observationPoints: z.string().optional(),
});

// Quiz Form Schema
export const QuizSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  numberOfQuestions: z.number().min(1, 'Number of questions must be at least 1').max(100, 'Cannot exceed 100 questions'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionTypes: z.array(z.string()).optional(),
  className: z.string().optional(),
  learningObjectives: z.string().optional(),
  additionalNotes: z.string().optional(),
});

// Rubric Form Schema
export const RubricSchema = z.object({
  assignmentDescription: z.string().min(1, 'Assignment description is required'),
  skills: z.array(z.string().min(1, 'Skill cannot be empty')).min(1, 'At least one skill is required'),
  performanceLevels: z.number().min(3, 'Minimum 3 performance levels').max(6, 'Maximum 6 performance levels').optional(),
  className: z.string().optional(),
  assignmentName: z.string().optional(),
});

// Scheme of Work Schema
export const SchemeOfWorkSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().min(1, 'Grade/Level is required'),
  weeks: z.number().min(1, 'Weeks must be at least 1').max(52, 'Weeks cannot exceed 52'),
  topics: z.array(z.string().min(1, 'Topic cannot be empty')).min(1, 'At least one topic is required'),
  className: z.string().optional(),
  term: z.string().optional(),
  competencies: z.string().optional(),
  additionalNotes: z.string().optional(),
});

// Activity Schema
export const ActivitySchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  ageGroup: z.string().min(1, 'Age group is required'),
  activityType: z.enum(['group', 'hands-on', 'creative', 'individual']),
  duration: z.number().min(5, 'Duration must be at least 5 minutes').optional(),
  className: z.string().optional(),
  learningObjectives: z.string().optional(),
  materials: z.string().optional(),
  additionalNotes: z.string().optional(),
});

// Unit Plan Schema
export const UnitPlanSchema = z.object({
  title: z.string().min(1, 'Unit title is required'),
  duration: z.number().min(1, 'Duration must be at least 1 week'),
  competencies: z.string().min(1, 'Competencies are required'),
  content: z.string().optional(),
});

// Sign In Schema
export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

// Sign Up Schema
export const SignUpSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type exports for form usage
export type RebLessonPlanFormData = z.infer<typeof RebLessonPlanSchema>;
export type RtbSessionPlanFormData = z.infer<typeof RtbSessionPlanSchema>;
export type NurseryLessonPlanFormData = z.infer<typeof NurseryLessonPlanSchema>;
export type QuizFormData = z.infer<typeof QuizSchema>;
export type RubricFormData = z.infer<typeof RubricSchema>;
export type SchemeOfWorkFormData = z.infer<typeof SchemeOfWorkSchema>;
export type ActivityFormData = z.infer<typeof ActivitySchema>;
export type UnitPlanFormData = z.infer<typeof UnitPlanSchema>;
export type SignInFormData = z.infer<typeof SignInSchema>;
export type SignUpFormData = z.infer<typeof SignUpSchema>;
