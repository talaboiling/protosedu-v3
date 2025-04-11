import React, { useEffect, useState } from "react";
import { fetchSubjects, fetchDocuments, createSubject, deleteSubject, updateSubject, createDocument, deleteDocument, updateDocument } from "../../utils/apiService"; // Ensure these are created
import styles from './KtpAdmin.module.css';
import Loader from "../Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PDFViewer from "../../components/PDFViewer";
import { set } from "react-hook-form";

// createSubject, updateSubject, deleteSubject, createDocument, updateDocument, deleteDocument

const grades = [0, 1, 2, 3, 4];

const KtpAdmin = () => {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showSubjects, setShowSubjects] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [showDocuments, setShowDocuments] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [subjectFormData, setSubjectFormData] = useState({ name: "", description: "", grade: -1 });
    const [createSubjectModalOpen, setCreateSubjectModalOpen] = useState(false);
    const [editSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
    const [editSubjectId, setEditSubjectId] = useState(null);
    const [documentFormData, setDocumentFormData] = useState({ name: "", file: null, subject: null, document_type: "ktp" });
    const [createDocumentModalOpen, setCreateDocumentModalOpen] = useState(false);
    const [editDocumentModalOpen, setEditDocumentModalOpen] = useState(false);
    const [editDocumentId, setEditDocumentId] = useState(null);
    const [areYouSure, setAreYouSure] = useState({ show: false, type: "" });
    const [deleteSubjectId, setDeleteSubjectId] = useState(null);
    const [deleteDocumentId, setDeleteDocumentId] = useState(null);
    const [openPDF, setOpenPDF] = useState(false);

    // Fetch subjects when grade changes
    useEffect(() => {
        if (selectedGrade !== null) {
            setLoading(true);
            fetchSubjects(selectedGrade)
                .then(data => setSubjects(data))
                .catch(err => setError(err.message))
                .finally(() => {
                    setShowSubjects(true);
                    setLoading(false)
                });
        }
    }, [selectedGrade]);

    // Fetch documents when subject changes
    useEffect(() => {
        if (selectedSubject !== null) {
            setLoading(true);
            fetchDocuments("ktp", selectedSubject)
                .then(data => setDocuments(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [selectedSubject]);


    const handleGradeChange = (e) => {
        const grade = parseInt(e.target.value);
        setSelectedGrade(grade);
        setSelectedSubject(null);
        setDocuments([]);
    };

    const handleSubjectSelect = (subjectId) => {
        setSelectedSubject(subjectId);
        setShowSubjects(false);
        setShowDocuments(true);
    };

    const handleSubjectDelete = (subjectId) => {
        setDeleteSubjectId(subjectId);
        setAreYouSure({ show: true, type: "subject" });

    }

    const handleConfirmDelete = () => {
        console.log("Confirm delete", areYouSure.type, areYouSure.show, deleteSubjectId);
        if (areYouSure.type === "subject" && deleteSubjectId !== null) {
            deleteSubject(deleteSubjectId)
                .then(() => {
                    setSubjects(subjects.filter(subject => subject.id !== deleteSubjectId));
                    setDeleteSubjectId(null);
                    setSelectedSubject(null);
                    setDocuments([]);
                    setShowSubjects(true);
                    setAreYouSure({ show: false, type: "" });
                    notifySuccess("Subject deleted successfully");
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Error deleting subject: " + err.message);
                });
        }
        if (areYouSure.type === "document" && deleteDocumentId !== null) {
            deleteDocument(deleteDocumentId)
                .then(() => {
                    setDocuments(documents.filter(document => document.id !== deleteDocumentId));
                    setDeleteDocumentId(null);
                    setAreYouSure({ show: false, type: "" });
                    notifySuccess("Document deleted successfully");
                })
                .catch(err => {
                    console.error(err);
                    notifyError("Error deleting document: " + err.message);
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

    return (
        <>

            {loading ? (
                <Loader />
            ) : (

                <div className={styles.container}>
                    <h1 className={styles.title}>KTP Admin Panel</h1>

                    {/* Grade Selection */}
                    <div className={styles.dropdownContainer}>
                        <select value={selectedGrade || ""} onChange={handleGradeChange} className={styles.dropdown}>
                            <option value="" disabled>Select Grade</option>
                            {grades.map(grade => (
                                <option key={grade} value={grade}>{grade} Grade</option>
                            ))}
                        </select>
                    </div>

                    {/* Subjects Management */}
                    {selectedGrade !== null && showSubjects && (
                        <div>
                            <h2>Subjects for {selectedGrade} grade</h2>
                            <button className={styles.simpleButton} onClick={() => {
                                console.log("Open add subject modal")
                                setCreateSubjectModalOpen(true);
                            }}>+ Add Subject</button>
                            {subjects.map(subject => (
                                <div key={subject.id} className={styles.subjectRow}>
                                    <span>{subject.name}</span>
                                    <button onClick={() =>
                                        handleSubjectSelect(subject.id)}>Manage Documents</button>
                                    <button onClick={() => {
                                        console.log("Edit subject", subject.id)
                                        setEditSubjectId(subject.id);
                                        setSubjectFormData(subject);
                                        setEditSubjectModalOpen(true);
                                    }}>Edit</button>
                                    <button onClick={() => {
                                        console.log("Delete subject", subject.id)
                                        subjectFormData.id = subject.id;
                                        handleSubjectDelete(subject.id);
                                    }}>Delete</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Documents Management */}
                    {selectedSubject && showDocuments && (
                        <div>
                            <h2>Documents</h2>
                            <button className={styles.simpleButton} onClick={() => {
                                console.log("Back to subjects");
                                setShowDocuments(false);
                                setShowSubjects(true);
                            }}>Back</button>
                            <button className={styles.simpleButton} onClick={() => {
                                console.log("Open add document modal")
                                setCreateDocumentModalOpen(true);
                            }}>+ Add Document</button>

                            {/* Check if there are documents */}
                            {documents.length > 0 ? (
                                documents.map(document => (
                                    <div key={document.id} className={styles.documentRow}>
                                        <span>{document.name}</span>
                                        <button onClick={() => {
                                            setShowDocuments(false);
                                            setOpenPDF(document.file)
                                        }}>Open</button>

                                        <button onClick={() => {
                                            console.log("Edit document", document.id)
                                            setEditDocumentId(document.id);
                                            setEditDocumentModalOpen(true);
                                            setDocumentFormData(document);
                                        }}>Edit</button>
                                        <button onClick={() => {
                                            console.log("Delete document", document.id)
                                            setDeleteDocumentId(document.id);
                                            setAreYouSure({ show: true, type: "document" });
                                        }}>Delete</button>
                                    </div>
                                ))
                            ) : (
                                // If no documents, show this message
                                <p className={styles.noDocuments}>Нет доступных документов</p>
                            )}
                        </div>
                    )}

                    {createSubjectModalOpen && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modalContent}>
                                <h2>Create Subject</h2>
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
                                        placeholder="Subject Name"
                                        value={subjectFormData.name}
                                        onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
                                        className={styles.inputField}
                                    />
                                    <textarea
                                        placeholder="Description"
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
                                                notifySuccess("Subject created successfully");
                                            })
                                            .catch(err => notifyError("Error creating subject: " + err));
                                    }}>Create</button>
                                    <button type="button" className={styles.cancelSubjectButton} onClick={() => setCreateSubjectModalOpen(false)}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}



                    {editSubjectModalOpen && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modalContent}>
                                <h2>Edit Subject</h2>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    console.log("Edit subject", subjectFormData);
                                }}>
                                    <input type="text" placeholder="Subject Name" value={subjectFormData.name} className={styles.inputField} onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })} />
                                    <textarea placeholder="Description" value={subjectFormData.description} className={styles.textareaField} onChange={(e) => setSubjectFormData({ ...subjectFormData, description: e.target.value })}></textarea>
                                    <button type="submit" className={styles.submitButton} onClick={() => {
                                        updateSubject(editSubjectId, subjectFormData)
                                            .then(() => {
                                                setSubjects(subjects.map(subject => subject.id === editSubjectId ? { ...subject, ...subjectFormData } : subject));
                                                setEditSubjectModalOpen(false);
                                                setSubjectFormData({ name: "", description: "", grade: -1 });
                                                setEditSubjectId(null);
                                                notifySuccess("Subject updated successfully");
                                            }
                                            )
                                            .catch(err => notifyError("Error updating subject: " + err)
                                            );
                                    }}>Update</button>
                                    <button type="button" className={styles.cancelSubjectButton} onClick={() => {
                                        setEditSubjectModalOpen(false)
                                        setSubjectFormData({ name: "", description: "", grade: -1 })
                                    }}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {createDocumentModalOpen && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modalContent}>
                                <h2>Create Document</h2>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    console.log("Create document", documentFormData);
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Document Name"
                                        value={documentFormData.name}
                                        onChange={(e) => setDocumentFormData({ ...documentFormData, name: e.target.value })}
                                        className={styles.inputField}
                                    />
                                    <input type="file" onChange={(e) => setDocumentFormData({ ...documentFormData, file: e.target.files[0] })} />
                                    <button type="submit" className={styles.submitButton} onClick={() => {
                                        documentFormData.subject = selectedSubject;
                                        setCreateDocumentModalOpen(false);
                                        setLoading(true);
                                        createDocument(documentFormData)
                                            .then(() => {
                                                setDocuments([...documents, documentFormData]);
                                                setDocumentFormData({ name: "", file: null, subject: null, document_type: "ktp" });
                                                notifySuccess("Document created successfully");
                                                setLoading(false);
                                            })
                                            .catch(err => {
                                                console.error(err)
                                                notifyError("Error creating document: " + err)
                                                setLoading(false);

                                            });
                                    }}>Create</button>
                                    <button type="button" className={styles.cancelSubjectButton} onClick={() => setCreateDocumentModalOpen(false)}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}


                    {editDocumentModalOpen && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modalContent}>
                                <h2>Edit Document</h2>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    console.log("Edit document", documentFormData);
                                }}>

                                    <input type="text" required className={styles.inputField} placeholder="Document Name" value={documentFormData.name} onChange={(e) => setDocumentFormData({ ...documentFormData, name: e.target.value })} />
                                    {documentFormData.file && (
                                        <span style={{ textAlign: "left" }}>
                                            Selected file:
                                            <a
                                                href={documentFormData.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Open in new tab
                                            </a>
                                        </span>)}
                                    <input type="file" required className={styles.inputField} onChange={(e) => setDocumentFormData({ ...documentFormData, file: e.target.files[0] })} />
                                    <button type="submit" className={styles.submitButton} onClick={() => {
                                        setLoading(true);
                                        updateDocument(editDocumentId, documentFormData)
                                            .then(() => {
                                                setDocuments(documents.map(document => document.id === editDocumentId ? { ...document, ...documentFormData } : document));
                                                setEditDocumentModalOpen(false);
                                                setDocumentFormData({ name: "", file: null, subject: null, document_type: "ktp" });
                                                setEditDocumentId(null);
                                                setShowSubjects(false)
                                                fetchDocuments("ktp", selectedSubject)
                                                    .then(data => setDocuments(data))
                                                setLoading(false);
                                                setShowDocuments(true);
                                                notifySuccess("Document updated successfully");
                                            }
                                            )
                                            .catch(err => {
                                                notifyError("Error updating document: " + err)
                                                setLoading(false);
                                            })
                                    }}>Update</button>
                                    <button type="button" className={styles.cancelSubjectButton} onClick={() => {
                                        setEditDocumentModalOpen(false);
                                        setDocumentFormData({ name: "", file: null, subject: null, document_type: "ktp" });
                                    }}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {areYouSure.show && (
                        <div className={styles.confirmationModal}>
                            <div className={styles.modalContent}>
                                <h2>Are you sure?</h2>
                                <button className={styles.confirmButton} onClick={handleConfirmDelete}>Yes</button>
                                <button className={styles.cancelButton} onClick={handleCancelDelete}>No</button>
                            </div>
                        </div>
                    )}

                    {openPDF && (
                        <div className={styles.pdfModal}>
                            <PDFViewer pdfUrl={openPDF} onClose={() => {
                                setOpenPDF(null)
                                setShowDocuments(true)
                            }} />
                        </div>
                    )}




                    <ToastContainer />


                </div >
            )}
        </>
    );
};

export default KtpAdmin;
