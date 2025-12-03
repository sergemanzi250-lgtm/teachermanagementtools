import * as XLSX from 'xlsx';

interface ExcelRow {
  [key: string]: any;
}

// Flexible lesson plan type for export (API data may not have all fields)
interface ExportableLessonPlan {
  format?: string;
  [key: string]: any;
}

// Helper function to flatten nested objects for Excel export
const flattenObject = (obj: any, prefix: string = ''): ExcelRow => {
  const flattened: ExcelRow = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}_${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        flattened[newKey] = obj[key].join('; '); // Join arrays with semicolon
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
};

// Export lesson plan to Excel format
export const exportLessonPlanToExcel = (lessonPlan: ExportableLessonPlan, filename: string = 'lesson-plan.xlsx') => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();

<<<<<<< HEAD
    // If we have content with ## headers, create structured sheets
    if (lessonPlan.content && typeof lessonPlan.content === 'string' && lessonPlan.content.includes('##')) {
      const sections = parseContentToSectionsForExcel(lessonPlan.content);
      
      Object.entries(sections).forEach(([sectionName, sectionContent]) => {
        // Split content into lines for processing
        const lines = sectionContent.split('\n').filter(line => line.trim());
        
        // Create table data for this section
        const sectionTableData = lines.map((line, index) => {
          const trimmedLine = line.trim();
          
          // Skip empty lines
          if (!trimmedLine) return null;
          
          // Check if it's a numbered/bulleted item
          const isBulletPoint = /^(\d+\.|\-|\*)\s/.test(trimmedLine);
          
          return {
            'Section': sectionName,
            'No.': isBulletPoint ? 
              (trimmedLine.match(/^(\d+\.|\-|\*)\s(.+)$/)?.[1] || '•') + ' ' : 
              (index + 1) + '.',
            'Content': isBulletPoint ? 
              trimmedLine.replace(/^(\d+\.|\-|\*)\s/, '') : 
              trimmedLine
          };
        }).filter(Boolean);
        
        if (sectionTableData.length > 0) {
          const ws = XLSX.utils.json_to_sheet(sectionTableData);
          
          // Auto-size columns
          const colWidths = [
            { wch: 20 }, // Section column
            { wch: 10 }, // No. column
            { wch: 80 }  // Content column
          ];
          ws['!cols'] = colWidths;
          
          // Use a safe sheet name
          const sheetName = sectionName.slice(0, 30).replace(/[^\w\s-]/g, '');
          XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Section');
        }
      });
      
      // Add summary sheet
      const summaryData = [
        { Field: 'Title', Value: lessonPlan.title || 'N/A' },
        { Field: 'Subject', Value: lessonPlan.subject || 'N/A' },
        { Field: 'Class', Value: lessonPlan.className || 'N/A' },
        { Field: 'Format', Value: lessonPlan.format || 'N/A' },
        { Field: 'Duration', Value: lessonPlan.duration ? `${lessonPlan.duration} minutes` : 'N/A' },
        { Field: 'Created', Value: new Date().toLocaleDateString() }
      ];
      
      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      summaryWs['!cols'] = [{ wch: 20 }, { wch: 50 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
      
    } else {
      // Original format-based export for structured data
      if (lessonPlan.format === 'REB') {
        const rebData = lessonPlan as any;

        // Create basic information sheet
        const basicInfoData = [
          { Field: 'School Name', Value: rebData.schoolName },
          { Field: 'Teacher Name', Value: rebData.teacherName },
          { Field: 'Subject', Value: rebData.subject },
          { Field: 'Class Level', Value: rebData.className },
          { Field: 'Term', Value: rebData.term },
          { Field: 'Date', Value: rebData.date ? new Date(rebData.date).toLocaleDateString() : '' },
          { Field: 'Duration (minutes)', Value: rebData.duration },
          { Field: 'Location', Value: rebData.location || '' },
          { Field: 'Special Needs', Value: rebData.type_of_special_educational_needs || '' }
        ];

        // Create lesson overview sheet
        const lessonOverviewData = [
          { Field: 'Unit Number', Value: rebData.lessonUnit },
          { Field: 'Unit Title', Value: rebData.title },
          { Field: 'Key Unit Competence', Value: rebData.key_unity_competence },
          { Field: 'Lesson Number', Value: rebData.lessonNumber },
          { Field: 'Lesson Title', Value: rebData.lessonTitle || '' },
          { Field: 'General Competencies', Value: Array.isArray(rebData.general_competencies) ? rebData.general_competencies.join('; ') : rebData.general_competencies },
          { Field: 'Learning Materials', Value: rebData.learning_materials }
        ];

        // Create activities sheet
        const activitiesData = [
          { Field: 'Teaching Activities', Value: rebData.teaching_activities },
          { Field: 'Learner Activities', Value: rebData.learner_activities },
          { Field: 'Timing for Each Step', Value: rebData.timing_for_each_step },
          { Field: 'Generic Competencies', Value: rebData.generic_competencies }
        ];

        // Create assessment sheet
        const assessmentData = [
          { Field: 'Assessment Method', Value: rebData.assessment_method },
          { Field: 'Assessment Tools', Value: rebData.assessment_tools || '' }
        ];

        // Create cross-cutting issues sheet
        const crossCuttingData = [
          { Field: 'Cross-cutting Issues', Value: rebData.cross_cutting_issues }
        ];

        // Add worksheets
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(basicInfoData), 'Basic Information');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(lessonOverviewData), 'Lesson Overview');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activitiesData), 'Teaching & Learning');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(assessmentData), 'Assessment');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(crossCuttingData), 'Cross-cutting Issues');

      } else if (lessonPlan.format === 'RTB') {
        const rtbData = lessonPlan as any;

        // Create institution information sheet
        const institutionData = [
          { Field: 'Sector', Value: rtbData.sector || '' },
          { Field: 'Trade', Value: rtbData.trade || '' },
          { Field: 'Level', Value: rtbData.level || '' },
          { Field: 'Date', Value: rtbData.date ? new Date(rtbData.date).toLocaleDateString() : '' },
          { Field: 'Instructor Name', Value: rtbData.instructorName },
          { Field: 'Module Title', Value: rtbData.moduleTitle || '' },
          { Field: 'Week', Value: rtbData.week || '' },
          { Field: 'Class Size', Value: rtbData.classSize || '' },
          { Field: 'Class Name', Value: rtbData.className || '' }
        ];

        // Create session details sheet
        const sessionDetailsData = [
          { Field: 'Topic of Session', Value: rtbData.topicOfSession || '' },
          { Field: 'Learning Outcomes', Value: rtbData.learningOutcomes || '' },
          { Field: 'Indicative Content', Value: rtbData.indicativeContent || '' },
          { Field: 'Range', Value: rtbData.range || '' },
          { Field: 'Facilitation Technique', Value: rtbData.facilitationTechnique || '' },
          { Field: 'Language', Value: rtbData.language || '' },
          { Field: 'Duration (minutes)', Value: rtbData.duration },
          { Field: 'Number of Development Steps', Value: rtbData.numberOfDevelopmentSteps || '' }
        ];

        // Create session objective sheet
        const objectivesData = [
          { Field: 'Session Objective', Value: rtbData.sessionObjective || '' },
          { Field: 'Key Competencies', Value: Array.isArray(rtbData.keyCompetencies) ? rtbData.keyCompetencies.join('; ') : rtbData.keyCompetencies || '' },
          { Field: 'Session Outcome', Value: rtbData.sessionOutcome || '' }
        ];

        // Create practical activities sheet
        const activitiesData = [
          { Field: 'Practical Activities', Value: Array.isArray(rtbData.practicalActivities) ? rtbData.practicalActivities.join('; ') : rtbData.practicalActivities || '' },
          { Field: 'Equipment Required', Value: Array.isArray(rtbData.equipmentRequired) ? rtbData.equipmentRequired.join('; ') : rtbData.equipmentRequired || '' },
          { Field: 'Safety Considerations', Value: rtbData.safetyConsiderations || '' }
        ];

        // Create assessment sheet
        const assessmentData = [
          { Field: 'Assessment Method', Value: rtbData.assessmentMethod || '' },
          { Field: 'Assessment Criteria', Value: rtbData.assessmentCriteria || '' }
        ];

        // Create reflection sheet
        const reflectionData = [
          { Field: 'Reflection Points', Value: rtbData.reflectionPoints || '' }
        ];

        // Add worksheets
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(institutionData), 'Institution Info');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sessionDetailsData), 'Session Details');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(objectivesData), 'Objectives');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activitiesData), 'Activities');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(assessmentData), 'Assessment');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(reflectionData), 'Reflection');
      } else {
        // Fallback to flattened format
        const flattenedData = flattenObject(lessonPlan);
        const tableData = Object.entries(flattenedData).map(([key, value]) => ({
          Field: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          Value: value
        }));
        
        const ws = XLSX.utils.json_to_sheet(tableData);
        const colWidths = [
          { wch: 30 }, // Field column
          { wch: 50 }  // Value column
        ];
        ws['!cols'] = colWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Lesson Plan');
      }
