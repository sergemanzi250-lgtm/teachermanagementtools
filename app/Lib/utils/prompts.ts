/**
 * AI Prompt Generator Utility
 * Helps guide AI to provide contextual data based on user form inputs
 * This system creates structured prompts that ensure consistent, relevant responses
 */

import { 
  RebLessonPlanInput, 
  RtbSessionPlanInput, 
  NurseryLessonPlanInput 
} from '../types/type';

// ============================================================================
// CORE PROMPT ENGINEERING UTILITIES
// ============================================================================

/**
 * Context builder to provide AI with detailed system understanding
 */
export const getSystemContext = (documentType: string): string => {
  return `You are an expert educational content generator for Rwanda's education system. 
Your role is to create high-quality, standards-aligned educational documents.

Context:
- System: Teacher Management & Lesson Planning Tool for Rwanda Education System
- Document Type: ${documentType}
- Standards: Rwanda Education Board (REB) / Rwanda TVET Board (RTB) requirements
- Curriculum: Competency-Based Curriculum (CBC)
- Your task: Generate content that is practical, implementable, and aligned with user specifications

Important: Always:
1. Base responses strictly on the user's provided inputs
2. Include specific examples relevant to the Rwandan context where appropriate
3. Ensure cultural and contextual appropriateness
4. Provide actionable, implementable content
5. Include assessment and differentiation strategies
6. Reference competencies and learning outcomes
`;
};

/**
 * Instruction builder for consistent AI behavior
 */
export const getInstructions = (format: string): string => {
  const baseInstructions = `
RESPONSE INSTRUCTIONS:
1. Use the EXACT subjects, grades, and topics provided by the user
2. Adapt difficulty and complexity to the grade level specified
3. Include cross-cutting issues relevant to Rwanda (Gender, Environment, Inclusion, etc.)
4. Provide specific time allocations for all activities
5. Include practical, actionable teaching strategies
6. Add assessment methods aligned with CBC
7. Use clear, professional language
`;

  const formatSpecificInstructions: Record<string, string> = {
    REB: `
SPECIFIC FOR REB LESSON PLANS:
- Follow the 7-step REB lesson plan format
- Include Key Unity Competence explicitly
- Add Generic Competencies section
- Include Teaching and Learning Activities (separate teacher and learner activities)
- Add Assessment methods with clear tools
- Include timing for each step (Introduction, Development, Consolidation, Evaluation)
- Specify special educational needs considerations
`,
    RTB: `
SPECIFIC FOR RTB SESSION PLANS:
- Focus on practical, hands-on activities
- Include equipment and safety considerations
- Emphasize technical competencies development
- Add reflection and follow-up points
- Include assessment criteria for vocational skills
- Provide realistic workplace context
`,
    NURSERY: `
SPECIFIC FOR NURSERY LESSON PLANS:
- Use play-based learning approach
- Focus on developmental areas (Cognitive, Physical, Social, Emotional, Language)
- Age-appropriate language and activities
- Include 2-3 main activities with specific durations
- Add observation points for continuous assessment
- Provide parent involvement suggestions
`,
    ACTIVITY: `
SPECIFIC FOR ACTIVITIES:
- Make it engaging and interactive
- Include clear learning objectives
- Provide differentiation strategies
- Add assessment observation points
- Include extension activities
`,
    QUIZ: `
SPECIFIC FOR QUIZZES:
- Vary question types (MCQ, True/False, Short Answer)
- Create clear answer keys with explanations
- Ensure questions align with learning objectives
- Grade-appropriate difficulty
`,
    RUBRIC: `
SPECIFIC FOR RUBRICS:
- Define 4 clear performance levels
- Make criteria measurable and observable
- Assign point values clearly
- Provide descriptor examples for each level
`,
    SCHEME_OF_WORK: `
SPECIFIC FOR SCHEME OF WORK:
- Create realistic weekly breakdown
- Link each week to specific competencies
- Include formative and summative assessments
- Suggest resources and materials
- Consider holidays and breaks in Rwanda calendar
`,
  };

  return baseInstructions + (formatSpecificInstructions[format] || '');
};

/**
 * Constraint builder to ensure relevant, focused responses
 */
