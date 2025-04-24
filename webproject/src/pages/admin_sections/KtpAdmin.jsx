import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchSubjects, fetchDocuments, createSubject, deleteSubject, updateSubject, createDocument, deleteDocument, updateDocument } from "../../utils/apiService"; // Ensure these are created
import styles from './KtpAdmin.module.css';
import Loader from "../Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PDFViewer from "../../components/PDFViewer";
import { set } from "react-hook-form";
import Superside from "../admin_components/Superside";

// createSubject, updateSubject, deleteSubject, createDocument, updateDocument, deleteDocument

const grades = [0, 1, 2, 3, 4];

const KtpAdmin = () => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [subjectFormData, setSubjectFormData] = useState({ name: "", description: "", grade: -1 });
    const [createSubjectModalOpen, setCreateSubjectModalOpen] = useState(false);
    const [editSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
    const [editSubjectId, setEditSubjectId] = useState(null);
    const [documentFormData, setDocumentFormData] = useState({ name: "", file: null, subject: null, document_type: "ktp", language: "" });
    const [createDocumentModalOpen, setCreateDocumentModalOpen] = useState(false);
    const [editDocumentModalOpen, setEditDocumentModalOpen] = useState(false);
    const [editDocumentId, setEditDocumentId] = useState(null);
    const [areYouSure, setAreYouSure] = useState({ show: false, type: "" });
    const [deleteSubjectId, setDeleteSubjectId] = useState(null);
    const [deleteDocumentId, setDeleteDocumentId] = useState(null);
    const [openPDF, setOpenPDF] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("kz");
    const [showMode, setShowMode] = useState(null)
    const [replaceFile, setReplaceFile] = useState(false);



    const navigate = useNavigate();
    const location = useLocation();
    const currentDocument = documents.find(doc => doc.id === editDocumentId);



    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedGrade !== null) params.set('grade', selectedGrade);
        if (selectedSubject !== null) params.set('subject', selectedSubject);
        if (selectedLanguage) params.set('lang', selectedLanguage);
        navigate(`?${params.toString()}`, { replace: true });
    }, [selectedGrade, selectedSubject, selectedLanguage]);

    useEffect(() => {
        if (selectedGrade !== null) {
            setLoading(true);
            fetchSubjects(selectedGrade)
                .then(data => setSubjects(data))
                .catch(err => setError(err.message))
                .finally(() => {
                    setLoading(false)
                });
        }
    }, [selectedGrade]);

    useEffect(() => {
        if (selectedSubject !== null) {
            setLoading(true);
            fetchDocuments("ktp", selectedSubject, selectedLanguage)
                .then(data => setDocuments(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [selectedSubject, selectedLanguage]);


    const refreshDocuments = () => {
        if (selectedSubject !== null) {
            setLoading(true);
            fetchDocuments("ktp", selectedSubject, selectedLanguage)
                .then(data => {
                    setDocuments(data)
                    notifySuccess("Документы обновлены успешно");
                })
                .catch(err => {
                    setError(err.message)
                    notifyError("Ошибка при обновлении документов: " + err.message);
                })
                .finally(() => setLoading(false));
        }
    }

    const refreshSubjects = () => {
        if (selectedGrade !== null) {
            setLoading(true);
            fetchSubjects(selectedGrade)
                .then(data => {
                    setSubjects(data)
                    notifySuccess("Предметы обновлены успешно");
                })
                .catch(err => {
                    setError(err.message)
                    notifyError("Ошибка при обновлении предметов: " + err.message);
                })
                .finally(() => setLoading(false));
        }
    }


    const handleGradeChange = (e) => {
        const grade = parseInt(e.target.value);
        setSelectedGrade(grade);
        setOpenPDF(false)
        setSelectedSubject(null);
        setDocuments([]);
    };

    const handleLanguageChange = (e) => {
        const language = e.target.value;
        setSelectedLanguage(language);
    }

    const handleAddSubjectClick = () => {
        setCreateSubjectModalOpen(true);
    }

    const handleEditSubjectClick = (subject) => {
        setEditSubjectId(subject.id);
        setSubjectFormData(subject);
        setEditSubjectModalOpen(true);
    }



    const handleLanguageSelectForm = (e) => {
        setDocumentFormData({ ...documentFormData, language: e.target.value });
    }

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        setShowMode("documents")
    };

    const handleSubjectDelete = (subjectId) => {
        setDeleteSubjectId(subjectId);
        setAreYouSure({ show: true, type: "subject" });

    }

    const handleConfirmDelete = () => {
        if (areYouSure.type === "subject" && deleteSubjectId !== null) {
            deleteSubject(deleteSubjectId)
                .then(() => {
                    setSubjects(subjects.filter(subject => subject.id !== deleteSubjectId));
                    setDeleteSubjectId(null);
                    setSelectedSubject(null);
                    setDocuments([]);
                    setAreYouSure({ show: false, type: "" });
                    notifySuccess("Предмет удален успешно");
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Ошибка при удалении документа: " + err.message);
                });
        }
        if (areYouSure.type === "document" && deleteDocumentId !== null) {
            deleteDocument(deleteDocumentId)
                .then(() => {
                    setDocuments(documents.filter(document => document.id !== deleteDocumentId));
                    setDeleteDocumentId(null);
                    setAreYouSure({ show: false, type: "" });
                    notifySuccess("Документ удален успешно");
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Ошибка при удалении документа: " + err.message);
                });
        }
    }

    const handleCancelDelete = () => {
        setDeleteSubjectId(null);
        setDeleteDocumentId(null);
        setAreYouSure({ show: false, type: "" });

    }


    const notifySuccess = (message) => {
        toast.success(message, {
            position: "top-right", // Position of the toast
            autoClose: 3000, // Toast auto-dismiss time (in ms)
            hideProgressBar: true, // Hide progress bar (optional)
            closeOnClick: true, // Close on click
            pauseOnHover: true, // Pause on hover
        });
    };

    const notifyError = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    };


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const grade = params.get('grade');
        const subject = params.get('subject')
        const lang = params.get('lang')

        if (grade) {
            setSelectedGrade(parseInt(grade));
            setShowMode("subjects")
        }

        if (subject) {
            setSelectedSubject(parseInt(subject))
            setShowMode("documents")
        }

        if (lang) {
            if (lang === "kz" || lang === "ru") {
                setSelectedLanguage(lang)
            }
        }



    }, [location.search]);


    const handleEditDocumentSubmit = (e) => {
        setReplaceFile(false)
        e.preventDefault();

        // Create a copy of documentFormData
        let updatedDocumentData = { ...documentFormData };

        // Now proceed with updating the document (with or without the file)
        setLoading(true);
        updateDocument(editDocumentId, updatedDocumentData)
            .then(() => {
                setEditDocumentModalOpen(false);
                setDocumentFormData({ name: "", file: null, subject: null, document_type: "ktp", language: "" });
                setEditDocumentId(null);
                notifySuccess("Документ обновлен успешно");
                setTimeout(() => {
                    refreshDocuments()
                }, 1000);
            })
            .catch(err => {
                notifyError("Ошибка при обновлений документа: " + err);
                setLoading(false);
            });
        setLoading(false);
    };


    return (
        <>

            {loading ? (
                <Loader />
            ) : (

                <div className="spdash">
                    <Superside />
                    <div className={styles.container}>

                        <h1 className={styles.title}>Админ-панель КТП</h1>

                        {/* Grade Selection */}
                        <div className={styles.dropdownContainer}>
                            <select value={selectedGrade || ""} onChange={handleGradeChange} className={styles.dropdown}>
                                <option value="" disabled>Выберите класс</option>
                                {grades.map(grade => (
                                    <option key={grade} value={grade}>{grade} Класс</option>
                                ))}
                            </select>
                        </div>

                        {/* Language Selection */}


                        {/* Subjects Management */}
                        {showMode === "subjects" && (
                            <div>
                                <h2>Предметы {selectedGrade} класса</h2>
                                <button className={styles.simpleButton} onClick={refreshSubjects}>Обновить</button>
                                <button className={styles.simpleButton} onClick={handleAddSubjectClick}>+ Добавить предмет</button>
                                {subjects.map(subject => (
                                    <div key={subject.id} className={styles.subjectRow}>
                                        <span>{subject.name}</span>
                                        <button onClick={() =>
                                            handleSubjectSelect(subject.id)}>Управление документами</button>
                                        <button onClick={() => handleEditSubjectClick(subject)}>Редактировать</button>
                                        <button onClick={() => {
                                            handleSubjectDelete(subject.id);
                                        }}>Удалить</button>
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* Documents Management */}
                        {showMode === "documents" && (
                            <div>
                                <div>
                                    <div className={styles.dropdownContainer}>
                                        <select value={selectedLanguage || ""} onChange={handleLanguageChange} className={styles.dropdown}>
                                            <option value="" disabled>Выберите язык</option>
                                            <option value="kz">Казахский</option>
                                            <option value="ru">Русский</option>
                                        </select>
                                    </div>
                                </div>
                                <h2>Документы {selectedSubject}</h2>
                                <button className={styles.simpleButton} onClick={() => {
                                    setShowMode("subjects")
                                }}>Назад</button>
                                <button onClick={() => {
                                    refreshDocuments();
                                }} className={styles.simpleButton}>Обновить</button>
                                <button className={styles.simpleButton} onClick={() => {
                                    setCreateDocumentModalOpen(true);
                                }}>+ Добавить документ</button>

                                {selectedLanguage ? (
                                    documents.length > 0 ? (
                                        documents.map(document => (
                                            <div key={document.id} className={styles.documentRow}>
                                                <span>{document.name} <br /> Язык: <strong>{document.language === "ru" ? "Русский" : document.language === "kz" ? "Казахский" : "Не уточнен"}</strong></span>
                                                <button onClick={() => {
                                                    setShowMode("none")
                                                    setOpenPDF(document.file)
                                                }}>Просмотреть</button>

                                                <button onClick={() => {
                                                    setEditDocumentId(document.id);
                                                    setEditDocumentModalOpen(true);
                                                    setDocumentFormData({ ...document, file: null });
                                                }}>Редактировать</button>
                                                <button onClick={() => {
                                                    console.log("Delete document", document.id)
                                                    setDeleteDocumentId(document.id);
                                                    setAreYouSure({ show: true, type: "document" });
                                                }}>Удалить</button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className={styles.noDocuments}>Нет доступных документов</p>
                                    )

                                ) :
                                    (
                                        <p className={styles.noDocuments}>Выберите язык</p>
                                    )
                                }

                            </div>
                        )}

                        {createSubjectModalOpen && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <h2>Добавить предмет</h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        subjectFormData.grade = selectedGrade;
                                        console.log("Create subject", subjectFormData);
                                        createSubject(subjectFormData)
                                            .then(() => {
                                                setSubjects([...subjects, subjectFormData]);
                                                setCreateSubjectModalOpen(false);
                                            })
                                            .catch(err => console.error(err));
                                        // Reset form data
                                        setSubjectFormData({ name: "", description: "", grade: -1 });
                                        // Close modal
                                        setCreateSubjectModalOpen(false);
                                    }}>
                                        <input
                                            type="text"
                                            placeholder="Название предмета"
                                            value={subjectFormData.name}
                                            onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
                                            className={styles.inputField}
                                        />
                                        <textarea
                                            placeholder="Описание (необязательно)"
                                            value={subjectFormData.description}
                                            onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })}
                                            className={styles.textareaField}
                                        />
                                        <button type="submit" className={styles.submitButton} onClick={() => {
                                            createSubject(subjectFormData)
                                                .then(() => {
                                                    setSubjects([...subjects, subjectFormData]);
                                                    setCreateSubjectModalOpen(false);
                                                    setSubjectFormData({ name: "", description: "", grade: -1 });
                                                    notifySuccess("Предмет создан успешно");
                                                })
                                                .catch(err => notifyError("Ошибка при создании предмета: " + err));
                                        }}>Создать</button>
                                        <button type="button" className={styles.cancelSubjectButton} onClick={() => setCreateSubjectModalOpen(false)}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        )}



                        {editSubjectModalOpen && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <h2>Редактировать предмет</h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        console.log("Edit subject", subjectFormData);
                                    }}>
                                        <input type="text" placeholder="Название предмета" value={subjectFormData.name} className={styles.inputField} onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })} />
                                        <textarea placeholder="Описание предмета(необязательно)" value={subjectFormData.description} className={styles.textareaField} onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })}></textarea>
                                        <button type="submit" className={styles.submitButton} onClick={() => {
                                            updateSubject(editSubjectId, subjectFormData)
                                                .then(() => {
                                                    setSubjects(subjects.map(subject => subject.id === editSubjectId ? { ...subject, ...subjectFormData } : subject));
                                                    setEditSubjectModalOpen(false);
                                                    setSubjectFormData({ name: "", description: "", grade: -1 });
                                                    setEditSubjectId(null);
                                                    notifySuccess("Предмет обновлен успешно");
                                                }
                                                )
                                                .catch(err => notifyError("Ошибка при обновлений предмета: " + err)
                                                );
                                        }}>Обновить</button>
                                        <button type="button" className={styles.cancelSubjectButton} onClick={() => {
                                            setEditSubjectModalOpen(false)
                                            setSubjectFormData({ name: "", description: "", grade: -1 })
                                        }}>Отменить</button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {createDocumentModalOpen && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <h2>Создать документ</h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        console.log("Create document", documentFormData);
                                    }}>
                                        <input
                                            type="text"
                                            placeholder="Название документа(Тема)"
                                            value={documentFormData.name}
                                            onChange={(e) => setDocumentFormData({ ...documentFormData, name: e.target.value })}
                                            className={styles.inputField}
                                        />
                                        <input type="file" onChange={(e) => setDocumentFormData({ ...documentFormData, file: e.target.files[0] })} />
                                        <select value={selectedLanguage || ""} onChange={handleLanguageSelectForm} className={styles.dropdown}>
                                            <option value="" disabled>Выберите язык</option>
                                            <option value="kz">Казахский</option>
                                            <option value="ru">Русский</option>
                                        </select>
                                        <button type="submit" className={styles.submitButton} onClick={() => {
                                            documentFormData.subject = selectedSubject;
                                            setCreateDocumentModalOpen(false);
                                            setLoading(true);
                                            createDocument(documentFormData)
                                                .then(() => {
                                                    setDocumentFormData({ name: "", file: null, subject: null, document_type: "ktp" });
                                                    notifySuccess("Документ создан успешно");
                                                    fetchDocuments("ktp", selectedSubject)
                                                        .then(data => setDocuments(data))
                                                        .catch(err => setError(err.message))
                                                        .finally(() => setLoading(false));
                                                    setLoading(false);
                                                })
                                                .catch(err => {
                                                    console.error(err)
                                                    notifyError("Ошибка при созданий документа: " + err)
                                                    setLoading(false);

                                                });


                                        }}>Добавить</button>
                                        <button type="button" className={styles.cancelSubjectButton} onClick={() => {
                                            setDocumentFormData({ name: "", file: null, subject: null, document_type: "ktp", language: "" });
                                            setCreateDocumentModalOpen(false)
                                        }}>Отменить</button>
                                    </form>
                                </div>
                            </div>
                        )}


                        {editDocumentModalOpen && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <h2>Редактировать документ</h2>
                                    <form onSubmit={handleEditDocumentSubmit}>

                                        <input type="text" required className={styles.inputField} placeholder="Название документа(Тема)" value={documentFormData.name} onChange={(e) => setDocumentFormData({ ...documentFormData, name: e.target.value })} />
                                        {currentDocument && currentDocument.file && (
                                            <button type="button" className={styles.simpleButton}>
                                                <a
                                                    style={{ textDecoration: "none", color: "white" }}
                                                    href={currentDocument.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Открыть текущий файл
                                                </a>
                                            </button>
                                        )}

                                        <button type="button" onClick={() => setReplaceFile(!replaceFile)} className={styles.simpleButton}>{replaceFile ? "Не заменять файл" : "Заменить файл"}</button>
                                        {replaceFile && (
                                            <input type="file" className={styles.inputField} onChange={(e) => setDocumentFormData({ ...documentFormData, file: e.target.files[0] })} />
                                        )}
                                        <br />
                                        <select value={documentFormData.language || ""} onChange={handleLanguageSelectForm} className={styles.dropdown}>
                                            <option value="" disabled>Выберите язык</option>
                                            <option value="kz">Казахский</option>
                                            <option value="ru">Русский</option>
                                        </select>
                                        <button type="submit" className={styles.submitButton} onClick={() => {
                                        }}>Обновить</button>
                                        <button type="button" className={styles.cancelSubjectButton} onClick={() => {
                                            setEditDocumentModalOpen(false);
                                            setReplaceFile(false)
                                            setDocumentFormData({ name: "", file: null, subject: null, document_type: "ktp", language: "" });
                                        }}>Отменить</button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {areYouSure.show && (
                            <div className={styles.confirmationModal}>
                                <div className={styles.modalContent}>
                                    <h2>Вы точно хотите удалить?</h2>
                                    <button className={styles.confirmButton} onClick={handleConfirmDelete}>Да</button>
                                    <button className={styles.cancelButton} onClick={handleCancelDelete}>Нет</button>
                                </div>
                            </div>
                        )}

                        {openPDF && (
                            openPDF !== null ? (
                                <div className={styles.pdfModal}>
                                    <PDFViewer pdfUrl={openPDF} onClose={() => {
                                        setOpenPDF(null)
                                        setShowMode("documents")
                                    }} />
                                </div>
                            ) :
                                (<p>nety documenta</p>)
                        )}




                        <ToastContainer />


                    </div >
                </div>
            )}

        </>
    );
};

export default KtpAdmin;