=======
    // Prepare data based on format
    if (lessonPlan.format === 'REB') {
      const rebData = lessonPlan as any;

      // Create basic information sheet
      const basicInfoData = [
        { Field: 'School Name', Value: rebData.schoolName },
        { Field: 'Teacher Name', Value: rebData.teacherName },
        { Field: 'Subject', Value: rebData.subject },
        { Field: 'Class Level', Value: rebData.className },
        { Field: 'Term', Value: rebData.term },
        { Field: 'Date', Value: rebData.date ? new Date(rebData.date).toLocaleDateString() : '' },
        { Field: 'Duration (minutes)', Value: rebData.duration },
        { Field: 'Class Size', Value: '' }, // Not in current structure
        { Field: 'Location', Value: rebData.location || '' },
        { Field: 'Language', Value: '' }, // Not in current structure
        { Field: 'Special Needs', Value: rebData.type_of_special_educational_needs || '' }
      ];

      // Create lesson overview sheet
      const lessonOverviewData = [
        { Field: 'Unit Number', Value: rebData.lessonUnit },
        { Field: 'Unit Title', Value: rebData.title },
        { Field: 'Key Unit Competence', Value: rebData.key_unity_competence },
        { Field: 'Lesson Number', Value: rebData.lessonNumber },
        { Field: 'Lesson Title', Value: rebData.lessonTitle || '' },
        { Field: 'General Competencies', Value: Array.isArray(rebData.general_competencies) ? rebData.general_competencies.join('; ') : rebData.general_competencies },
        { Field: 'Learning Materials', Value: rebData.learning_materials }
      ];

      // Create activities sheet
      const activitiesData = [
        { Section: 'Teaching Activities', Content: rebData.teaching_activities },
        { Section: 'Learner Activities', Content: rebData.learner_activities },
        { Section: 'Timing for Each Step', Content: rebData.timing_for_each_step },
        { Section: 'Generic Competencies', Content: rebData.generic_competencies }
      ];

      // Create assessment sheet
      const assessmentData = [
        { Field: 'Assessment Method', Value: rebData.assessment_method },
        { Field: 'Assessment Tools', Value: rebData.assessment_tools || '' }
      ];

      // Create cross-cutting issues sheet
      const crossCuttingData = [
        { Field: 'Cross-cutting Issues', Value: rebData.cross_cutting_issues }
      ];

      // Add worksheets
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(basicInfoData), 'Basic Information');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(lessonOverviewData), 'Lesson Overview');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activitiesData), 'Teaching & Learning');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(assessmentData), 'Assessment');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(crossCuttingData), 'Cross-cutting Issues');

    } else if (lessonPlan.format === 'RTB') {
      const rtbData = lessonPlan as any;

      // Create institution information sheet
      const institutionData = [
        { Field: 'Sector', Value: rtbData.sector || '' },
        { Field: 'Trade', Value: rtbData.trade || '' },
        { Field: 'Level', Value: rtbData.level || '' },
        { Field: 'Date', Value: rtbData.date ? new Date(rtbData.date).toLocaleDateString() : '' },
        { Field: 'Instructor Name', Value: rtbData.instructorName },
        { Field: 'Module Title', Value: rtbData.moduleTitle || '' },
        { Field: 'Week', Value: rtbData.week || '' },
        { Field: 'Class Size', Value: rtbData.classSize || '' },
        { Field: 'Class Name', Value: rtbData.className || '' }
      ];

      // Create session details sheet
      const sessionDetailsData = [
        { Field: 'Topic of Session', Value: rtbData.topicOfSession || '' },
        { Field: 'Learning Outcomes', Value: rtbData.learningOutcomes || '' },
        { Field: 'Indicative Content', Value: rtbData.indicativeContent || '' },
        { Field: 'Range', Value: rtbData.range || '' },
        { Field: 'Facilitation Technique', Value: rtbData.facilitationTechnique || '' },
        { Field: 'Language', Value: rtbData.language || '' },
        { Field: 'Duration (minutes)', Value: rtbData.duration },
        { Field: 'Number of Development Steps', Value: rtbData.numberOfDevelopmentSteps || '' }
      ];

      // Create session objective sheet
      const objectivesData = [
        { Field: 'Session Objective', Value: rtbData.sessionObjective || '' },
        { Field: 'Key Competencies', Value: Array.isArray(rtbData.keyCompetencies) ? rtbData.keyCompetencies.join('; ') : rtbData.keyCompetencies || '' },
        { Field: 'Session Outcome', Value: rtbData.sessionOutcome || '' }
      ];

      // Create practical activities sheet
      const activitiesData = [
        { Field: 'Practical Activities', Value: Array.isArray(rtbData.practicalActivities) ? rtbData.practicalActivities.join('; ') : rtbData.practicalActivities || '' },
        { Field: 'Equipment Required', Value: Array.isArray(rtbData.equipmentRequired) ? rtbData.equipmentRequired.join('; ') : rtbData.equipmentRequired || '' },
        { Field: 'Safety Considerations', Value: rtbData.safetyConsiderations || '' }
      ];

      // Create assessment sheet
      const assessmentData = [
        { Field: 'Assessment Method', Value: rtbData.assessmentMethod || '' },
        { Field: 'Assessment Criteria', Value: rtbData.assessmentCriteria || '' }
      ];

      // Create reflection sheet
      const reflectionData = [
        { Field: 'Reflection Points', Value: rtbData.reflectionPoints || '' }
      ];

      // Add worksheets
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(institutionData), 'Institution Info');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sessionDetailsData), 'Session Details');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(objectivesData), 'Objectives');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activitiesData), 'Activities');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(assessmentData), 'Assessment');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(reflectionData), 'Reflection');
>>>>>>> 50d166d (feat: add complete teacher management system with AI lesson planning)
    }

    // Write file and trigger download
    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error('Error exporting lesson plan to Excel:', error);
    return false;
  }
};

