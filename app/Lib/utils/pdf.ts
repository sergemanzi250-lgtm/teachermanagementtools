<<<<<<< HEAD
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface AutoTableOptions {
  head?: string[][];
  body?: string[][];
  startY?: number;
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  didDrawPage?: (data: { pageCount: number }) => void;
  didDrawCell?: (data: unknown) => void;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable(options: AutoTableOptions): jsPDF;
  }
}

// Helper function to add footer with page numbers
function addFooter(doc: jsPDF, pageCount: number) {
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
}

// Helper function to add title and metadata
function addHeader(doc: jsPDF, title: string, metadata: Record<string, string>) {
  doc.setFontSize(18);
  doc.text(title, 15, 20);

  doc.setFontSize(10);
  let yPosition = 30;
  Object.entries(metadata).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`, 15, yPosition);
    yPosition += 7;
  });

  return yPosition + 5;
}

// Helper function to parse content and create structured tables for PDF
function parseContentToSectionsForPDF(content: string): Record<string, string> {
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

// Helper function to render content tables for PDF with columns and rows
function renderContentTablesForPDF(doc: jsPDF, content: string, startY: number): number {
  const sections = parseContentToSectionsForPDF(content);
  let yPosition = startY;
  
  Object.entries(sections).forEach(([sectionName, sectionContent]) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add section header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246); // Blue color
    
    doc.text(sectionName, 15, yPosition);
    yPosition += 10;
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Split content into lines for processing
    const lines = sectionContent.split('\n').filter(line => line.trim());
    
    // Create table header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(59, 130, 246);
    doc.setTextColor(255, 255, 255);
    
    doc.rect(15, yPosition - 5, 180, 8, 'F');
    doc.text('No.', 20, yPosition + 1);
    doc.text('Content', 50, yPosition + 1);
    
    yPosition += 10;
    doc.setTextColor(0, 0, 0);
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return;
      
      // Check if it's a numbered/bulleted item
      const isBulletPoint = /^(\d+\.|\-|\*)\s/.test(trimmedLine);
      
      // Set row background color
      if (index % 2 === 0) {
        doc.setFillColor(239, 246, 255); // Light blue
      } else {
        doc.setFillColor(255, 255, 255); // White
      }
      doc.rect(15, yPosition - 2, 180, 8, 'F');
      
      // Add content
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      // Number/bullet column
      const numberOrBullet = isBulletPoint ? 
        (trimmedLine.match(/^(\d+\.|\-|\*)\s(.+)$/)?.[1] || '•') + ' ' : 
        (index + 1) + '.';
      
      doc.text(numberOrBullet, 20, yPosition + 3);
      
      // Content column
      const content = isBulletPoint ? 
        trimmedLine.replace(/^(\d+\.|\-|\*)\s/, '') : 
        trimmedLine;
      
      const contentLines = doc.splitTextToSize(content, 140);
      doc.text(contentLines, 50, yPosition + 3);
      
      yPosition += Math.max(8, contentLines.length * 4);
      
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    yPosition += 10; // Space between sections
  });
  
  return yPosition;
}

// Export Lesson Plan to PDF
export function exportLessonPlanToPDF(
  lessonPlan: Record<string, unknown>,
  filename: string = 'lesson-plan.pdf'
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Metadata
  const metadata: Record<string, string> = {
    Subject: lessonPlan.subject as string || 'N/A',
    Grade: lessonPlan.className as string || 'N/A',
    Duration: `${lessonPlan.duration || 'N/A'} minutes`,
    Date: new Date().toLocaleDateString(),
    Format: lessonPlan.format as string || 'N/A',
  };

  // Determine document title based on format
  const format = lessonPlan.format as string;
  const documentTitle = format === 'RTB' ? 'Session Plan' : 'Lesson Plan';
  
  let yPosition = addHeader(doc, documentTitle, metadata);
  yPosition += 10;

  // If we have content with ## headers, use structured table format
  if (lessonPlan.content && typeof lessonPlan.content === 'string' && lessonPlan.content.includes('##')) {
    yPosition = renderContentTablesForPDF(doc, lessonPlan.content as string, yPosition);
  } 
  // Add structured content if parsed data is available
  else if (lessonPlan.parsed && typeof lessonPlan.parsed === 'object') {
    const parsed = lessonPlan.parsed as Record<string, unknown>;
    
    // Group related fields into sections like in web display
    const sections = {
      'Basic Information': ['title', 'subject', 'className', 'format', 'duration', 'createdAt'],
      'Teaching Details': ['teaching_activities', 'learner_activities', 'timing_for_each_step', 'teaching_and_learning_activities_description'],
      'Assessment': ['assessment_method', 'assessment_tools', 'assessmentCriteria'],
      'Materials & Resources': ['learning_materials', 'equipmentRequired', 'materials'],
      'Competencies & Objectives': ['key_unity_competence', 'general_competencies', 'learningObjectives', 'keyCompetencies', 'sessionObjective'],
      'Additional Details': ['location', 'term', 'date', 'schoolName', 'teacherName', 'instructorName', 'sessionNumber', 'sessionDate']
    };

    Object.entries(sections).forEach(([sectionName, fields]) => {
      const sectionData = Object.entries(parsed)
        .filter(([key]) => fields.includes(key) && !['id', '_id', 'userId', 'updatedAt'].includes(key))
        .map(([key, value]) => ({
          field: formatFieldNameForPDF(key),
          value: formatValueForPDF(value)
        }));

      if (sectionData.length === 0) return;

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Add section header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246); // Blue color
      
      doc.text(sectionName, 15, yPosition);
      yPosition += 10;

      // Create table header
      doc.setFillColor(59, 130, 246);
      doc.setTextColor(255, 255, 255);
      doc.rect(15, yPosition - 5, 180, 8, 'F');
      
      doc.setFontSize(10);
      doc.text('Field', 20, yPosition + 1);
      doc.text('Content', 100, yPosition + 1);
      
      yPosition += 10;
      doc.setTextColor(0, 0, 0);

      // Add table rows
      sectionData.forEach((item, index) => {
        // Set row background color
        if (index % 2 === 0) {
          doc.setFillColor(239, 246, 255); // Light blue
        } else {
          doc.setFillColor(255, 255, 255); // White
        }
        doc.rect(15, yPosition - 2, 180, 8, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(item.field, 20, yPosition + 3);
        
        doc.setFont('helvetica', 'normal');
        const contentLines = doc.splitTextToSize(item.value, 120);
        doc.text(contentLines, 100, yPosition + 3);
        
        yPosition += Math.max(8, contentLines.length * 4);
        
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      yPosition += 10; // Space between sections
    });
  } else {
    // Fallback to raw content
    doc.setFontSize(11);
    const content = lessonPlan.content as string || JSON.stringify(lessonPlan, null, 2);
    
    const lines = doc.splitTextToSize(content, pageWidth - 30);
    
    lines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 15;
      }
      doc.text(line, 15, yPosition);
      yPosition += 5;
    });
  }

  const pageCount = doc.internal.pages.length - 1;
  addFooter(doc, pageCount);

  doc.save(filename);
}

// Helper function to format field names for PDF
function formatFieldNameForPDF(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

// Helper function to format values for PDF
function formatValueForPDF(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item, index) => `${index + 1}. ${formatValueForPDF(item)}`).join('\n');
  } else if (typeof value === 'object' && value !== null) {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${formatValueForPDF(v)}`)
      .join('\n');
  } else {
    return String(value);
  }
}

