import Groq from 'groq-sdk';

// Lazy-initialize Groq client to avoid build-time errors
let groqClient: Groq | null = null;

const getGroqClient = (): Groq => {
  if (!groqClient) {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
    groqClient = new Groq({
      apiKey,
    });
  }
  return groqClient;
};

export const GROQ_CONFIG = {
  model: 'llama-3.3-70b-versatile',
  temperature: 0.4,
  max_tokens: 2048,
  stop: ['\n\n\n', '###'],
};

// Lesson Plan Prompt Templates
export const getLessonPlanPrompt = (input: {
  subject: string;
  grade: string;
  topic: string;
  duration: number;
  objectives: string;
  notes?: string;
}): string => {
  return `Create a comprehensive REB (Rwanda Education Board) compliant lesson plan with the following details:

Subject: ${input.subject}
Grade/Level: ${input.grade}
Topic: ${input.topic}
Duration: ${input.duration} minutes
Learning Objectives: ${input.objectives}
Additional Notes: ${input.notes || 'None'}

Please structure the lesson plan with:
1. Lesson Title
2. Learning Objectives
3. Materials/Resources
4. Introduction/Warm-up Activities
5. Main Teaching and Learning Activities
6. Differentiated Activities (for different learner types)
7. Assessment Methods
8. Homework/Assignments
9. Teacher Notes and Reflections

Ensure the lesson plan is aligned with Rwanda Education Board standards and competency-based curriculum (CBC) requirements.`;
};

export const getRtbSessionPlanPrompt = (input: {
  courseTitle: string;
  courseCode: string;
  sessionObjective: string;
  duration: number;
  keyCompetencies: string;
  practicalActivities?: string;
}): string => {
  return `Create a professional RTB (Rwanda TVET Board) session plan with the following details:

Course Title: ${input.courseTitle}
Course Code: ${input.courseCode}
Session Objective: ${input.sessionObjective}
Duration: ${input.duration} minutes
Key Competencies: ${input.keyCompetencies}
Practical Activities: ${input.practicalActivities || 'To be determined'}

Please structure the session plan with:
1. Session Title
2. Session Objectives
3. Key Competencies to be developed
4. Expected Session Outcomes
5. Materials and Equipment Required
6. Step-by-step Practical Activities
7. Safety Considerations
8. Assessment Criteria
9. Reflection and Follow-up Points

Ensure the session plan follows Rwanda TVET Board standards for technical and vocational training.`;
};

export const getNurseryLessonPlanPrompt = (input: {
  ageGroup: string;
  theme: string;
  objectives: string;
  duration: number;
  developmentalAreas?: string;
}): string => {
  return `Create an engaging and age-appropriate nursery lesson plan with the following details:

Age Group: ${input.ageGroup}
Theme: ${input.theme}
Learning Objectives: ${input.objectives}
Duration: ${input.duration} minutes
Developmental Areas: ${input.developmentalAreas || 'All'}

Please structure the nursery lesson plan with:
1. Lesson Title
2. Learning Objectives (age-appropriate)
3. Developmental Areas Covered (Cognitive, Physical, Social, Emotional, Language)
4. Materials and Resources
5. Introduction Activity (5-10 minutes)
6. Main Play-Based Activities (provide 2-3 activities with durations)
7. Closing/Reflection Activity
8. Teacher Guidance Notes
9. Observation Points for Assessment
10. Follow-up Activities at Home

Ensure the lesson plan is play-based, age-appropriate, and focuses on early childhood development.`;
};

export const getQuizPrompt = (input: {
  topic: string;
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes?: string[];
}): string => {
  return `Create a comprehensive quiz with the following specifications:

Topic: ${input.topic}
Number of Questions: ${input.numberOfQuestions}
Difficulty Level: ${input.difficulty}
Question Types: ${input.questionTypes?.join(', ') || 'Mixed (MCQ, True/False, Short Answer)'}

Please generate a quiz with:
1. Multiple Choice Questions (MCQs) - 4 options each with one correct answer
2. True/False Questions
3. Short Answer Questions
4. An Answer Key with explanations

Format the output as JSON with the following structure:
{
  "quizTitle": "string",
  "topic": "string",
  "questions": [
    {
      "id": "number",
      "type": "mcq|trueFalse|shortAnswer",
      "question": "string",
      "options": ["string"] (for MCQ),
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}`;
};

export const getRubricPrompt = (input: {
  assignmentDescription: string;
  skills: string[];
  performanceLevels?: number;
}): string => {
  return `Create a detailed rubric/marking guide for the following assignment:

Assignment: ${input.assignmentDescription}
Skills to Assess: ${input.skills.join(', ')}
Performance Levels: ${input.performanceLevels || 4}

Please generate a comprehensive rubric with:
1. Clear performance level descriptors (Excellent, Good, Satisfactory, Needs Improvement)
2. Specific criteria for each skill
3. Point values for each performance level
4. Total possible score
5. Teacher guidance notes

Format as JSON with the following structure:
{
  "rubricTitle": "string",
  "totalPoints": "number",
  "criteria": [
    {
      "skill": "string",
      "weights": "number",
      "levels": [
        {
          "level": "string",
          "description": "string",
          "points": "number"
        }
      ]
    }
  ]
}`;
};

export const getSchemeOfWorkPrompt = (input: {
  subject: string;
  grade: string;
  weeks: number;
  topics: string[];
}): string => {
  return `Create a comprehensive scheme of work/curriculum plan with the following details:

Subject: ${input.subject}
Grade/Level: ${input.grade}
Duration: ${input.weeks} weeks
Topics to Cover: ${input.topics.join(', ')}

Please generate a scheme of work that includes:
1. Weekly breakdown
2. Learning objectives for each week
3. Suggested teaching/learning activities
4. Resources needed
5. Assessment strategies
6. Links to competencies

Format each week with:
- Week Number
- Topics
- Learning Outcomes
- Teaching Activities
- Assessment Methods
- Resources`;
};

