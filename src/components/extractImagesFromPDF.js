import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const extractTextAndImagesFromPDF = async (file) => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  return new Promise((resolve, reject) => {
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;

      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const images = await page.getOperatorList(); // For image extraction

        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = { canvasContext: context, viewport };
        await page.render(renderContext).promise;

        pages.push({ textContent, images, canvas });
      }
      resolve(pages);
    };

    fileReader.onerror = function (error) {
      reject(error);
    };
  });
};
