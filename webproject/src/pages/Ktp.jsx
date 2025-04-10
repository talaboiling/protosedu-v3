import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import Loader from "./Loader";
import { fetchSubjects, fetchDocuments } from "../utils/apiService";
import styles from './Ktp.module.css';
import pdfIcon from "../assets/pdf-icon.png";

const Ktp = () => {
    const [subjects, setSubjects] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showDocument, setShowDocument] = useState(false);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowDocument(false);
            }
        };

        if (showDocument) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showDocument]);


    useEffect(() => {
        if (selectedGrade !== null) {
            setLoading(true);
            setError(null);
            fetchSubjects(selectedGrade)
                .then(data => {
                    setSubjects(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching subjects:", err);
                    setError("Ошибка при получении предметов. Попробуйте позже.");
                    setLoading(false);
                });
        }
        setLoading(false);
    }, [selectedGrade]);

    useEffect(() => {
        if (selectedSubject !== null) {
            setLoading(true);
            setError(null);
            fetchDocuments("ktp", selectedSubject)
                .then(data => {
                    setDocuments(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching documents:", err);
                    setError("Ошибка при получении документов. Попробуйте позже.");
                    setLoading(false);
                });
        }
    }, [selectedSubject]);

    const handleGradeSelect = (grade) => {
        setSelectedGrade(grade);
        setSelectedSubject(null);
        setDocuments([]);
        setShowDocument(false);
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className={styles.container}>
                <Link to="/" className={styles.backButton}>← Назад</Link>
                <h1 className={styles.title}>КТП</h1>
                <p className={styles.errorText}>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link to="/" className={styles.backButton}>← Назад</Link>
            <h1 className={styles.title}>КТП</h1>

            {/* Grade Selection */}
            <div className={styles.dropdownContainer}>
                <select
                    className={styles.dropdown}
                    value={selectedGrade ?? ""}
                    onChange={(e) => handleGradeSelect(Number(e.target.value))}
                >
                    <option value="" disabled>Выберите класс</option>
                    {Array.from({ length: 5 }, (_, index) => (
                        <option key={index} value={index}>
                            {index} Класс
                        </option>
                    ))}
                </select>
            </div>


            {/* Subject Selection */}
            {selectedGrade !== null && subjects.length === 0 && (
                <p className={styles.noSubjects}>Нет доступных предметов</p>
            )}

            {subjects.length > 0 && (
                <div className={styles.dropdownContainer}>
                    <select
                        className={styles.dropdown}
                        value={selectedSubject ?? ""}
                        onChange={(e) => {
                            const subjectId = e.target.value;
                            setSelectedSubject(subjectId);
                            setShowDocument(false);
                            setSelectedDocument(null);
                        }}
                    >
                        <option value="" disabled>Выберите предмет</option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}


            {/* Document List */}
            {selectedSubject && documents.length > 0 && (<>
                <div className={styles.columnsContainer}>
                    {documents.map(document => (
                        <div key={document.id} className={styles.column}>
                            <div
                                className={styles.preview}
                                style={{ backgroundImage: `url(${pdfIcon})` }}
                                onClick={() => {
                                    setSelectedDocument(document);
                                    setShowDocument(true);
                                }}
                            />
                            <p className={styles.documentName}>{document.name}</p>
                        </div>
                    ))}
                </div>
            </>
            )}

            {selectedSubject && documents.length === 0 && (
                <p className={styles.noDocuments}>Нет доступных документов</p>
            )}

            {/* Modal */}
            {showDocument && selectedDocument && (
                <div className={styles.modalBackdrop} onClick={() => setShowDocument(false)}>

                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PDFViewer pdfUrl={selectedDocument.file} initialPage={1} onClose={() => setShowDocument(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ktp;