export const getConstraints = (): string => {
  return `
CONSTRAINTS & GUIDELINES:
1. Response must ONLY use information provided in user inputs
2. Do not invent details not in the form inputs
3. Maintain professional educational tone
4. Avoid generic content - be specific to inputs provided
5. Include specific examples and scenarios
6. Ensure all suggestions are feasible for classroom implementation
7. Align with Rwanda's education standards
8. Consider resource availability in typical Rwandan schools
9. Include inclusive teaching strategies
10. Format output clearly with headings and structure
`;
};

// ============================================================================
// REB LESSON PLAN PROMPTS
// ============================================================================

export const generateRebLessonPlanPrompt = (input: RebLessonPlanInput): string => {
  const systemContext = getSystemContext('REB Lesson Plan');
  const instructions = getInstructions('REB');
  const constraints = getConstraints();

  return `${systemContext}

${instructions}

${constraints}

USER PROVIDED INFORMATION:
- School: ${input.schoolName}
- Term: ${input.term}
- Subject: ${input.subject}
- Class: ${input.className}
- Teacher: ${input.teacherName}
- Lesson Unit: ${input.lessonUnit}
- Lesson Number: ${input.lessonNumber}
- Duration: ${input.duration} minutes
- Key Unity Competence: ${input.key_unity_competence}
- Lesson Title: ${input.title}
- General Competencies: ${input.general_competencies}
- Learning Materials: ${input.learning_materials}
- Location: ${input.location || 'Classroom'}
${input.type_of_special_educational_needs ? `- Special Educational Needs: ${input.type_of_special_educational_needs}` : ''}
${input.teaching_and_learning_activities_description ? `- Teaching & Learning Activities Notes: ${input.teaching_and_learning_activities_description}` : ''}
${input.cross_cutting_issues ? `- Cross-Cutting Issues: ${input.cross_cutting_issues}` : ''}

TASK:
Generate a comprehensive, REB-compliant lesson plan using ONLY the information provided above.

IMPORTANT: Format the lesson plan as a structured HTML table with clear sections, similar to this example:

<table border="1" cellpadding="5" cellspacing="0" width="100%">
  <tr>
    <th colspan="4" align="center">LESSON PLAN</th>
  </tr>
  <tr>
    <td width="25%"><strong>School:</strong> [School Name]</td>
    <td width="25%"><strong>Subject:</strong> [Subject]</td>
    <td width="25%"><strong>Level:</strong> [Class Level]</td>
    <td width="25%"><strong>Date:</strong> [Date]</td>
  </tr>
  <tr>
    <td><strong>Teacher name:</strong> [Teacher Name]</td>
    <td colspan="3"><strong>Term:</strong> [Term]</td>
  </tr>
  <tr>
    <td><strong>Module title:</strong> [Module Title]</td>
    <td><strong>Week:</strong> [Week Number]</td>
    <td><strong>No. Trainees:</strong> [Class Size]</td>
    <td><strong>Class:</strong> [Class Name]</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Learning Outcome:</strong> [Learning Outcome]</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Indicative content:</strong> [Content Description]</td>
  </tr>
  <tr>
    <td colspan="2"><strong>Topic of the session:</strong> [Topic]</td>
    <td colspan="2"><strong>Duration of the session:</strong> ${input.duration} minutes</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Range:</strong> [Range Description]</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Objectives:</strong><br>
    1. [Objective 1]<br>
    2. [Objective 2]</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Facilitation technique(s):</strong><br>
    [Techniques]</td>
  </tr>
  <tr>
    <td colspan="1" bgcolor="#FFFFCC"><strong>Introduction</strong></td>
    <td colspan="1" bgcolor="#FFFFCC"><strong>Resources</strong></td>
    <td colspan="1" bgcolor="#FFFFCC"><strong>Duration</strong></td>
  </tr>
  <tr>
    <td>
      <strong>Trainer's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]<br>
      <br>
      <strong>Learner's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]
    </td>
    <td>
      • [Resource 1]<br>
      • [Resource 2]
    </td>
    <td>[Duration] minutes</td>
  </tr>
  <tr>
    <td colspan="3" bgcolor="#FFFFCC"><strong>Development/Body</strong></td>
  </tr>
  <tr>
    <td>
      <strong>Step 1</strong><br>
      <strong>Trainer's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]<br>
      <br>
      <strong>Learner's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]
    </td>
    <td>
      • [Resource 1]<br>
      • [Resource 2]
    </td>
    <td>[Duration] minutes</td>
  </tr>
  <tr>
    <td>
      <strong>Step 2</strong><br>
      <strong>Trainer's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]<br>
      <br>
      <strong>Learner's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]
    </td>
    <td>
      • [Resource 1]<br>
      • [Resource 2]
    </td>
    <td>[Duration] minutes</td>
  </tr>
</table>

Include all the following sections in your table:
1. Header information (School, Subject, Level, Date, Teacher, Term)
2. Module information (Title, Week, Class size, Class name)
3. Learning Outcome
4. Indicative content
5. Topic and Duration
6. Range
7. Objectives (numbered list)
8. Facilitation techniques
9. Introduction section with Trainer's activities, Learner's activities, Resources, and Duration
10. Development/Body section with multiple steps, each containing Trainer's activities, Learner's activities, Resources, and Duration

Use bullet points (•) for listing activities and resources. Use appropriate background colors for section headers (light yellow #FFFFCC for main sections).

Generate the lesson plan in this structured HTML table format ready for teacher use.`;
};

