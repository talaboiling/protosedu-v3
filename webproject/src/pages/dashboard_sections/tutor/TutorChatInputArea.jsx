import React from 'react';
import { Send } from "lucide-react";
import styles from './Tutor.module.css';


const TutorChatInput = ({
    inputMessage,
    setInputMessage,
    handleKeyPress,
    handleSendMessage,
    isLoading,
    activeChat,
    isDisabled,
}) => {
    return (
        <div className={styles.inputArea}>
            <div className={styles.inputWrapper}>
                <div className={styles.inputContainer}>
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type yor question here..."
                        className={styles.textInput}
                        rows={1}
                        disabled={isLoading || !activeChat || isDisabled}
                    />
                </div>
                <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || !activeChat || isDisabled}
                    className={styles.sendButton}
                >
                    <Send size={18} />
                </button>
            </div>
            <p className={styles.inputHint}>
                Press Enter to send, Shift + Enter for new line
            </p>
        </div>
    );
};

export default TutorChatInput;