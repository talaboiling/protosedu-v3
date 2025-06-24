import React from 'react';
import { Bot } from 'lucide-react';
import styles from './Tutor.module.css';

const TutorLoader = () => {
    return (
        <div className={styles.loadingWrapper}>
            <div className={styles.loadingContent}>
                <div className={`${styles.avatar} ${styles.assistant}`}>
                    <Bot size={16} />
                </div>
                <div className={styles.loadingBubble}>
                    <div className={styles.loadingDots}>
                        <div className={styles.loadingDot}></div>
                        <div className={styles.loadingDot}></div>
                        <div className={styles.loadingDot}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorLoader;