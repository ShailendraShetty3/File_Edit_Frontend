import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const BoundingBoxDisplay = ({ file, pages }) => {
  const [editedPages, setEditedPages] = useState(pages);

  const handleTextChange = (pageIndex, textIndex, newText) => {
    const updatedPages = [...editedPages];
    updatedPages[pageIndex].textContent.items[textIndex].str = newText;
    setEditedPages(updatedPages);
  };

  const saveEditedPDF = async () => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = async function () {
      const pdfDoc = await PDFDocument.load(this.result);

      for (let i = 0; i < editedPages.length; i++) {
        const page = pdfDoc.getPage(i);
        const { textContent } = editedPages[i];

        // Loop through edited text and draw on the PDF
        textContent.items.forEach((item) => {
          page.drawText(item.str, {
            x: item.transform[4], // Use the original position or adjust as needed
            y: item.transform[5], // Use the original position or adjust as needed
          });
        });
      }

      const pdfBytes = await pdfDoc.save();

      // Download the modified PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'edited-document.pdf';
      link.click();
    };
  };

  return (
    <div>
      {/* Display pages with editable text */}
      {pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          <canvas
            ref={(canvas) => {
              if (canvas) {
                const context = canvas.getContext('2d');
                canvas.width = page.canvas.width;
                canvas.height = page.canvas.height;
                context.drawImage(page.canvas, 0, 0);
              }
            }}
          />
          {page.textContent.items.map((item, textIndex) => (
            <input
              key={textIndex}
              type="text"
              value={editedPages[pageIndex].textContent.items[textIndex].str}
              onChange={(e) => handleTextChange(pageIndex, textIndex, e.target.value)}
              style={{
                position: 'absolute',
                left: item.transform[4], // X position
                top: item.transform[5],  // Y position
                border: '1px solid red',
              }}
            />
          ))}
        </div>
      ))}

      {/* Save button */}
      <button onClick={saveEditedPDF}>Save Changes</button>
    </div>
  );
};

export default BoundingBoxDisplay;
