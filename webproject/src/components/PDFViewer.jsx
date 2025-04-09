import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewer = ({ pdfUrl, initialPage = 1 }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div style={{ height: "800px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={pdfUrl}
                    defaultScale={1}
                    viewMode="DualPage"
                    plugins={[defaultLayoutPluginInstance]}
                    initialPage={currentPage - 1}
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
