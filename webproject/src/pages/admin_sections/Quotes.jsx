import React, { useState, useEffect } from "react";
import { fetchDailyMessages, fetchMotivationalPhrases, randomizeDailyMessage, setPhraseForDailyMessage } from "../../utils/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from './DailyMessage.module.css'; // Import the modular CSS
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

    // Fetch daily messages and motivational phrases on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const dailyMessagesData = await fetchDailyMessages();
                setDailyMessages(dailyMessagesData);

                const motivationalPhrasesData = await fetchMotivationalPhrases();
                setMotivationalPhrases(motivationalPhrasesData);
            } catch (err) {
                console.error(err);
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Group motivational phrases by language
    const groupedPhrases = motivationalPhrases.reduce((acc, phrase) => {
        if (!acc[phrase.language]) {
            acc[phrase.language] = [];
        }
        acc[phrase.language].push(phrase);
        return acc;
    }, {});

    // Filter daily messages for the selected language
    const dailyMessageForLanguage = dailyMessages.find(
        (msg) => msg.language === selectedLanguage
    );

    const handleToggleCollapse = (language) => {
        setCollapsed((prevState) => ({
            ...prevState,
            [language]: !prevState[language],
        }));
    };

    if (loading) {
        return <Loader></Loader>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className="spdash">
                <Superside />
                <div className={styles.container}>
                    <h1 className={styles.title}>Daily Messages and Motivational Phrases</h1>

                    <div>
                        <button className={styles.button} onClick={() => {
                            randomizeDailyMessage()
                                .then(() => {
                                    toast.success("Daily messages randomized successfully!");
                                    toast.info("Fetching new daily messages...", { autoClose: 2000 });
                                    setTimeout(() => {
                                        fetchDailyMessages().then((data) => setDailyMessages(data));
                                    }, 2000);
                                })
                                .catch((err) => {
                                    toast.error("Error randomizing daily messages");
                                    console.error(err);
                                });
                        }}>
                            Randomize daily messages
                        </button>
                    </div>

                    {/* Daily Messages Section */}
                    <section className={styles.section}>
                        <h2 className={styles.textMessage}>Today's Daily Messages</h2>
                        {["ru", "kz", "en"].map((lang) => {
                            const message = dailyMessages.find((msg) => msg.language === lang);

                            return (
                                <div key={lang}>
                                    <p className={styles.languageName}>{lang === "ru" ? "Russian" : lang === "kz" ? "Kazakh" : "English"}</p>
                                    {message ? (
                                        <h3 className={styles.textMessage}>{message.message}</h3>
                                    ) : (
                                        <h3 className={styles.textMessage}>No message for today</h3>
                                    )}
                                </div>
                            );
                        })}
                    </section>

                    <section className={styles.section}>
                        <h2>Motivational Phrases</h2>

                        {["ru", "kz", "en"].map((lang) => (
                            <div key={lang}>
                                <button
                                    className={styles.collapsibleButton}
                                    onClick={() => handleToggleCollapse(lang)}
                                >
                                    {collapsed[lang] ? "Expand" : "Collapse"} {lang === "ru" ? "Russian" : lang === "kz" ? "Kazakh" : "English"}
                                </button>

                                {/* Show phrases for the selected language if not collapsed */}
                                {!collapsed[lang] && (
                                    <div className={styles.collapsibleContent}>
                                        {groupedPhrases[lang]?.map((phrase) => (
                                            <div key={phrase.id} className={styles.phraseItem}>
                                                <span>{phrase.text}</span>
                                                <input
                                                    className={styles.checkbox}
                                                    type="checkbox"
                                                    checked={phrase.is_active}
                                                    name="is_active"
                                                    id=""
                                                />
                                                <button onClick={() => {
                                                    setPhraseForDailyMessage(phrase.id)
                                                        .then(() => {
                                                            toast.success("Phrase set for daily message successfully!");
                                                            toast.info("Fetching new daily messages...", { autoClose: 2000 });
                                                            setTimeout(() => {
                                                                fetchDailyMessages().then((data) => setDailyMessages(data));
                                                            }, 2000);
                                                        })
                                                        .catch((err) => {
                                                            toast.error("Error setting phrase for daily message");
                                                            console.error(err);
                                                        });
                                                }}>Set for daily</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>

                    <ToastContainer />
                </div >
            </div>
        </>
    );
};



export default DailyMessage;
