import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfMake with fonts
if (typeof window !== 'undefined') {
  (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || pdfFonts;
}

export function exportLessonPlanToPDF(plan: any, filename: string) {
  if (!plan?.parsed) {
    console.error('Lesson plan missing parsed structure:', plan);
    throw new Error('Lesson plan missing parsed structure');
  }

  const p = plan.parsed;
  const format = plan.format || 'REB'; // Default to REB if format is missing

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
    // Fallback - render all parsed fields as a generic table
    content = [
      {
        text: 'Lesson Plan',
        alignment: 'center',
        style: 'title',
        margin: [0, 0, 0, 10]
      },
      ...Object.entries(p).map(([key, value]) => ({
        stack: [
          sectionTitle(key.replace(/_/g, ' ')),
          textLine(Array.isArray(value) ? value.join(', ') : String(value || '')),
        ]
      }))
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
}