// ============================================================================
// RTB SESSION PLAN PROMPTS
// ============================================================================

export const generateRtbSessionPlanPrompt = (input: RtbSessionPlanInput): string => {
  const systemContext = getSystemContext('RTB Session Plan');
  const instructions = getInstructions('RTB');
  const constraints = getConstraints();

  return `${systemContext}

${instructions}

${constraints}

USER PROVIDED INFORMATION:
- Sector: ${input.sector || 'N/A'}
- Trade: ${input.trade || 'N/A'}
- Level: ${input.level || 'N/A'}
- Date: ${input.date || 'N/A'}
- Trainer name: ${input.instructorName}
- Term: ${input.term || 'N/A'}
- Module title: ${input.moduleTitle || 'Occupation'}
- Week: ${input.week || '1'}
- No. Trainees: ${input.classSize || '25'}
- Class: ${input.className || 'N/A'}
- Learning Outcome: ${input.learningOutcomes || 'N/A'}
- Indicative content: ${input.indicativeContent || 'N/A'}
- Topic of the session: ${input.topicOfSession || 'N/A'}
- Range: ${input.range || 'N/A'}
- Facilitation technique: ${input.facilitationTechnique || 'Demonstration and Group Discussion'}
- Duration: ${input.duration} minutes

TASK:
Generate a professional RTB-compliant TVET session plan using ONLY the information provided above.

IMPORTANT: Format the session plan as a structured HTML table with clear sections, similar to this example:

<table border="1" cellpadding="5" cellspacing="0" width="100%">
  <tr>
    <th colspan="4" align="center">SESSION PLAN</th>
  </tr>
  <tr>
    <td width="25%"><strong>Sector:</strong> [Sector]</td>
    <td width="25%"><strong>Trade:</strong> [Trade]</td>
    <td width="25%"><strong>Level:</strong> [Level]</td>
    <td width="25%"><strong>Date:</strong> [Date]</td>
  </tr>
  <tr>
    <td><strong>Trainer name:</strong> [Trainer Name]</td>
    <td colspan="3"><strong>Term:</strong> [Term]</td>
  </tr>
  <tr>
    <td><strong>Module title:</strong> [Module Title]</td>
    <td><strong>Week:</strong> [Week Number]</td>
    <td><strong>No. Trainees:</strong> [Class Size]</td>
    <td><strong>Class:</strong> [Class Name]</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Learning Outcome:</strong> [Learning Outcome]</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Indicative content:</strong> [Content Description]</td>
  </tr>
  <tr>
    <td colspan="2"><strong>Topic of the session:</strong> [Topic]</td>
    <td colspan="2"><strong>Duration of the session:</strong> ${input.duration} minutes</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Range:</strong> [Range Description]</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Objectives:</strong><br>
    1. [Objective 1]<br>
    2. [Objective 2]</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Facilitation technique(s):</strong><br>
    [Techniques]</td>
  </tr>
  <tr>
    <td colspan="1" bgcolor="#FFFFCC"><strong>Introduction</strong></td>
    <td colspan="1" bgcolor="#FFFFCC"><strong>Resources</strong></td>
    <td colspan="1" bgcolor="#FFFFCC"><strong>Duration</strong></td>
  </tr>
  <tr>
    <td>
      <strong>Trainer's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]<br>
      <br>
      <strong>Learner's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]
    </td>
    <td>
      • [Resource 1]<br>
      • [Resource 2]
    </td>
    <td>[Duration] minutes</td>
  </tr>
  <tr>
    <td colspan="3" bgcolor="#FFFFCC"><strong>Development/Body</strong></td>
  </tr>
  <tr>
    <td>
      <strong>Step 1</strong><br>
      <strong>Trainer's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]<br>
      <br>
      <strong>Learner's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]
    </td>
    <td>
      • [Resource 1]<br>
      • [Resource 2]
    </td>
    <td>[Duration] minutes</td>
  </tr>
  <tr>
    <td>
      <strong>Step 2</strong><br>
      <strong>Trainer's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]<br>
      <br>
      <strong>Learner's activity</strong><br>
      • [Activity 1]<br>
      • [Activity 2]
    </td>
    <td>
      • [Resource 1]<br>
      • [Resource 2]
    </td>
    <td>[Duration] minutes</td>
  </tr>
</table>

Include all the following sections in your table:
1. Header information (Sector, Trade, Level, Date, Trainer, Term)
2. Module information (Title, Week, Class size, Class name)
3. Learning Outcome
4. Indicative content
5. Topic and Duration
6. Range
7. Objectives (numbered list)
8. Facilitation techniques
9. Introduction section with Trainer's activities, Learner's activities, Resources, and Duration
10. Development/Body section with multiple steps, each containing Trainer's activities, Learner's activities, Resources, and Duration

Use bullet points (•) for listing activities and resources. Use appropriate background colors for section headers (light yellow #FFFFCC for main sections).

Generate the session plan in this structured HTML table format ready for trainer use.`;
};