// Export Quiz to PDF
export function exportQuizToPDF(
  quiz: Record<string, unknown>,
  filename: string = 'quiz.pdf'
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const metadata: Record<string, string> = {
    Topic: quiz.topic as string || 'N/A',
    Date: new Date().toLocaleDateString(),
    'Total Questions': quiz.totalQuestions ? String(quiz.totalQuestions) : 'N/A',
  };

  let yPosition = addHeader(doc, quiz.quizTitle as string || 'Quiz', metadata);

  // Add quiz content
  doc.setFontSize(10);
  const content = quiz.content as string || JSON.stringify(quiz, null, 2);

  const lines = doc.splitTextToSize(content, pageWidth - 30);
  yPosition += 10;

  lines.forEach((line: string) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 15;
    }
    doc.text(line, 15, yPosition);
    yPosition += 5;
  });

  const pageCount = doc.internal.pages.length - 1;
  addFooter(doc, pageCount);

  doc.save(filename);
}

// Export Rubric to PDF
export function exportRubricToPDF(
  rubric: Record<string, unknown>,
  filename: string = 'rubric.pdf'
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const metadata: Record<string, string> = {
    Assignment: rubric.assignment as string || 'N/A',
    'Total Points': rubric.totalPoints ? String(rubric.totalPoints) : 'N/A',
    Date: new Date().toLocaleDateString(),
  };

  let yPosition = addHeader(doc, rubric.rubricTitle as string || 'Rubric', metadata);

  // Add rubric content
  doc.setFontSize(10);
  const content = rubric.content as string || JSON.stringify(rubric, null, 2);

  const lines = doc.splitTextToSize(content, pageWidth - 30);
  yPosition += 10;

  lines.forEach((line: string) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 15;
    }
    doc.text(line, 15, yPosition);
    yPosition += 5;
  });

  const pageCount = doc.internal.pages.length - 1;
  addFooter(doc, pageCount);

  doc.save(filename);
}