<<<<<<< HEAD
// Helper function to parse content and create structured tables for Excel
function parseContentToSectionsForExcel(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent = '';
  
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // Check if this line is a section header (starts with ##)
    if (trimmedLine.startsWith('## ')) {
      // Save previous section if exists
      if (currentSection && currentContent.trim()) {
        sections[currentSection] = currentContent.trim();
      }
      
      // Start new section
      currentSection = trimmedLine.replace('## ', '').replace(/\s*-\s*$/, '');
      currentContent = '';
    } else {
      // Add content to current section
      if (currentSection) {
        currentContent += line + '\n';
      }
    }
  });
  
  // Don't forget the last section
  if (currentSection && currentContent.trim()) {
    sections[currentSection] = currentContent.trim();
  }
  
  return sections;
}

=======
>>>>>>> 50d166d (feat: add complete teacher management system with AI lesson planning)
// Export lesson plan as single table (flattened)
export const exportLessonPlanAsTable = (lessonPlan: ExportableLessonPlan, filename: string = 'lesson-plan-table.xlsx') => {
  try {
    const wb = XLSX.utils.book_new();

<<<<<<< HEAD
    // If we have content with ## headers, use structured table format
    if (lessonPlan.content && typeof lessonPlan.content === 'string' && lessonPlan.content.includes('##')) {
      const sections = parseContentToSectionsForExcel(lessonPlan.content);
      
      Object.entries(sections).forEach(([sectionName, sectionContent]) => {
        // Split content into lines for processing
        const lines = sectionContent.split('\n').filter(line => line.trim());
        
        // Create table data for this section
        const sectionTableData = lines.map((line, index) => {
          const trimmedLine = line.trim();
          
          // Skip empty lines
          if (!trimmedLine) return null;
          
          // Check if it's a numbered/bulleted item
          const isBulletPoint = /^(\d+\.|\-|\*)\s/.test(trimmedLine);
          
          return {
            'Section': sectionName,
            'No.': isBulletPoint ? 
              (trimmedLine.match(/^(\d+\.|\-|\*)\s(.+)$/)?.[1] || '•') + ' ' : 
              (index + 1) + '.',
            'Content': isBulletPoint ? 
              trimmedLine.replace(/^(\d+\.|\-|\*)\s/, '') : 
              trimmedLine
          };
        }).filter(Boolean);
        
        if (sectionTableData.length > 0) {
          const ws = XLSX.utils.json_to_sheet(sectionTableData);
          
          // Auto-size columns
          const colWidths = [
            { wch: 20 }, // Section column
            { wch: 10 }, // No. column
            { wch: 80 }  // Content column
          ];
          ws['!cols'] = colWidths;
          
          // Use a safe sheet name
          const sheetName = sectionName.slice(0, 30).replace(/[^\w\s-]/g, '');
          XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Section');
        }
      });
    } else {
      // Fallback to flattened format
      const flattenedData = flattenObject(lessonPlan);
      
      // Convert to array of key-value pairs for table format
      const tableData = Object.entries(flattenedData).map(([key, value]) => ({
        Field: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        Value: value
      }));
      
      const ws = XLSX.utils.json_to_sheet(tableData);
      
      // Auto-size columns
      const colWidths = [
        { wch: 30 }, // Field column
        { wch: 50 }  // Value column
      ];
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, 'Lesson Plan');
    }

=======
    // Flatten the lesson plan object for table export
    const flattenedData = flattenObject(lessonPlan);

    // Convert to array of key-value pairs for table format
    const tableData = Object.entries(flattenedData).map(([key, value]) => ({
      Field: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      Value: value
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(tableData);

    // Auto-size columns
    const colWidths = [
      { wch: 30 }, // Field column
      { wch: 50 }  // Value column
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Lesson Plan');
>>>>>>> 50d166d (feat: add complete teacher management system with AI lesson planning)
    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error('Error exporting lesson plan table to Excel:', error);
    return false;
  }
};