// ============================================================================
// NURSERY LESSON PLAN PROMPTS
// ============================================================================

export const generateNurseryLessonPlanPrompt = (input: NurseryLessonPlanInput): string => {
  const systemContext = getSystemContext('Nursery Lesson Plan');
  const instructions = getInstructions('NURSERY');
  const constraints = getConstraints();

  return `${systemContext}

${instructions}

${constraints}

USER PROVIDED INFORMATION:
- School: ${input.schoolName}
- Age Group: ${input.ageGroup}
- Theme: ${input.theme}
- Teacher: ${input.teacherName}
- Duration: ${input.duration} minutes
- Learning Objectives: ${input.learningObjectives}
- Developmental Areas: ${input.developmentalAreas}
- Introduction Activity: ${input.introductionActivity}
- Main Activities: ${input.mainActivities}
- Closing Activity: ${input.closingActivity}
- Play-Based Learning Focus: ${input.playBasedLearning}
- Observation Points: ${input.observationPoints}

TASK:
Generate a play-based, age-appropriate nursery lesson plan using ONLY the information provided above. Structure it with:

1. LESSON OVERVIEW
   - Theme: ${input.theme}
   - Age Group: ${input.ageGroup}
   - Duration: ${input.duration} minutes
   - Teacher: ${input.teacherName}
   - School: ${input.schoolName}

2. LEARNING OBJECTIVES
   Age-appropriate objectives:
   - ${input.learningObjectives}
   - Clear, observable outcomes

3. DEVELOPMENTAL AREAS COVERED
   - ${input.developmentalAreas}
   - How each area will be developed

4. MATERIALS AND RESOURCES
   - List all materials needed for activities
   - Safety check for materials
   - Setup instructions

5. INTRODUCTION ACTIVITY (5-10 minutes)
   - Activity: ${input.introductionActivity}
   - Engagement strategy
   - Transition to main activities

6. MAIN PLAY-BASED ACTIVITIES (15-25 minutes total)
   Detailed activities from user input:
   - ${input.mainActivities}
   
   For EACH activity provide:
   - Activity name and description
   - Specific duration
   - Step-by-step instructions
   - Materials needed
   - How children engage in play
   - Learning happening through play
   - Supervision/safety points

7. PLAY-BASED LEARNING APPROACH
   - Incorporating: ${input.playBasedLearning}
   - How children learn through play in these activities
   - Teacher's role as facilitator

8. CLOSING/REFLECTION ACTIVITY (5 minutes)
   - Activity: ${input.closingActivity}
   - Wrap-up strategy
   - Reflection questions for children

9. OBSERVATION AND ASSESSMENT POINTS
   - What to observe: ${input.observationPoints}
   - Observable indicators of learning
   - Documentation strategies (photos, notes, checklist)

10. DIFFERENTIATION AND INCLUSION
    - Adaptations for different abilities
    - Including children with diverse needs
    - Multiple ways to engage

11. HOME EXTENSION ACTIVITIES
    - Suggestions for parents to extend learning at home
    - Simple activities with household items
    - Parent communication tips

12. TEACHER NOTES
    - Tips for smooth transitions
    - Classroom management strategies
    - Handling challenging behaviors
    - Resources and references

Generate the lesson plan in clear, engaging, structured format ready for nursery teacher use. Use child-friendly language and focus on joyful, playful learning.`;
};

