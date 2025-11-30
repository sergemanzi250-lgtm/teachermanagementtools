// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'teacher' | 'admin' | 'inspector';
  school?: string;
  district?: string;
  phoneNumber?: string;
}

// Lesson Plan Types
export type LessonPlanFormat = 'REB' | 'RTB' | 'NURSERY';
export type EducationLevel = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'NURSERY';

export interface RebLessonPlan {
  id: string;
  userId: string;
  format: 'REB';
  schoolName: string;
  term: string;
  date: Date;
  subject: string;
  className: string;
  teacherName: string;
  lessonUnit: string;
  lessonNumber: string;
  duration: number; // in minutes
  key_unity_competence: string;
  title: string;
  general_competencies: string[];
  type_of_special_educational_needs?: string;
  learning_materials: string;
  location?: string;
  
  // Teaching and learning activities
  teaching_activities: string;
  learner_activities: string;
  timing_for_each_step: string;
  generic_competencies: string;
  
  // Assessment
  assessment_method: string;
  assessment_tools?: string;
  
  // Cross-cutting issues
  cross_cutting_issues: string;
  
  createdAt: Date;
  updatedAt: Date;
  content?: string; // Full lesson plan content
  pdfUrl?: string;
}

export interface RtbSessionPlan {
  id: string;
  userId: string;
  format: 'RTB';
  schoolName: string;
  courseTitle: string;
  courseCode: string;
  instructorName: string;
  sessionNumber: number;
  sessionDate: Date;
  duration: number; // in minutes
  
  // Session details
  sessionObjective: string;
  keyCompetencies: string[];
  sessionOutcome: string;
  
  // Practical activities
  practicalActivities: string[];
  equipmentRequired: string[];
  safetyConsiderations: string;
  
  // Assessment
  assessmentMethod: string;
  assessmentCriteria: string;
  
  // Reflection
  reflectionPoints: string;
  
  createdAt: Date;
  updatedAt: Date;
  content?: string; // Full session plan content
  pdfUrl?: string;
}

export interface NurseryLessonPlan {
  id: string;
  userId: string;
  format: 'NURSERY';
  schoolName: string;
  ageGroup: string; // e.g., "3-4 years", "4-5 years"
  theme: string;
  lessonDate: Date;
  duration: number; // in minutes
  teacherName: string;
  
  // Learning objectives
  learningObjectives: string[];
  developmentalAreas: string[]; // Cognitive, Physical, Social, Emotional, etc.
  
  // Activities
  introductionActivity: string;
  mainActivities: {
    activity: string;
    duration: number;
    materials: string[];
  }[];
  closingActivity: string;
  
  // Play-based approach
  playBasedLearning: string;
  
  // Assessment
  observationPoints: string[];
  
  createdAt: Date;
  updatedAt: Date;
  content?: string; // Full lesson plan content
  pdfUrl?: string;
}

export type LessonPlan = RebLessonPlan | RtbSessionPlan | NurseryLessonPlan;

// Form Input Types
export interface RebLessonPlanInput {
  schoolName: string;
  term: string;
  subject: string;
  className: string;
  teacherName: string;
  lessonUnit: string;
  lessonNumber: string;
  duration: number;
  key_unity_competence: string;
  title: string;
  general_competencies: string;
  type_of_special_educational_needs?: string;
  learning_materials: string;
  location?: string;
  teaching_and_learning_activities_description?: string;
  cross_cutting_issues?: string;
}

export interface RtbSessionPlanInput {
  schoolName: string;
  courseTitle: string;
  courseCode: string;
  instructorName: string;
  sessionNumber: number;
  duration: number;
  sessionObjective: string;
  keyCompetencies: string;
  sessionOutcome: string;
  practicalActivities: string;
  equipmentRequired: string;
  safetyConsiderations: string;
  assessmentMethod: string;
  assessmentCriteria: string;
}

export interface NurseryLessonPlanInput {
  schoolName: string;
  ageGroup: string;
  theme: string;
  teacherName: string;
  duration: number;
  learningObjectives: string;
  developmentalAreas: string;
  introductionActivity: string;
  mainActivities: string;
  closingActivity: string;
  playBasedLearning: string;
  observationPoints: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LessonPlanGenerationResponse {
  lessonPlan: LessonPlan;
  pdfUrl: string;
}

// Subject Types
export const SUBJECTS = {
  primary: [
    'Mathematics',
    'English',
    'Kinyarwanda',
    'Science',
    'Social Studies',
    'French',
    'Physical Education',
    'Arts & Crafts',
    'Music',
    'Information Technology'
  ],
  secondary: [
    'Mathematics',
    'English',
    'Kinyarwanda',
    'French',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'History',
    'Economics',
    'Information Technology',
    'Physical Education',
    'Literature',
    'Art & Design'
  ]
};

// Competency Types
export interface Competency {
  id: string;
  level: EducationLevel;
  subject: string;
  competencyCode: string;
  competencyTitle: string;
  description: string;
}

// Cross-Cutting Issues
export const CROSS_CUTTING_ISSUES = [
  'Inclusive Education',
  'Gender Equality',
  'Environmental Sustainability',
  'Standardization, Culture & Heritage',
  'Peace and Social Cohesion',
  'Genocide Ideology Prevention',
  'Financial Literacy',
  'Digital Literacy',
  'Entrepreneurship'
];
