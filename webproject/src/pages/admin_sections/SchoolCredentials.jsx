import React, { useEffect, useState } from "react";
import {
    listSchoolsCredentials,
    downloadSchoolCredential,
    deleteSchoolCredential,
} from "../../utils/apiService";
import Superside from "../admin_components/Superside";
import { Download } from "lucide-react";
import styles from "./SchoolCredentials.module.css";

const formatFilename = (name) => {
    const stripped = name.replace(/^credentials_/, "").replace(/\.xlsx$/, "");
    return stripped.length > 40 ? stripped.slice(0, 37) + "…" : stripped;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

const SchoolCredentials = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await listSchoolsCredentials();
                const sorted = [...(response.files || [])].sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                setFiles(sorted);
            } catch (err) {
                console.error("Не удалось загрузить список файлов:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div className={`spdash ${styles.container}`}>
            <Superside />

            <div className={styles.content}>
                <h1 className={styles.title}>🎓 Файлы с учетными данными платформ</h1>

                {loading ? (
                    <div className={styles.loading}>Загрузка...</div>
                ) : files.length === 0 ? (
                    <div className={styles.empty}>Файлы не найдены.</div>
                ) : (
                    <div className={styles.grid}>
                        {files.map((file) => (
                            <div key={file.name} className={styles.card}>
                                <div>
                                    <h3 className={styles.filename}>{formatFilename(file.name)}</h3>
                                    <div className={styles.details}>
                                        📅 {formatDate(file.created_at)}
                                        <br />
                                        📦 {file.size}
                                    </div>
                                </div>

                                <button
                                    className={styles.button}
                                    onClick={() => downloadSchoolCredential(file.name)}
                                >
                                    <Download size={16} />
                                    Скачать
                                </button>

                                <button
                                    className={`${styles.deleteButton} bg-red-600 hover:bg-red-700`}
                                    onClick={async () => {
                                        if (window.confirm("Вы уверены, что хотите удалить этот файл?")) {
                                            try {
                                                await deleteSchoolCredential(file.name);
                                                setFiles((prev) =>
                                                    prev.filter((f) => f.name !== file.name)
                                                );
                                            } catch (err) {
                                                alert("Ошибка при удалении файла: " + err.message);
                                            }
                                        }
                                    }}
                                >
                                    🗑 Удалить
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolCredentials;
