import React from 'react';
import { Plus, MessageSquare, Edit3, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Tutor.module.css';

const TutorSidebar = ({
    chats,
    switchChat,
    deleteChat,
    startEditingTitle,
    saveEditedTitle,
    formatSubject,
    isModalOpen,
    setIsModalOpen,
    editingChatId,
    setEditingChatId,
    editTitle,
    setEditTitle,
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            saveEditedTitle();
        }
    };

    return (
        <div className={styles.sidebar}>
            {/* Sidebar Header */}
            <div className={styles.sidebarHeader}>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.newChatButton}
                >
                    <Plus size={18} />
                    <span>New Chat</span>
                </button>
            </div>

            {/* Chat List */}
            <div className={styles.chatList}>
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`${styles.chatItem} ${chat.isActive ? styles.active : ''}`}
                        onClick={() => {
                            switchChat(chat.id)
                        }}
                    >
                        <div className={styles.chatContent}>
                            <div className={styles.chatHeader}>
                                <MessageSquare size={16} className={styles.chatIcon} />
                                {editingChatId === chat.id ? (
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onBlur={saveEditedTitle}
                                        onKeyPress={handleKeyPress}
                                        className={styles.chatTitleInput}
                                        autoFocus
                                    />
                                ) : (
                                    <h3 className={styles.chatTitle}>
                                        {chat.title}
                                    </h3>
                                )}
                            </div>
                            <p className={styles.chatPreview}>
                                {formatSubject(chat.subject)}
                            </p>
                        </div>

                        {/* Chat Actions */}
                        <div className={styles.chatActions}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startEditingTitle(chat.id, chat.title);
                                }}
                                className={styles.actionButton}
                            >
                                <Edit3 size={14} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(chat.id);
                                }}
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sidebar Footer */}
            <div className={styles.sidebarFooter}>
                <div className={styles.footerText}>
                    AI Tutor • {chats.length} chat{chats.length !== 1 ? 's' : ''}
                    <button><Link to="/dashboard">Back</Link></button>
                </div>
            </div>
        </div>
    );
};

export default TutorSidebar;