// ============================================================================
// ACTIVITY PROMPTS
// ============================================================================

export const generateActivityPrompt = (input: {
  topic: string;
  className: string;
  ageGroup?: string;
  activityType: 'group' | 'hands-on' | 'creative' | 'individual';
  duration: number;
  learningObjectives?: string;
  materials?: string;
  additionalNotes?: string;
}): string => {
  const systemContext = getSystemContext('Student Activity');
  const instructions = getInstructions('ACTIVITY');
  const constraints = getConstraints();

  return `${systemContext}

${instructions}

${constraints}

USER PROVIDED INFORMATION:
- Topic: ${input.topic}
- Class/Grade: ${input.className}
- Age Group: ${input.ageGroup || 'As per class level'}
- Activity Type: ${input.activityType}
- Duration: ${input.duration} minutes
- Learning Objectives: ${input.learningObjectives || 'Derive from topic'}
- Materials Available: ${input.materials || 'Standard classroom materials'}
${input.additionalNotes ? `- Additional Notes: ${input.additionalNotes}` : ''}

TASK:
Generate an engaging, implementable student activity using ONLY the information provided above. Structure it with:

1. ACTIVITY OVERVIEW
   - Title (descriptive, engaging)
   - Topic: ${input.topic}
   - Grade/Class: ${input.className}
   - Duration: ${input.duration} minutes
   - Activity Type: ${input.activityType}

2. LEARNING OBJECTIVES
   - Clear, specific outcomes students will achieve
   - Aligned with topic: ${input.topic}

3. MATERIALS AND RESOURCES NEEDED
   ${input.materials ? `- Available: ${input.materials}` : '- Standard classroom materials'}
   - Quantity requirements
   - Preparation needed

4. STEP-BY-STEP INSTRUCTIONS
   - Clear, numbered instructions
   - What teacher does
   - What students do
   - Timing for each step

5. ACTIVITY STEPS BASED ON TYPE (${input.activityType}):
${input.activityType === 'group' ? `
   GROUP ACTIVITY INSTRUCTIONS:
   - Grouping strategy (size, method)
   - Roles within groups
   - Group tasks and responsibilities
   - Collaboration guidelines` : ''}
${input.activityType === 'hands-on' ? `
   HANDS-ON ACTIVITY INSTRUCTIONS:
   - Practical steps students will perform
   - Safety precautions
   - Demonstration needed
   - Practice opportunities` : ''}
${input.activityType === 'creative' ? `
   CREATIVE ACTIVITY INSTRUCTIONS:
   - Creativity guidelines
   - Self-expression opportunities
   - Open-ended possibilities
   - Product expectations` : ''}
${input.activityType === 'individual' ? `
   INDIVIDUAL ACTIVITY INSTRUCTIONS:
   - Personal task breakdown
   - Independence level
   - Guidance prompts
   - Self-paced elements` : ''}

6. DIFFERENTIATION STRATEGIES
   For EACH learning level:
   - High achievers: Extension/challenge
   - On-level learners: Core activity
   - Struggling learners: Support/scaffolding

7. ASSESSMENT AND OBSERVATION POINTS
   - What to observe
   - Success indicators
   - Informal assessment strategies
   - Observation checklist items

8. CLASSROOM MANAGEMENT TIPS
   - Transitions
   - Group work management
   - Behavior expectations
   - Time management

9. EXTENSION ACTIVITIES
   - How to extend learning further
   - Connection to future lessons
   - Enrichment options

10. REFLECTION FOR STUDENTS
    - Reflection questions
    - What did you learn?
    - How will you use this?

Generate the activity in clear, teacher-ready format with specific instructions that can be implemented immediately in the classroom.`;
};

