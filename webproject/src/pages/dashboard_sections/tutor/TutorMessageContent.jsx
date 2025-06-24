import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { User, Bot } from 'lucide-react';
import styles from './Tutor.module.css';

const TutorMessageContent = ({ messages, formatTime }) => {
    return (
        <>
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`${styles.messageWrapper} ${styles[message.role]}`}
                >
                    <div className={`${styles.messageContent} ${styles[message.role]}`}>
                        <div className={`${styles.avatar} ${styles[message.role]}`}>
                            {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div className={`${styles.messageInfo} ${styles[message.role]}`}>
                            <div className={`${styles.messageBubble} ${styles[message.role]}`}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeRaw]}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                            <span className={styles.messageTime}>
                                {formatTime(message.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default TutorMessageContent;