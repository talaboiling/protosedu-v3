import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewer = ({ pdfUrl, initialPage = 1 }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [currentPage, setCurrentPage] = useState(initialPage);

    return (
        <div style={{ height: "800px" }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`} >
                <Viewer
                    fileUrl={pdfUrl}
                    defaultScale={1.5}
                    plugins={[defaultLayoutPluginInstance]}
                    initialPage={currentPage - 1} // Pages are zero-indexed
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
