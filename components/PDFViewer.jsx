// src/components/PdfViewer.jsx
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set workerSrc (required for react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Document file={fileUrl} onLoadSuccess={onLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          Prev
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
