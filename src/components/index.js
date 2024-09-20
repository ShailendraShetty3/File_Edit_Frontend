import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';

const App = () => {
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (file) => {
    const fileReader = new FileReader();
    setLoading(true);

    fileReader.onload = async () => {
      try {
        const arrayBuffer = fileReader.result;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setPdfData(pdfDoc); // Store the PDF document instead of the raw buffer
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  const saveEditedPDF = async () => {
    if (!pdfData) return; // Prevent errors if pdfData is null

    const editedPdfBytes = await pdfData.save();
    const blob = new Blob([editedPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'edited-document.pdf';
    link.click();
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />
      {loading && <p>Loading PDF...</p>}
      {pdfData && (
        <>
          <button onClick={saveEditedPDF}>Save Edited PDF</button>
          {/* You can replace this with your PDF rendering logic */}
          <p>PDF Loaded. You can now edit and save it.</p>
        </>
      )}
    </div>
  );
};

export default App;
