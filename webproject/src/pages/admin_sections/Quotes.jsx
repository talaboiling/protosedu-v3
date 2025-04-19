import React, { useState, useEffect } from "react";
import {
    fetchDailyMessages,
    fetchMotivationalPhrases,
    randomizeDailyMessage,
    setPhraseForDailyMessage,
    createMotivationalPhrase,
    deleteMotivationalPhrase,
    updateMotivationalPhraseStatus,
    deleteDailyMessage

} from "../../utils/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from './DailyMessage.module.css';
import Superside from "../admin_components/Superside";
import Loader from "../Loader";
import Modal from "../../helpers/Modal";

const DailyMessage = () => {
    const [dailyMessages, setDailyMessages] = useState([]);
    const [motivationalPhrases, setMotivationalPhrases] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("ru");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collapsed, setCollapsed] = useState({
        ru: false,
        kz: false,
        en: false,
    });
    const [motivationPhraseFormData, setMotivationPhraseFormData] = useState({
        text: "",
        language: "ru",
    });
    const [motPhraseCreateModalOpen, setMotPhraseCreateModalOpen] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const dailyMessagesData = await fetchDailyMessages();
                setDailyMessages(dailyMessagesData);

                const motivationalPhrasesData = await fetchMotivationalPhrases();
                setMotivationalPhrases(motivationalPhrasesData);
            } catch (err) {
                console.error(err);
                setError("Ошибка при получении данных");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const groupedPhrases = motivationalPhrases.reduce((acc, phrase) => {
        if (!acc[phrase.language]) {
            acc[phrase.language] = [];
        }
        acc[phrase.language].push(phrase);
        return acc;
    }, {});

    const handleToggleCollapse = (language) => {
        setCollapsed((prevState) => ({
            ...prevState,
            [language]: !prevState[language],
        }));
    };

    const handleDeletePhrase = async (id) => {
        try {
            await deleteMotivationalPhrase(id);
            setMotivationalPhrases((prev) =>
                prev.filter((phrase) => phrase.id !== id)
            );
            toast.success("Фраза успешно удалена");
        } catch (err) {
            console.error("Ошибка при удалении фразы", err);
            toast.error("Не удалось удалить фразу");
        }
    };

    const handleDeleteDailyMessage = async (id) => {
        try {
            await deleteDailyMessage(id);
            setDailyMessages((prev) =>
                prev.filter((message) => message.id !== id)
            );
            toast.success("Сообщение успешно удалено");
        } catch (err) {
            console.error("Ошибка при удалении сообщения", err);
            toast.error("Не удалось удалить сообщение");
        }
    };


    const handleUpdatePhraseStatus = async (id, isActive) => {
        try {
            await updateMotivationalPhraseStatus(id, isActive);
            setMotivationalPhrases((prev) =>
                prev.map((phrase) =>
                    phrase.id === id ? { ...phrase, is_active: isActive } : phrase
                )
            );
            toast.success("Статус фразы успешно обновлён");
        } catch (err) {
            console.error("Ошибка при обновлении статуса фразы", err);
            toast.error("Не удалось обновить статус фразы");
        }
    };

    const handleCreatePhrase = async (lang) => {
        try {
            const newPhrase = await createMotivationalPhrase(motivationPhraseFormData);
            setMotivationalPhrases((prev) => [...prev, newPhrase]);
            toast.success("Фраза успешно добавлена");
            setMotivationPhraseFormData({ text: "", language: "ru" });
            setMotPhraseCreateModalOpen(false);
        } catch (err) {
            console.error("Ошибка при добавлении фразы", err);
            toast.error("Не удалось добавить фразу");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMotivationPhraseFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className="spdash">
                <Superside />
                {motPhraseCreateModalOpen && (
                    <Modal onClose={() => setMotPhraseCreateModalOpen(false)}>
                        <h2>Создание новой мотивационной фразы</h2>
                        <input
                            type="text"
                            name="text"
                            value={motivationPhraseFormData.text}
                            onChange={handleInputChange}
                            placeholder="Введите текст фразы"
                        />
                        <select
                            name="language"
                            value={motivationPhraseFormData.language}
                            onChange={handleInputChange}
                        >
                            <option value="ru">Русский</option>
                            <option value="kz">Казахский</option>
                            <option value="en">Английский</option>
                        </select>
                        <button onClick={handleCreatePhrase}>Создать</button>
                        <button onClick={() => setMotPhraseCreateModalOpen(false)}>Закрыть</button>
                    </Modal>
                )}

                <div className={styles.container}>
                    <h1 className={styles.title}>Ежедневные сообщения и мотивационные фразы</h1>

                    <div>
                    </div>

                    <section className={styles.section}>
                        <h2 className={styles.title}>Сообщения на сегодня</h2>
                        <button className={styles.button} onClick={() => {
                            randomizeDailyMessage()
                                .then(() => {
                                    toast.success("Ежедневные сообщения успешно обновлены!");
                                    toast.info("Получение новых сообщений...", { autoClose: 2000 });
                                    setTimeout(() => {
                                        fetchDailyMessages().then((data) => setDailyMessages(data));
                                    }, 2000);
                                })
                                .catch((err) => {
                                    toast.error("Ошибка при обновлении ежедневных сообщений");
                                    console.error(err);
                                });
                        }}>
                            Обновить сообщения ( случайным образом )
                        </button>
                        {["ru", "kz", "en"].map((lang) => {
                            const message = dailyMessages.find((msg) => msg.language === lang);
                            return (
                                <div key={lang}>
                                    <p className={styles.languageName}>
                                        {lang === "ru" ? "Русский" : lang === "kz" ? "Казахский" : "Английский"}
                                    </p>
                                    {message ? (
                                        <>
                                            <h3 className={styles.textMessage}>{message.message}</h3>
                                            <button onClick={() => handleDeleteDailyMessage(message.id)} className={styles.deleteButton}>Удалить</button>
                                        </>
                                    ) : (
                                        <h3 className={styles.textMessage}>Нет сообщения на сегодня</h3>
                                    )}
                                </div>
                            );
                        })}
                    </section>

                    <section className={styles.section}>
                        <h2>Мотивационные фразы</h2>
                        <button className={styles.button} onClick={() => setMotPhraseCreateModalOpen(true)}>Добавить фразу</button>

                        {["ru", "kz", "en"].map((lang) => (
                            <div key={lang}>
                                <button
                                    className={styles.collapsibleButton}
                                    onClick={() => handleToggleCollapse(lang)}
                                >
                                    {collapsed[lang] ? "Развернуть" : "Свернуть"}{" "}
                                    {lang === "ru" ? "Русский" : lang === "kz" ? "Казахский" : "Английский"}
                                </button>

                                {!collapsed[lang] && (
                                    <div className={styles.collapsibleContent}>

                                        {groupedPhrases[lang]?.map((phrase) => (
                                            <div key={phrase.id} className={styles.phraseItem}>
                                                <span>{phrase.text}</span>
                                                <div>
                                                    <label>Активно?</label>
                                                    <input
                                                        onChange={(e) => handleUpdatePhraseStatus(phrase.id, e.target.checked)}
                                                        className={styles.checkbox}
                                                        type="checkbox"
                                                        checked={phrase.is_active}
                                                        readOnly
                                                    />
                                                </div>
                                                <button className={styles.button} onClick={() => {
                                                    setPhraseForDailyMessage(phrase.id)
                                                        .then(() => {
                                                            toast.success("Фраза успешно установлена как ежедневное сообщение!");
                                                            toast.info("Получение новых сообщений...", { autoClose: 2000 });
                                                            setTimeout(() => {
                                                                fetchDailyMessages().then((data) => setDailyMessages(data));
                                                            }, 2000);
                                                        })
                                                        .catch((err) => {
                                                            toast.error("Ошибка при установке фразы");
                                                            console.error(err);
                                                        });
                                                }}>
                                                    Сделать ежедневным
                                                </button>
                                                <button onClick={() => handleDeletePhrase(phrase.id)} className={styles.deleteButton}>Удалить фразу</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>

                    <ToastContainer />
                </div>
            </div>
        </>
    );
};

export default DailyMessage;
