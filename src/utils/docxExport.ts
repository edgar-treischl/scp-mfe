import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import type { Submission } from '../types';

export async function exportSubmissionAsDOCX(submission: Submission): Promise<void> {
  try {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    };

    const formatDateShort = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    };

    const data = submission.data;
    const istStandAnalyse: string = (data.istStandAnalyse as string) || '';
    const selectedGoal: string = (data.selectedGoal as string) || '';
    const questionModules = (data.questionModules || []) as typeof data.questionModules;

    const children = [
      // Header
      new Paragraph({
        children: [new TextRun({ text: 'Einreichung ansehen', bold: true, size: 32 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: `Schulnummer: ${submission.schulnummer}`,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `Status: ${submission.status}`, bold: true })],
        spacing: { after: 400 },
      }),

      // Metadata
      new Paragraph({
        children: [new TextRun({ text: 'Erstellt: ', bold: true }), new TextRun(formatDate(submission.createdAt))],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Aktualisiert: ', bold: true }), new TextRun(formatDate(submission.updatedAt))],
        spacing: { after: 100 },
      }),
    ];

    if (submission.submittedAt) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Eingereicht: ', bold: true }), new TextRun(formatDate(submission.submittedAt))],
          spacing: { after: 400 },
        })
      );
    } else {
      children.push(new Paragraph({ text: '', spacing: { after: 400 } }));
    }

    // Ist-Stand section
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Ist-Stand', bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Grundlegende Erkenntnisse zur IST-Stand-Analyse in Kurzfassung', bold: true })],
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: istStandAnalyse,
        spacing: { after: 400 },
      })
    );

    // Ziele section
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Ziele', bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );

    questionModules.forEach((module, index) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `Ziel ${index + 1}`, bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 300, after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Ziel', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: selectedGoal,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'SMART-Ziel', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: module.smartGoal,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Zielgruppe', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: module.targetGroup.join(', '),
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Fachbereiche', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: module.subject.join(', '),
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Zeitpunkt für die Zielerreichung', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Startdatum: ', bold: true }),
            new TextRun(formatDateShort(module.startDate)),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Enddatum: ', bold: true }),
            new TextRun(formatDateShort(module.endDate)),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Kommentare', bold: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: module.comments,
          spacing: { after: 300 },
        })
      );
    });

    // Create document
    const doc = new Document({
      sections: [{ children }],
    });

    // Generate and save document
    const blob = await Packer.toBlob(doc);
    const fileName = `submission-${submission.schulnummer}-${new Date().toISOString().split('T')[0]}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('DOCX export failed:', error);
    throw new Error(`Failed to export submission as DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