// ============================================================================
// QUIZ PROMPTS
// ============================================================================

export const generateQuizPrompt = (input: {
  topic: string;
  className: string;
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  learningObjectives?: string;
  questionTypes?: string[];
  additionalNotes?: string;
}): string => {
  const systemContext = getSystemContext('Quiz/Assessment');
  const instructions = getInstructions('QUIZ');
  const constraints = getConstraints();

  return `${systemContext}

${instructions}

${constraints}

USER PROVIDED INFORMATION:
- Topic: ${input.topic}
- Class/Grade: ${input.className}
- Number of Questions: ${input.numberOfQuestions}
- Difficulty Level: ${input.difficulty}
- Learning Objectives: ${input.learningObjectives || 'From topic'}
- Question Types: ${input.questionTypes?.join(', ') || 'Mixed (MCQ, True/False, Short Answer)'}
${input.additionalNotes ? `- Additional Notes: ${input.additionalNotes}` : ''}

TASK:
Generate a comprehensive, standards-aligned quiz using ONLY the information provided above. Structure it with:

1. QUIZ HEADER
   - Title: Quiz on ${input.topic}
   - Grade/Class: ${input.className}
   - Topic: ${input.topic}
   - Total Questions: ${input.numberOfQuestions}
   - Difficulty: ${input.difficulty}
   - Time Allowed: [Suggest based on question count]

2. LEARNING OBJECTIVES BEING ASSESSED
   - ${input.learningObjectives || 'Aligned with topic: ' + input.topic}

3. QUIZ INSTRUCTIONS FOR STUDENTS
   - Clear directions
   - Time management
   - Marking scheme

4. QUESTIONS (Total: ${input.numberOfQuestions})
   
   Generate mix of question types:
${input.questionTypes?.includes('mcq') || !input.questionTypes ? `
   - Multiple Choice Questions (MCQs):
     * 4 options each
     * One clearly correct answer
     * Plausible distractors
     * Difficulty: ${input.difficulty}` : ''}
${input.questionTypes?.includes('true_false') || !input.questionTypes ? `
   - True/False Questions:
     * Clear, unambiguous statements
     * Mix of true and false
     * Not trivial` : ''}
${input.questionTypes?.includes('short_answer') || !input.questionTypes ? `
   - Short Answer Questions:
     * 1-3 sentence responses
     * Specific answer criteria
     * Clear question phrasing` : ''}

5. ANSWER KEY WITH EXPLANATIONS
   For EACH question:
   - Correct answer clearly marked
   - Explanation why this is correct
   - Common misconceptions addressed
   - Point value

6. MARKING SCHEME
   - Total points
   - Point per question
   - Grade conversion (if applicable)
   - Performance level descriptors

7. TEACHER NOTES
   - Time allocation suggestions
   - Difficulty considerations
   - Alternative answer possibilities
   - Follow-up activities based on results

Generate the quiz in clear, professional format ready for student use and teacher grading.`;
};

// ============================================================================
// RUBRIC PROMPTS
// ============================================================================

