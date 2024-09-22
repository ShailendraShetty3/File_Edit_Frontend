import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack"; // Import PDF.js
import { PDFDocument, rgb } from "pdf-lib"; // Import pdf-lib to modify the PDF
import "./style.css"; // Custom CSS

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [textBoxes, setTextBoxes] = useState([]);
  const [editedTextBoxes, setEditedTextBoxes] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validFormats = ["application/pdf"];

    if (file && validFormats.includes(file.type)) {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async function () {
        const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
        setPdfData(pdf);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  }, [selectedFile]);

  const renderPage = (pageNum) => {
    pdfData.getPage(pageNum).then((page) => {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.getElementById("pdf-canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // Render PDF page to the canvas
      page.render(renderContext).promise.then(() => {
        extractText(page);
      });
    });
  };

  // Extract text from the PDF and create textboxes over the canvas
  const extractText = async (page) => {
    const textContent = await page.getTextContent();
    const newTextBoxes = textContent.items.map((item) => {
      const transform = item.transform;
      const x = transform[4];
      const y = transform[5];
      const width = item.width;
      const height = item.height;
      return {
        text: item.str,
        x: x,
        y: y - height, // Adjust based on transform height
        width: width,
        height: height,
        fontSize: item.height, // Capture the font size
      };
    });

    setTextBoxes(newTextBoxes);
    setEditedTextBoxes(newTextBoxes.map((box) => box.text));
  };

  useEffect(() => {
    if (pdfData) {
      renderPage(1);
    }
  }, [pdfData]);

  // Handle text edits in the text boxes
  const handleTextChange = (index, newText) => {
    const updatedTextBoxes = [...editedTextBoxes];
    updatedTextBoxes[index] = newText;
    setEditedTextBoxes(updatedTextBoxes);
  };

  const savePdf = async () => {
    if (!selectedFile) return;

    const existingPdfBytes = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    textBoxes.forEach((box, index) => {
      const originalText = box.text;
      const editedText = editedTextBoxes[index];

      // If the text has changed, we overwrite the old text with a blank rectangle and add the new text
      if (originalText !== editedText) {
        // Draw a rectangle over the old text (to erase it)
        firstPage.drawRectangle({
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          color: rgb(1, 1, 1), // White color to "erase" the original text
        });

        // Draw the new text on the same position with the original font size
        firstPage.drawText(editedText, {
          x: box.x,
          y: box.y + box.height,
          size: box.fontSize, // Use the original font size
          color: rgb(0, 0, 0), // Black color for the new text
        });
      }
    });

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "edited-file.pdf", "application/pdf");
  };

  const download = (data, filename, type) => {
    const blob = new Blob([data], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="app-container">
      <h2>PDF Upload and Edit</h2>

      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="pdf-viewer" style={{ position: "relative" }}>
        <canvas id="pdf-canvas"></canvas>

        {/* Render text boxes for editing */}
        {textBoxes.map((box, index) => (
          <textarea
            key={index}
            value={editedTextBoxes[index]}
            onChange={(e) => handleTextChange(index, e.target.value)}
            style={{
              position: "absolute",
              left: `${box.x}px`,
              top: `${box.y}px`,
              width: `${box.width}px`,
              height: `${box.height}px`,
              backgroundColor: "rgba(255,255,255,0.5)", // Semi-transparent background for text editing
              border: "1px solid #000",
              fontSize: box.fontSize, // Match the original font size
            }}
          />
        ))}
      </div>

      {pdfData && (
        <div className="edit-section">
          <button onClick={savePdf}>Save PDF</button>
        </div>
      )}
    </div>
  );
};

export default App;
