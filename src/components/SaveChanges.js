import { PDFDocument } from "pdf-lib";

const saveChangesToPDF = async (file, modifiedTexts) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  modifiedTexts.forEach(({ bbox, text }) => {
    firstPage.drawText(text, {
      x: bbox.x0,
      y: firstPage.getHeight() - bbox.y1, // Convert to PDF coordinate system
      size: 12,
    });
  });

  const modifiedPdfBytes = await pdfDoc.save();

  const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "modified.pdf";
  link.click();
};

export default saveChangesToPDF;
