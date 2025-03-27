"use client"
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import React,{ useState } from "react";
import { Toolbar } from "@mui/material";

const PdfViewer = ({fileUrl}:{fileUrl:string}) => {
  const [scale, setScale] = useState(50); 
  const [page, setPage] = useState(1); 

  const defaultLayout = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(props) => {
          const { Download, Print, Zoom ,NumberOfPages,SwitchTheme,CurrentPageInput} = props;
          return (
            <nav className="flex w-full justify-between items-center">
              <div className="flex">
                <Download />
                <Print />
              </div>

              <div className="flex items-center">
                <div className="text-sm flex mx-2 ">
                  <CurrentPageInput /> / <NumberOfPages/>
                </div>

                <Print />
              </div>

              <div className="flex text-sm items-center">
                <Zoom />
                <SwitchTheme />
              </div>
            </nav>
          );
        }}
      </Toolbar>
    )
  });

  return (
    <div className="h-[80svh] w-full scheme-dark">

      {/* <iframe
        src={`${fileUrl}#page=${page}&zoom=${scale}`}
        className="h-full w-full"
      >
        <p>
          Your browser does not support PDFs.
          <a href={fileUrl} download>Download PDF</a> instead.
        </p>
      </iframe> */}
      <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
        <Viewer fileUrl={fileUrl} plugins={[defaultLayout]} />
      </Worker>
    </div>
  );
};

export default PdfViewer;