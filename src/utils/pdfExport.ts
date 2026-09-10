import jsPDF from 'jspdf';
import type { Submission } from '../types';

export async function exportSubmissionAsPDF(submission: Submission, elementId: string): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Use jsPDF's html() method for efficient pagination and rendering
    await pdf.html(element, {
      x: 10,
      y: 10,
      width: 190, // A4 width (210mm) - 20mm margins
      margin: [10, 10, 10, 10],
      html2canvas: {
        scale: 1.5, // Lower scale for smaller file size
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      },
      callback: () => {
        // Generate filename with submission schulnummer and current date
        const fileName = `submission-${submission.schulnummer}-${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
      },
    });
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error(`Failed to export submission as PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
