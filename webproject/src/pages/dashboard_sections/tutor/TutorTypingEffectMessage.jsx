import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import { Bot } from 'lucide-react'; // Adjust the import path as needed
import styles from './Tutor.module.css'; // Adjust the import path as needed

const TutorTypingEffectMessage = ({ pendingMessage, formatTime }) => {
    return (
        <div className={`${styles.messageWrapper} ${styles[pendingMessage.role]}`}>
            <div className={`${styles.messageContent} ${styles[pendingMessage.role]}`}>
                <div className={`${styles.avatar} ${styles[pendingMessage.role]}`}>
                    <Bot size={20} />
                </div>
                <div className={`${styles.messageInfo} ${styles[pendingMessage.role]}`}>
                    <div className={`${styles.messageBubble} ${styles[pendingMessage.role]}`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight, rehypeKatex]}
                        >
                            {pendingMessage.content}
                        </ReactMarkdown>
                    </div>
                    <span className={styles.messageTime}>
                        {formatTime(pendingMessage.created_at)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TutorTypingEffectMessage;