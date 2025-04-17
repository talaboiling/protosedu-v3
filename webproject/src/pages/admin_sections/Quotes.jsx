import React, { useState, useEffect } from "react";
import {
    fetchDailyMessages,
    fetchMotivationalPhrases,
    randomizeDailyMessage,
    setPhraseForDailyMessage,
} from "../../utils/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from './DailyMessage.module.css';
import Superside from "../admin_components/Superside";
import Loader from "../Loader";

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
                <div className={styles.container}>
                    <h1 className={styles.title}>Ежедневные сообщения и мотивационные фразы</h1>

                    <div>
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
                            Обновить случайные сообщения
                        </button>
                    </div>

                    <section className={styles.section}>
                        <h2 className={styles.textMessage}>Сообщения на сегодня</h2>
                        {["ru", "kz", "en"].map((lang) => {
                            const message = dailyMessages.find((msg) => msg.language === lang);
                            return (
                                <div key={lang}>
                                    <p className={styles.languageName}>
                                        {lang === "ru" ? "Русский" : lang === "kz" ? "Казахский" : "Английский"}
                                    </p>
                                    {message ? (
                                        <h3 className={styles.textMessage}>{message.message}</h3>
                                    ) : (
                                        <h3 className={styles.textMessage}>Нет сообщения на сегодня</h3>
                                    )}
                                </div>
                            );
                        })}
                    </section>

                    <section className={styles.section}>
                        <h2>Мотивационные фразы</h2>

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
                                                <input
                                                    className={styles.checkbox}
                                                    type="checkbox"
                                                    checked={phrase.is_active}
                                                    readOnly
                                                />
                                                <button onClick={() => {
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
                                                    Установить как ежедневное
                                                </button>
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