// Generic PDF export
export function exportToPDF(
  content: Record<string, unknown> | string,
  title: string = 'Document',
  filename: string = 'document.pdf'
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 15, 20);

  // Add content
  doc.setFontSize(10);
  const contentText = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const lines = doc.splitTextToSize(contentText, pageWidth - 30);

  let yPosition = 35;
  lines.forEach((line: string) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 15;
    }
    doc.text(line, 15, yPosition);
    yPosition += 5;
  });

  const pageCount = doc.internal.pages.length - 1;
  addFooter(doc, pageCount);

  doc.save(filename);
}

// Convert HTML to PDF
export function exportHTMLToPDF(
  htmlElement: HTMLElement,
  title: string = 'Document',
  filename: string = 'document.pdf'
): void {
  const doc = new jsPDF();

  // Get text content from HTML element
  const text = htmlElement.innerText;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 15, 20);

  // Split text and add to PDF
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(text, pageWidth - 30);

  let yPosition = 35;
  lines.forEach((line: string) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 15;
    }
    doc.text(line, 15, yPosition);
    yPosition += 5;
  });

  const pageCount = doc.internal.pages.length - 1;
  addFooter(doc, pageCount);

  doc.save(filename);
}

// Create printable HTML for preview before PDF
export function createPrintableHTML(content: Record<string, unknown> | string, title: string): string {
  const contentText = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 20px;
            max-width: 900px;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          pre {
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
          .metadata {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="metadata">
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <pre>${contentText}</pre>
      </body>
    </html>
  `;
=======
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts;

export function exportLessonPlanToPDF(plan: any, filename: string) {
  if (!plan?.parsed) throw new Error('Lesson plan missing parsed structure');

  const p = plan.parsed;
  const format = plan.format;

  let content: any[] = [];

  if (format === 'RTB') {
    content = [
      // HEADER
      {
        text: 'SESSION PLAN',
        alignment: 'center',
        style: 'title',
        margin: [0, 0, 0, 10]
      },

      // META GRID
      {
        style: 'metaTable',
        table: {
          widths: ['25%', '25%', '25%', '25%'],
          body: [
            ['Sector', p.Sector || '', 'Trade', p.Trade || ''],
            ['Level', p.Level || '', 'Date', p.Date || ''],
            ['Trainer name', p.Trainer_name || '', 'Term', p.Term || ''],
            ['Module title', p.Module_title || '', 'Week', p.Week || ''],
            ['No. Trainees', p.No_Trainees?.toString() || '', 'Class', p.Class || ''],
          ]
        },
        margin: [0, 0, 0, 15]
      },

      // TOPIC + OBJECTIVES
      sectionTitle('Topic of the session'),
      textLine(p.Topic_of_the_session),

      sectionTitle('Objectives'),
      bulletList(p.Objectives),

      sectionTitle('Facilitation technique(s)'),
      bulletList(p.Facilitation_technique),

      divider(),

      // INTRODUCTION TABLE
      sectionTitle('Introduction'),
      buildActivityTable(p.Introduction || {}),

      divider(),

      // DEVELOPMENT BODY
      sectionTitle('Development / Body'),
      ...(p.Development_Body && Array.isArray(p.Development_Body) ? p.Development_Body.map((step: any) => ({
        stack: [
          { text: `Step ${step.Step}`, style: 'stepTitle' },
          buildActivityTable(step),
          { text: '\n' }
        ]
      })) : [])
    ];
  } else if (format === 'REB') {
    content = [
      // HEADER
      {
        text: 'LESSON PLAN',
        alignment: 'center',
        style: 'title',
        margin: [0, 0, 0, 10]
      },

      // META INFO
      sectionTitle('Lesson Details'),
      {
        style: 'metaTable',
        table: {
          widths: ['25%', '25%', '25%', '25%'],
          body: [
            ['Subject', p.Subject || '', 'Class', p.Class || ''],
            ['Teacher', p.Teacher || '', 'Date', p.Date || ''],
            ['Duration', p.Duration || '', 'Term', p.Term || ''],
          ]
        },
        margin: [0, 0, 0, 15]
      },

      sectionTitle('Topic'),
      textLine(p.Topic),

      sectionTitle('Objectives'),
      bulletList(p.Objectives),

      sectionTitle('Materials'),
      bulletList(p.Materials),

      divider(),

      sectionTitle('Introduction'),
      textLine(p.Introduction),

      divider(),

      sectionTitle('Main Activities'),
      textLine(p.Main_Activities),

      divider(),

      sectionTitle('Assessment'),
      textLine(p.Assessment),
    ];
  } else if (format === 'NURSERY') {
    content = [
      // HEADER
      {
        text: 'NURSERY LESSON PLAN',
        alignment: 'center',
        style: 'title',
        margin: [0, 0, 0, 10]
      },

      // META INFO
      sectionTitle('Lesson Details'),
      {
        style: 'metaTable',
        table: {
          widths: ['25%', '25%', '25%', '25%'],
          body: [
            ['Age Group', p.Age_Group || '', 'Theme', p.Theme || ''],
            ['Teacher', p.Teacher || '', 'Date', p.Date || ''],
            ['Duration', p.Duration || '', 'Location', p.Location || ''],
          ]
        },
        margin: [0, 0, 0, 15]
      },

      sectionTitle('Learning Objectives'),
      bulletList(p.Learning_Objectives),

      sectionTitle('Materials'),
      bulletList(p.Materials),

      divider(),

      sectionTitle('Introduction Activity'),
      textLine(p.Introduction_Activity),

      divider(),

      sectionTitle('Main Activities'),
      ...(p.Main_Activities && Array.isArray(p.Main_Activities) ? p.Main_Activities.map((activity: any) => ({
        stack: [
          { text: activity.Title || '', style: 'stepTitle' },
          textLine(activity.Description || ''),
          { text: '\n' }
        ]
      })) : []),

      divider(),

      sectionTitle('Closing Activity'),
      textLine(p.Closing_Activity),
    ];
  } else {
    // Fallback
    content = [
      {
        text: 'Lesson Plan',
        alignment: 'center',
        style: 'title',
        margin: [0, 0, 0, 10]
      },
      {
        text: p.content || 'No content available',
        fontSize: 12
      }
    ];
  }

  const doc: any = {
    pageSize: 'A4',
    pageMargins: [40, 50, 40, 40],
    content,
    styles: {
      title: { fontSize: 18, bold: true },
      sectionTitle: { fontSize: 14, bold: true, margin: [0, 10, 0, 4] },
      stepTitle: { fontSize: 13, bold: true, margin: [0, 6, 0, 2] },
      metaTable: { fontSize: 10 },
      tableHeader: { bold: true, fillColor: '#e5e5e5' }
    }
  };

  pdfMake.createPdf(doc).download(filename);
}

/* ---------- HELPERS ---------- */

const sectionTitle = (t: string) => ({ text: t, style: 'sectionTitle' });

const textLine = (t: string | undefined) => ({ text: (t || '') + '\n', fontSize: 11 });

const bulletList = (items: string[] | undefined) => ({
  ul: items && Array.isArray(items) ? items.map(i => i.trim()) : [],
  fontSize: 11,
  margin: [0, 0, 0, 8]
});

const divider = () => ({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 520, y2: 0 }] });

const buildActivityTable = (block: any) => ({
  style: 'metaTable',
  table: {
    widths: ['25%', '35%', '20%', '20%'],
    body: [
      [
        { text: 'Trainer Activity', style: 'tableHeader' },
        { text: 'Learner Activity', style: 'tableHeader' },
        { text: 'Resources', style: 'tableHeader' },
        { text: 'Duration', style: 'tableHeader' }
      ],
      [
        block.Trainer_activity && Array.isArray(block.Trainer_activity) ? block.Trainer_activity.join('\n') : '',
        block.Learner_activity && Array.isArray(block.Learner_activity) ? block.Learner_activity.join('\n') : '',
        block.Resources && Array.isArray(block.Resources) ? block.Resources.join('\n') : '',
        block.Duration || ''
      ]
    ]
  },
  margin: [0, 0, 0, 10]
});

export function exportToPDF(htmlContent: string, filename: string) {
  const doc: any = {
    pageSize: 'A4',
    pageMargins: [40, 50, 40, 40],
    content: [
      {
        text: htmlContent,
        style: 'html'
      }
    ],
    styles: {
      html: { fontSize: 12 }
    }
  };

  pdfMake.createPdf(doc).download(filename);
>>>>>>> 50d166d (feat: add complete teacher management system with AI lesson planning)
}
