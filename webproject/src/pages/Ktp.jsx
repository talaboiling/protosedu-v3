import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import { fetchDocuments } from "../utils/apiService";
import Loader from "./Loader";
import styles from './Ktp.module.css';  // Importing the CSS module

const Ktp = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showDocument, setShowDocument] = useState(false);

    useEffect(() => {
        if (selectedGrade !== null) {
            setLoading(true);
            setError(null);

            fetchDocuments("ktp", selectedGrade)
                .then((data) => {
                    setDocuments(data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError("Error fetching documents. Please try again later.");
                    setLoading(false);
                });
        }
        setLoading(false);
    }, [selectedGrade]);

    if (loading && !error) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <Link to="/" className={styles.backButton}>← Назад</Link>
                <h1 className={styles.title}>КТП</h1>
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link to="/" className={styles.backButton}>← Назад</Link>

            <h1 className={styles.title}>КТП</h1>

            <div className={styles.gradeButtonContainer}>
                {Array.from({ length: 5 }, (_, index) => (
                    <button
                        key={index}
                        className={`${styles.gradeButton} ${selectedGrade === index + 1 ? styles.gradeButtonActive : ""}`}
                        onClick={() => {
                            setSelectedGrade(index + 1);
                            setShowDocument(false);
                            setSelectedDocument(null);
                        }}
                    >
                        {index + 1} Класс
                    </button>
                ))}
            </div>

            {documents.length > 0 ? (
                <div className={styles.documentListContainer}>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Документы для {selectedGrade} класса
                    </h2>
                    {documents.map((document) => (
                        <div key={document.id}>
                            <button
                                onClick={() => {
                                    setSelectedDocument(document);
                                    setShowDocument(true);
                                }}
                                className={styles.documentButton}
                            >
                                {document.name}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.noDocuments}>Нет документов для этого класса.</p>
            )}

            {showDocument && selectedDocument && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowDocument(false)}
                        >
                            Закрыть
                        </button>
                        <button
                            className={styles.downloadButton}
                            onClick={() => {
                                // Trigger download of the file directly
                                const link = document.createElement('a');
                                link.href = selectedDocument.file;  // URL of the document to download
                                link.download = selectedDocument.name;  // Specify the file name for download
                                document.body.appendChild(link);  // Append link to the document body
                                link.click();  // Programmatically trigger the click to start the download
                                document.body.removeChild(link);  // Remove the link after the download is triggered
                            }}
                        >
                            Скачать
                        </button>

                        <PDFViewer pdfUrl={selectedDocument.file} initialPage={1} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ktp;
