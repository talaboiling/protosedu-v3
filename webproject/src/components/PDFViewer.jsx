import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewer = ({ pdfUrl, initialPage = 1, onClose }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div style={{ height: "800px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <button
                    onClick={onClose}
                >
                    Закрыть
                </button>
                <Viewer
                    fileUrl={pdfUrl}
                    defaultScale={1}
                    plugins={[defaultLayoutPluginInstance]}
                    initialPage={currentPage - 1}
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