export const generateRubricPrompt = (input: {
  assignmentName: string;
  className: string;
  skills: string[];
  performanceLevels?: number;
  totalPoints?: number;
  additionalNotes?: string;
}): string => {
  const systemContext = getSystemContext('Rubric/Marking Guide');
  const instructions = getInstructions('RUBRIC');
  const constraints = getConstraints();
  const levels = input.performanceLevels || 4;
  const totalPts = input.totalPoints || levels * input.skills.length * 5;

  return `${systemContext}

${instructions}

${constraints}

USER PROVIDED INFORMATION:
- Assignment: ${input.assignmentName}
- Class/Grade: ${input.className}
- Skills to Assess: ${input.skills.join(', ')}
- Performance Levels: ${levels}
- Total Points: ${totalPts}
${input.additionalNotes ? `- Additional Notes: ${input.additionalNotes}` : ''}

TASK:
Generate a comprehensive, measurable rubric using ONLY the information provided above. Structure it with:

1. RUBRIC HEADER
   - Assignment: ${input.assignmentName}
   - Grade/Class: ${input.className}
   - Total Points Available: ${totalPts}
   - Performance Levels: ${levels}

2. PERFORMANCE LEVEL DEFINITIONS
   Define ${levels} clear levels (e.g., Excellent, Good, Satisfactory, Needs Improvement):
   - Level descriptors
   - What each level means
   - General characteristics

3. ASSESSMENT CRITERIA
   For EACH of these skills (${input.skills.length} total):
   - ${input.skills.join('\n   - ')}
   
   For EACH skill, create ${levels} performance levels with:
   - Clear descriptor of work at this level
   - Specific, observable behaviors
   - ${totalPts / input.skills.length / levels} points per level
   - Examples of work at this level

4. DETAILED RUBRIC TABLE
   
   Criteria | Excellent (${totalPts / input.skills.length / levels} pts) | Good (${totalPts / input.skills.length / levels * (levels - 1) / levels} pts) | Satisfactory (${totalPts / input.skills.length / levels * (levels - 2) / levels} pts) | Needs Improvement (${totalPts / input.skills.length / levels * (levels - 3) / levels} pts)
   [For each skill, provide specific descriptors]

5. SCORING GUIDE
   - How to use the rubric
   - How to score each criterion
   - How to calculate total score
   - Grade conversion (if applicable)

6. TEACHER GUIDANCE
   - What to look for in each level
   - Common mistakes in scoring
   - How to provide feedback to students
   - How to use results for instruction

7. STUDENT-FRIENDLY VERSION
   - Simplified language
   - What students need to do to earn points
   - Clear expectations

Generate the rubric in professional format ready for teacher use and student communication.`;
};

// ============================================================================
// SCHEME OF WORK PROMPTS
// ============================================================================

export const generateSchemeOfWorkPrompt = (input: {
  subject: string;
  className: string;
  weeks: number;
  topics: string[];
  term?: string;
  competencies?: string;
  additionalNotes?: string;
}): string => {
  const systemContext = getSystemContext('Scheme of Work');
  const instructions = getInstructions('SCHEME_OF_WORK');
  const constraints = getConstraints();

  return `${systemContext}

${instructions}

${constraints}

USER PROVIDED INFORMATION:
- Subject: ${input.subject}
- Class/Grade: ${input.className}
- Duration: ${input.weeks} weeks
- Topics to Cover: ${input.topics.join(', ')}
${input.term ? `- Term: ${input.term}` : ''}
${input.competencies ? `- Key Competencies: ${input.competencies}` : ''}
${input.additionalNotes ? `- Additional Notes: ${input.additionalNotes}` : ''}

TASK:
Generate a comprehensive scheme of work using ONLY the information provided above. Structure it with:

1. SCHEME OF WORK HEADER
   - Subject: ${input.subject}
   - Grade/Class: ${input.className}
   - Duration: ${input.weeks} weeks
   - Topics: ${input.topics.length} main topics
${input.term ? `   - Term: ${input.term}` : ''}

2. OVERVIEW/INTRODUCTION
   - Subject overview
   - Overall learning goals
   - How topics connect

3. WEEK-BY-WEEK BREAKDOWN
   For each of ${input.weeks} weeks:
   
   WEEK [Number]:
   - Topics covered: [From user list]
   - Learning Outcomes: Specific, measurable outcomes
   - Key Competencies: Developed in this week
   - Teaching/Learning Activities: Specific strategies
   - Materials and Resources Needed
   - Assessment Methods:
     * Formative assessments
     * How to check understanding
   - Homework/Extension: Practice and reinforcement
   - Cross-Cutting Issues: Gender, inclusion, environment, etc.
   - Notes: Teacher guidance for the week

4. TOPICS DISTRIBUTION
   - When each topic is taught
   - Time allocation per topic
   - Connections between topics

5. ASSESSMENT SCHEDULE
   - Formative assessments each week
   - Summative assessment dates
   - Assessment methods
   - Grading criteria

6. RESOURCES AND MATERIALS
   - Resources needed throughout term
   - Where to source materials
   - Digital resources
   - Library books/references

7. DIFFERENTIATION STRATEGIES
   - For high achievers
   - For on-level learners
   - For struggling learners
   - For learners with special needs

8. CROSS-CUTTING ISSUES INTEGRATION
   - Gender equality
   - Environmental sustainability
   - Inclusive education
   - Sustainable development
   - Where integrated in scheme

9. PRACTICAL ACTIVITIES
   - Hands-on learning opportunities
   - Group work opportunities
   - Projects or extended tasks

10. TERM OVERVIEW SUMMARY
    - Quick reference timeline
    - Key dates/assessments
    - Holiday breaks

Generate the scheme of work in professional, clear format ready for teacher reference and implementation throughout the term.`;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Helper to structure user data for better context
 */
export const formatUserInputForPrompt = (data: Record<string, any>): string => {
  return Object.entries(data)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      const readableKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      return `${readableKey}: ${Array.isArray(value) ? value.join(', ') : value}`;
    })
    .join('\n');
};

