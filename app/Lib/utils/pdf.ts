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
  };

  let yPosition = addHeader(doc, 'Lesson Plan', metadata);

  // Add lesson content
  doc.setFontSize(11);
  const content = lessonPlan.content as string || JSON.stringify(lessonPlan, null, 2);

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
}
