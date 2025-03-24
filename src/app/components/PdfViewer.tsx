"use client"
import { useState } from "react";

const PdfViewer = ({fileUrl}:{fileUrl:string}) => {
  const [scale, setScale] = useState(50); 
  const [page, setPage] = useState(1); 


  return (
    <div className="h-[80svh] w-full">

      <iframe
        src={`${fileUrl}#page=${page}&zoom=${scale}`}
        className="h-full w-full"
      >
        <p>
          Your browser does not support PDFs.
          <a href={fileUrl} download>Download PDF</a> instead.
        </p>
      </iframe>
    </div>
  );
};

export default PdfViewer;