/**
 * Generate a prompt with emphasis on specific requirements
 */
export const enhancePromptWithRequirements = (
  basePrompt: string,
  requirements: {
    emphasis?: string[];
    mustInclude?: string[];
    mustAvoid?: string[];
    toneAndStyle?: string;
  }
): string => {
  let enhancement = '';

  if (requirements.emphasis?.length) {
    enhancement += `\n\nSPECIAL EMPHASIS:\n${requirements.emphasis.map((e) => `- ${e}`).join('\n')}`;
  }

  if (requirements.mustInclude?.length) {
    enhancement += `\n\nMUST INCLUDE:\n${requirements.mustInclude.map((i) => `- ${i}`).join('\n')}`;
  }

  if (requirements.mustAvoid?.length) {
    enhancement += `\n\nMUST AVOID:\n${requirements.mustAvoid.map((a) => `- ${a}`).join('\n')}`;
  }

  if (requirements.toneAndStyle) {
    enhancement += `\n\nTONE AND STYLE:\n${requirements.toneAndStyle}`;
  }

  return basePrompt + enhancement;
};

/**
 * Validate prompt before sending to AI
 */
export const validatePromptInput = (input: Record<string, any>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const format = input.format;

  // Format-specific validation rules
  const formatRules: Record<string, { required: string[]; optional?: string[] }> = {
    REB: {
      required: ['schoolName', 'subject', 'className', 'duration'],
    },
    RTB: {
      required: ['instructorName', 'duration'],
    },
    NURSERY: {
      required: ['schoolName', 'theme', 'teacherName', 'duration'],
    },
  };

  if (format && formatRules[format]) {
    const { required } = formatRules[format];
    
    // Check format-specific required fields
    required.forEach((field) => {
      if (!input[field] || (typeof input[field] === 'string' && input[field].trim() === '')) {
        errors.push(`Required field "${field}" is missing or empty`);
      }
    });
  } else {
    // Fallback validation for unknown formats
    const genericRequired = ['duration'];
    genericRequired.forEach((field) => {
      if (!input[field] || (typeof input[field] === 'string' && input[field].trim() === '')) {
        errors.push(`Required field "${field}" is missing or empty`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Create a fallback prompt if specific prompt function doesn't exist
 */
export const createGenericPrompt = (
  documentType: string,
  userInputs: Record<string, any>
): string => {
  const systemContext = getSystemContext(documentType);
  const formattedInputs = formatUserInputForPrompt(userInputs);

  return `${systemContext}

USER PROVIDED INFORMATION:
${formattedInputs}

TASK:
Generate a comprehensive ${documentType} based on the information provided above.

Requirements:
1. Use ONLY the information provided
2. Create content that is practical and implementable
3. Align with Rwanda's education standards
4. Include clear structure and formatting
5. Provide actionable, specific content

Please structure the output logically with clear sections and subsections.`;
};
