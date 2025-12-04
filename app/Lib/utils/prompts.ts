/**
 * AI Prompt Generator Utility - COMPLETE UPDATED VERSION
 * Helps guide AI to provide contextual data based on user form inputs
 * This system creates structured prompts that ensure consistent, relevant responses
 * Updated to match Rwanda Education Board (REB/RTB/Nursery) standard formats
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
- Follow the standard REB lesson plan format with timing table
- Include Key Unit Competence explicitly
- Add Generic Competencies and cross-cutting issues
- Include Teaching and Learning Activities (separate teacher and learner activities)
- Add Assessment methods with clear tools
- Include timing for each step (Introduction, Development, Conclusion)
- Specify special educational needs considerations
`,
    RTB: `
SPECIFIC FOR RTB SESSION PLANS:
- Focus on practical, hands-on activities for TVET
- Include equipment and safety considerations
- Emphasize technical competencies development
- Add reflection and follow-up points
- Include assessment criteria for vocational skills
- Provide realistic workplace context
- Include Conclusion with Summary, Assessment, Evaluation, and Homework
`,
    NURSERY: `
SPECIFIC FOR NURSERY LESSON PLANS:
- Use play-based learning approach
- Focus on developmental areas (Cognitive, Physical, Social, Emotional, Language)
- Age-appropriate language and activities
- Include activities with specific durations in table format
- Add observation points for continuous assessment
- Keep it simple and child-friendly
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

CRITICAL: You must follow the EXACT format shown in the reference REB lesson plan. The format must include:

1. Title "LESSON PLAN" centered at top
2. Basic information table showing School, Teacher, Term, Date, Subject, Class, Unit No, Lesson No, Duration, Class size
3. Special educational needs section
4. Unit title, Key unit competence, Title of the lesson
5. Instructional objectives
6. Plan of this class (Location)
7. Learning materials
8. References
9. Detailed timing table with three columns: Timing, Description of activities (Teacher's activity and Learner's activity), Generic competence and cross-cutting issues
10. Teacher's self-evaluation section at the end

IMPORTANT: Format the lesson plan as a structured document matching this exact layout:

Structure your response as follows:

**LESSON PLAN** (Centered heading)

**Basic Information Table:**
| School name: ${input.schoolName} | Teacher's name: ${input.teacherName} |
| Term | Date | Subject | Class | Unit No | Lesson No | Duration | Class size |
| ${input.term} | [Current Date] | ${input.subject} | ${input.className} | ${input.lessonUnit} | ${input.lessonNumber} | ${input.duration} min | [Class Size] |

**Type of special educational needs to be catered for in this lesson and number of learners in each category**
${input.type_of_special_educational_needs || '3 slow learners'}

**Unit title**
${input.key_unity_competence}

**Key unit competence**
${input.key_unity_competence}

**Title of the lesson**
${input.title}

**Instructional objectives**
[Generate 2-3 specific, measurable objectives based on the lesson title and key competence. Format: "1. Using the given..., students will be able to... 2. Using..., students will be able to..."]

**Plan of this class (Location)**
${input.location || 'Inside smart classroom'}

**Learning materials**
${input.learning_materials}

**References**
• Rwanda Education Board (REB) ${input.subject} Teacher's Guide, 2023
• REB ${input.subject} Learner's Book, 2023
• [Add 1-2 more relevant references]

---

**TIMING AND ACTIVITIES TABLE:**

| **Timing for each step** | **Description of teaching and learning activities** | **Generic competence and cross-cutting issues addressed - a short explanation** |
|--------------------------|-----------------------------------------------------|-------------------------------------------------------------------------------|
| **Introduction (10 min)** | **Teacher's activity**<br>- [Introduce topic with examples]<br>- [Facilitate discussions about real-world applications]<br>- [Share previous knowledge about topic]<br><br>**Learner's activity**<br>- [Discuss importance of topic]<br>- [Share previous knowledge about topic] | **Generic Competencies:**<br>- ${input.general_competencies || 'Critical Thinking: Analyzing topic'}<br>- Gender Education: Encouraging diverse participation and skills<br>- Environment and Sustainability: [Relate to topic if applicable] |
| **Development (55 min)** | **Teacher's activity**<br>- [Guide students through main concept with coding exercises]<br>- [Monitor pair activities and provide feedback]<br>- [Discuss common errors and solutions]<br><br>**Learner's activity**<br>- [Practice main activity in pairs]<br>- [Test concepts on sample data]<br>- [Analyze results and discuss improvements] | **Generic Competencies:**<br>- Research and Problem Solving: Investigating concepts<br>- ${input.general_competencies || 'Critical Thinking: Analyzing efficiency'}<br>- Environment and Sustainability: Exploring implications of efficient resource management |
| **Conclusion (15 min)** | **Teacher's activity**<br>- [Summarize key points of the lesson]<br>- [Conduct a brief quiz on concepts]<br><br>**Learner's activity**<br>- [Present findings from activities]<br>- [Reflect on the lesson and discuss takeaways] | **Generic Competencies:**<br>- Lifelong Learning: Encouraging students to explore more<br>- Standardization Culture: Promoting accuracy in implementation |

---

**Teacher's self-evaluation:**
[Leave blank - to be filled after lesson delivery]

---

CRITICAL FORMATTING REQUIREMENTS:
1. Use the exact section structure shown above
2. Include basic information table with all required fields
3. Include special educational needs section
4. Include unit title, key unit competence, and lesson title as separate rows
5. List instructional objectives (2-3 specific objectives)
6. Specify plan of class (location)
7. List learning materials
8. Provide 3-4 references relevant to the subject
9. Create detailed timing table with THREE sections: Introduction, Development, Conclusion
10. Each timing section must show Teacher's activity and Learner's activity
11. Third column must show Generic competence and cross-cutting issues with specific explanations
12. Include Teacher's self-evaluation section at the end (blank)
13. Use bullet points (-) for all activity lists
14. Ensure timing adds up to ${input.duration} minutes total
15. Base all content strictly on user's provided inputs

Generate the complete lesson plan now.`;
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

CRITICAL: You must follow the EXACT format shown in the reference RTB session plan. The format must include:

1. HEADER with RTB logo positioning
2. Title "SESSION PLAN" centered at top
3. Basic information table with merged cells
4. Detailed session structure with Introduction, Development/Body steps, Conclusion sections
5. Each section must show Trainer's activity, Learner's activity, Resources, and Duration
6. Conclusion section with Summary, Assessment, Evaluation, and Homework/Assignment
7. References section
8. Appendices section
9. Reflection section at the end

IMPORTANT: Format the session plan as a structured document matching this exact layout:

Structure your response as follows:

**SESSION PLAN** (Centered heading with RTB logo on right)

**Basic Information Table:**
| Sector: [Sector] | Trade: [Trade] | Level: [Level] | Date: [Date] |
| Trainer name: [Name] | | | Term: [Term] |
| Module title: [Title] | Week: [#] | No. Trainees: [#] | Class: [Class] |

**Learning Outcome:**
[LO3 or appropriate learning outcome]

**Indicative content**
[Content description from user input]

**Topic of the session:** [Topic from user input]

**Range:**
[Range description - provide bullet points describing scope]
• [Range point 1]

**Objectives:**
1. [Specific objective 1 related to topic]
2. [Specific objective 2 related to topic]

**Facilitation technique(s):**
[Demonstration and Group Discussion or specified technique]

---

**INTRODUCTION** | **Resources** | **Duration**

**Trainer's activity**
• [Greet learners activity]
• [Take roll call]
• [Involve learners in setting ground rules]
• [Announce topic]
• [Present and explain objectives]

**Learner's activity**
• [Respond to greetings]
• [Respond to roll call]
• [Participate in setting ground rules]
• [Listen to new topic]
• [Follow objectives]

| Resources: • Chalk • Chalkboard • Attendance sheet • Teaching aids related to [topic] | Duration: [6 minutes or appropriate] |

---

**Development/Body**

**Step 1**
**Trainer's activity**
• [Introduce and explain main concept]
• [Discuss importance of topic]

**Learner's activity**
• [Take notes on concept]
• [Participate in discussion]

| Resources: • Teaching materials for different methods • Role-playing scenarios • Writing materials for note-taking | Duration: [2 minutes or appropriate] |

**Step 2**
**Trainer's activity**
• [Conduct demonstration]
• [Engage learners in group discussion]

**Learner's activity**
• [Observe demonstration]
• [Contribute to group discussion]

| Resources: • Teaching materials • Role-playing scenarios • Writing materials | Duration: [1 minute or appropriate] |

**Step 3**
**Trainer's activity**
• [Facilitate role-playing activity]
• [Provide guidance and feedback]

**Learner's activity**
• [Participate in role-playing]
• [Accept and apply feedback]

| Resources: • Teaching materials • Role-playing scenarios • Writing materials | Duration: [1 minute or appropriate] |

**Step 4**
**Trainer's activity**
• [Summarize key points]
• [Prepare learners for assessment]

**Learner's activity**
• [Engage in summary discussion]
• [Get ready for assessment]

| Resources: • Teaching materials • Role-playing scenarios • Writing materials | Duration: [1 minute or appropriate] |

**Resources for ALL steps:**
• Teaching materials for different methods
• Role-playing scenarios
• Writing materials for note-taking

---

**Conclusion** | **Resources** | **Duration**

**Summary:**
Trainer involves learners in summarizing the session by asking questions related to objectives while learners participate by answering questions

| Resources: • Assessment sheets • Chalk | Duration: [13 minutes] |

**Assessment:**
Trainer gives instructions related to assessment, distributes assessment sheets, while learners receive and complete the assessment

| Resources: • Assessment sheets • Chalk | Duration: [13 minutes] |

**Evaluation of the session:**
Trainer asks trainees to give feedback on the session delivery and announce the next topic while learners evaluate the session by answering asked questions.

| Resources: • Evaluation forms • Flip/pencil | Duration: [3 minutes] |

**Homework/Assignment:**
Practice the skills taught. Complete exercises in the workbook.

| Resources: • Textbook • Workbook | Duration: [5 minutes] |

---

**References:**
• [Reference 1 - relevant to topic]
• [Reference 2 - relevant textbook]
• [Reference 3 - relevant guide]

**Appendices:** Task sheet, Handout notes, Assessment sheet

**Reflection:**
To be completed after the session delivery

---

CRITICAL FORMATTING REQUIREMENTS:
1. Use the exact section structure shown above
2. Include ALL sections: Introduction, Development (Steps 1-4), Conclusion (with Summary, Assessment, Evaluation, Homework)
3. Each section must show Trainer's activity, Learner's activity, Resources, and Duration in a clear tabular format
4. Use bullet points (•) for all activity lists
5. Include specific resources relevant to the topic
6. Provide realistic time allocations that add up to ${input.duration} minutes total
7. Add References section with 3-4 relevant citations
8. Include Appendices and Reflection sections at the end
9. Maintain professional TVET/vocational training tone throughout
10. Base all content strictly on the user's provided inputs - especially the topic, learning outcomes, and indicative content

Generate the complete session plan now.`;
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
Generate a play-based, age-appropriate nursery lesson plan using ONLY the information provided above.

CRITICAL: You must follow the EXACT format shown in the reference nursery lesson plan. The format must include:

1. Title "NURSERY LESSON PLAN" centered at top
2. Lesson title (e.g., "Lesson: colors")
3. Learning objectives section
4. Teaching and learning materials section (bullet list)
5. References section (bullet list)
6. Main table with 4 columns: Steps and timing, Teacher's activities, Learner's activities, Teaching and learning resources
7. The table should have rows for: Introduction, Lesson development, Conclusion or summary, Evaluation/exercise/homework
8. Teacher's self evaluation section at the end

IMPORTANT: Format the lesson plan as a structured document matching this exact layout:

Structure your response as follows:

**NURSERY LESSON PLAN**

**Lesson:** ${input.theme}

**Learning objectives:**

${input.learningObjectives}

**Teaching and learning materials:**

• [Material 1 from user input]
• [Material 2 from user input]
• [Material 3 from user input]

**References:**

• Early Childhood Education Curriculum Guide
• Teaching Young Children: A Handbook for Educators

---

**MAIN ACTIVITY TABLE:**

| **Steps and timing** | **Teacher's activities** | **Learner's activities** | **Teaching and learning resources** |
|----------------------|--------------------------|-------------------------|-------------------------------------|
| **Introduction**<br>(5 min) | The teacher will introduce ${input.theme} using flashcards and encourage children to talk about names of ${input.theme}. | Children will observe ${input.theme} flashcards and repeat the names of the ${input.theme} aloud. | • ${input.theme} flashcards<br>• ${input.theme} song<br>• Interactive ${input.theme} wheel |
| **Lesson development**<br>(20 min) | The teacher will guide children in sorting activities, provide prompts for ${input.theme} identification, and assist in the scavenger hunt. | Children will sort colored paper and crayons into groups, color pictures, and search for objects of specific ${input.theme} around the classroom. | • Sorting bins<br>• Coloring sheets<br>• Classroom objects in different ${input.theme}<br>• ${input.theme} scavenger hunt checklist<br>• ${input.theme} song<br>• Interactive ${input.theme} game |
| **Conclusion or summary**<br>(3 min) | The teacher will encourage children to present their work and ask questions about their favorite ${input.theme}. | Children will share their favorite ${input.theme} and show their colored pictures to the group. | • Children's coloring artwork<br>• ${input.theme} display board<br>• Congratulations stickers |
| **Evaluation/exercise/homework**<br>(2 min) | The teacher will observe children's ability to identify ${input.theme} during the matching game and provide feedback. | Children will participate in a quick ${input.theme} matching game using flashcards to assess their understanding. | • ${input.theme} flashcards<br>• Observation checklist<br>• ${input.theme} matching game |

---

**Teacher's self evaluation:**

[Leave blank - to be filled after lesson delivery]

---

CRITICAL FORMATTING REQUIREMENTS:
1. Use the exact section structure shown above
2. Title should be "NURSERY LESSON PLAN" centered at top
3. Include lesson title (based on theme)
4. Include learning objectives in paragraph form
5. List teaching and learning materials as bullet points
6. Include 2 references
7. Create a 4-column table with these rows:
   - Introduction (with timing)
   - Lesson development (with timing)
   - Conclusion or summary (with timing)
   - Evaluation/exercise/homework (with timing)
8. Each row must have: Steps and timing, Teacher's activities, Learner's activities, Teaching and learning resources
9. Use bullet points (•) for listing resources in the last column
10. Ensure total timing adds up to ${input.duration} minutes
11. Include Teacher's self evaluation section at the end (blank)
12. Make all activities age-appropriate for ${input.ageGroup}
13. Focus on play-based, hands-on learning activities
14. Base all content strictly on user's provided inputs - especially theme, activities, and materials

Generate the complete nursery lesson plan now.`;
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
   - Level 4 (Exemplary): [Clear descriptor]
   - Level 3 (Proficient): [Clear descriptor]
   - Level 2 (Developing): [Clear descriptor]
   - Level 1 (Beginning): [Clear descriptor]

3. RUBRIC TABLE
   Create a comprehensive table with:
   - Rows: Each skill from ${input.skills.join(', ')}
   - Columns: Each performance level (${levels} levels)
   - Cells: Specific, observable descriptors for each skill-level combination
   - Point values: Distribute points appropriately across levels

4. ASSESSMENT CRITERIA FOR EACH SKILL:
${input.skills.map((skill) => `
   **${skill}:**
   - Level 4 (${Math.floor(totalPts / levels)} points): [Exemplary performance description]
   - Level 3 (${Math.floor(totalPts / levels) - 1} points): [Proficient performance description]
   - Level 2 (${Math.floor(totalPts / levels) - 2} points): [Developing performance description]
   - Level 1 (${Math.floor(totalPts / levels) - 3} points): [Beginning performance description]`).join('')}

5. SCORING GUIDELINES
   - How to calculate total scores
   - Grade boundaries (if applicable)
   - What each score range means
   - Feedback suggestions for each level

6. TEACHER IMPLEMENTATION NOTES
   - How to use this rubric effectively
   - Common scoring challenges
   - Tips for consistent assessment
   - Student self-assessment opportunities

Generate the rubric in clear, professional format that teachers can use immediately for assessment.`;
};

// ============================================================================
// SCHEME OF WORK PROMPTS
// ============================================================================

export const generateSchemeOfWorkPrompt = (input: {
  subject: string;
  className: string;
  term: string;
  numberOfWeeks: number;
  topics: string[];
  learningObjectives?: string;
  assessments?: string;
  resources?: string;
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
- Term: ${input.term}
- Number of Weeks: ${input.numberOfWeeks}
- Topics to Cover: ${input.topics.join(', ')}
- Learning Objectives: ${input.learningObjectives || 'Derive from subject and topics'}
- Assessments: ${input.assessments || 'Include formative and summative assessments'}
- Resources: ${input.resources || 'Standard classroom resources'}
${input.additionalNotes ? `- Additional Notes: ${input.additionalNotes}` : ''}

TASK:
Generate a comprehensive scheme of work using ONLY the information provided above. Structure it with:

1. SCHEME OVERVIEW
   - Subject: ${input.subject}
   - Class: ${input.className}
   - Term: ${input.term}
   - Duration: ${input.numberOfWeeks} weeks
   - Total Topics: ${input.topics.length}

2. LEARNING OBJECTIVES
   - Overall objectives for the term
   - How topics build on each other
   - Competency alignment

3. WEEKLY BREAKDOWN
   Create a detailed table with ${input.numberOfWeeks} rows:
   | Week | Topic | Learning Objectives | Activities | Assessment | Resources |
   |------|-------|-------------------|------------|------------|-----------|
   ${Array.from({length: input.numberOfWeeks}, (_, i) => `| Week ${i + 1} | ${input.topics[i] || 'Topic ' + (i + 1)} | [Objectives for this week] | [Key activities] | [Assessment method] | [Required resources] |`).join('\n   ')}

4. ASSESSMENT SCHEDULE
   - Formative assessments throughout the term
   - Summative assessments at term end
   - Assessment methods and timing
   - Weighting of different assessments

5. RESOURCE REQUIREMENTS
   - Essential resources for each topic
   - Optional/enrichment resources
   - Budget considerations
   - Preparation timeline

6. CROSS-CUTTING INTEGRATION
   - How topics connect across weeks
   - Skills development progression
   - Real-world applications
   - Cultural relevance to Rwanda

7. DIFFERENTIATION STRATEGIES
   - Support for struggling learners
   - Extension for advanced learners
   - Inclusive teaching approaches
   - Special educational needs considerations

8. TERM CALENDAR CONSIDERATIONS
   - Rwanda school holidays
   - Examination periods
   - School events that might affect teaching
   - Flexible planning for disruptions

Generate the scheme of work in professional format that teachers can follow throughout the term.`;
};

// ============================================================================
// UNIT PLAN PROMPTS
// ============================================================================

export const generateUnitPlanPrompt = (input: {
  unitTitle: string;
  subject: string;
  className: string;
  duration: string;
  topics: string[];
  learningObjectives: string;
  assessmentMethods: string;
  resources: string;
  additionalNotes?: string;
}): string => {
  const systemContext = getSystemContext('Unit Plan');
  const instructions = getInstructions('SCHEME_OF_WORK');
  const constraints = getConstraints();

  return `${systemContext}

${instructions}

${constraints}

USER PROVIDED INFORMATION:
- Unit Title: ${input.unitTitle}
- Subject: ${input.subject}
- Class/Grade: ${input.className}
- Duration: ${input.duration}
- Topics to Cover: ${input.topics.join(', ')}
- Learning Objectives: ${input.learningObjectives}
- Assessment Methods: ${input.assessmentMethods}
- Resources: ${input.resources}
${input.additionalNotes ? `- Additional Notes: ${input.additionalNotes}` : ''}

TASK:
Generate a comprehensive unit plan using ONLY the information provided above. Structure it with:

1. UNIT OVERVIEW
   - Unit Title: ${input.unitTitle}
   - Subject: ${input.subject}
   - Grade Level: ${input.className}
   - Duration: ${input.duration}
   - Number of Topics: ${input.topics.length}

2. UNIT RATIONALE
   - Why this unit is important
   - How it fits into the broader curriculum
   - Real-world relevance and applications

3. LEARNING OBJECTIVES
   - Overall unit objectives
   - Specific outcomes for each topic
   - Skills development focus
   - Competency alignment

4. TOPIC BREAKDOWN
${input.topics.map((topic, index) => `
   **Topic ${index + 1}: ${topic}**
   - Duration: [Allocate time within ${input.duration}]
   - Key concepts
   - Learning activities
   - Assessment checkpoint`).join('')}

5. TEACHING SEQUENCE
   - Logical progression of topics
   - Prerequisites and connections
   - Scaffolding approach
   - Review and reinforcement points

6. ASSESSMENT PLAN
   - Diagnostic assessment (beginning of unit)
   - Formative assessments (during unit)
   - Summative assessment (end of unit)
   - Assessment methods: ${input.assessmentMethods}

7. RESOURCES AND MATERIALS
   - Essential resources: ${input.resources}
   - Supplementary materials
   - Technology integration
   - Community resources (if applicable)

8. DIFFERENTIATION STRATEGIES
   - Support for diverse learners
   - Extension activities
   - Multiple means of engagement
   - Accommodation strategies

9. CROSS-CURRICULAR CONNECTIONS
   - Links to other subjects
   - Life skills integration
   - 21st-century skills development
   - Cultural relevance to Rwanda

10. UNIT EVALUATION
    - Success criteria
    - Student feedback mechanisms
    - Teacher reflection points
    - Areas for improvement

Generate the unit plan in professional format ready for teacher implementation.`;
};