export const getActivityPrompt = (input: {
  topic: string;
  ageGroup: string;
  activityType: 'group' | 'hands-on' | 'creative' | 'individual';
  duration?: number;
}): string => {
  return `Design an engaging student activity with the following specifications:

Topic: ${input.topic}
Age Group: ${input.ageGroup}
Activity Type: ${input.activityType}
Duration: ${input.duration || 30} minutes

Please create a complete activity that includes:
1. Activity Title
2. Learning Objectives
3. Materials/Resources Needed
4. Step-by-Step Instructions
5. Differentiation Strategies (for different learner levels)
6. Assessment/Observation Points
7. Teacher Guidance and Tips
8. Expected Learning Outcomes
9. Extension Activities

Ensure the activity is:
- Age-appropriate
- Engaging and interactive
- Aligned with ${input.activityType} learning style
- Inclusive of all learners`;
};

// Main generation function
export async function generateWithGroq(prompt: string): Promise<string> {
  try {
    const groq = getGroqClient();
    const message = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: GROQ_CONFIG.model,
      temperature: GROQ_CONFIG.temperature,
      max_tokens: GROQ_CONFIG.max_tokens,
    });

    if (message.choices[0].message.content) {
      return message.choices[0].message.content;
    }

    throw new Error('Unexpected response format from Groq API');
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility to parse JSON from Groq response
export function parseJsonFromResponse(response: string): Record<string, unknown> {
  try {
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, try to parse structured text into sections
    const structuredResponse = parseStructuredText(response);
    if (Object.keys(structuredResponse).length > 1) {
      return structuredResponse;
    }
    
    // If no structure found, return the raw response
    return { content: response };
  } catch (error) {
    console.error('Error parsing JSON from Groq response:', error);
    return { content: response, error: 'Failed to parse JSON' };
  }
}

// Helper function to parse structured text into sections
function parseStructuredText(text: string): Record<string, unknown> {
  const result: Record<string, unknown> = { content: text };
  
  // Common section headers in both REB and RTB documents
  const sectionPatterns = [
    /LESSON DETAILS|SESSION HEADER/i,
    /KEY UNITY COMPETENCE|KEY COMPETENCIES/i,
    /LEARNING OUTCOMES|SESSION OBJECTIVES/i,
    /GENERIC COMPETENCIES|EXPECTED SESSION OUTCOMES/i,
    /MATERIALS AND RESOURCES|MATERIALS AND EQUIPMENT/i,
    /INTRODUCTION|WARM-UP/i,
    /TEACHING AND LEARNING ACTIVITIES|PRACTICAL ACTIVITIES/i,
    /DIFFERENTIATED ACTIVITIES/i,
    /ASSESSMENT|ASSESSMENT STRATEGY/i,
    /CROSS-CUTTING ISSUES/i,
    /HOMEWORK|CONSOLIDATION/i,
    /REFLECTION|TEACHER REFLECTION/i
  ];
  
  // Find sections in the text
  let currentSection = '';
  let currentContent = '';
  
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this line is a section header
    const isSectionHeader = sectionPatterns.some(pattern => pattern.test(line)) ||
                           /^\d+\.\s+[A-Z\s]+:?$/.test(line) || // Numbered section headers
                           /^[A-Z\s]{5,}:?$/.test(line);        // All caps section headers
    
    if (isSectionHeader) {
      // Save previous section if it exists
      if (currentSection && currentContent) {
        result[currentSection.toLowerCase().replace(/\s+/g, '_')] = currentContent.trim();
      }
      
      // Start new section
      currentSection = line.replace(/^\d+\.\s+/, '')  // Remove numbering
                          .replace(/:$/, '')          // Remove trailing colon
                          .trim();
      currentContent = '';
    } else {
      // Add to current section content
      currentContent += line + '\n';
    }
  }
  
  // Save the last section
  if (currentSection && currentContent) {
    result[currentSection.toLowerCase().replace(/\s+/g, '_')] = currentContent.trim();
  }
  
  return result;
}

// Type-specific generation functions
export async function generateLessonPlan(input: Parameters<typeof getLessonPlanPrompt>[0]): Promise<string> {
  const prompt = getLessonPlanPrompt(input);
  return generateWithGroq(prompt);
}

export async function generateRtbSessionPlan(input: Parameters<typeof getRtbSessionPlanPrompt>[0]): Promise<string> {
  const prompt = getRtbSessionPlanPrompt(input);
  return generateWithGroq(prompt);
}

export async function generateNurseryLessonPlan(input: Parameters<typeof getNurseryLessonPlanPrompt>[0]): Promise<string> {
  const prompt = getNurseryLessonPlanPrompt(input);
  return generateWithGroq(prompt);
}

export async function generateQuiz(input: Parameters<typeof getQuizPrompt>[0]): Promise<string> {
  const prompt = getQuizPrompt(input);
  return generateWithGroq(prompt);
}

export async function generateRubric(input: Parameters<typeof getRubricPrompt>[0]): Promise<string> {
  const prompt = getRubricPrompt(input);
  return generateWithGroq(prompt);
}

export async function generateSchemeOfWork(input: Parameters<typeof getSchemeOfWorkPrompt>[0]): Promise<string> {
  const prompt = getSchemeOfWorkPrompt(input);
  return generateWithGroq(prompt);
}

export async function generateActivity(input: Parameters<typeof getActivityPrompt>[0]): Promise<string> {
  const prompt = getActivityPrompt(input);
  return generateWithGroq(prompt);
}
