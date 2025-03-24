"use client"
import { useState } from "react";

const PdfViewer = () => {
  const [scale, setScale] = useState(50); 
  const [page, setPage] = useState(1); 
  const pdfPath = "assets/sample.pdf"; 


  return (
    <div className="h-[80svh] w-full">

      <iframe
        src={`${pdfPath}#page=${page}&zoom=${scale}`}
        className="h-full w-full"
      />
    </div>
  );
};

export default PdfViewer;