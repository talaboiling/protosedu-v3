import React, { useEffect, useState, useRef } from "react";
import { Send, User, Bot, Plus, MessageSquare, Edit3, Trash2 } from "lucide-react";
import styles from './Tutor.module.css'; // Import your CSS module
import { Link } from "react-router-dom";
import { createTutorChatSession, fetchTutorChatSessionMessages, fetchTutorChatSessions, sendTutorChatMessage } from "../../utils/apiService";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const Tutor = () => {
    const [chats, setChats] = useState([]);

    const [activeChat, setActiveChat] = useState(1);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [editingChatId, setEditingChatId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const messagesEndRef = useRef(null);

    // Get current active chat
    const currentChat = chats.find(chat => chat.id === activeChat);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chatSessions = await fetchTutorChatSessions();
                const formattedChats = chatSessions.map(chat => ({
                    id: chat.id,
                    title: chat.title,
                    messages: [],
                    subject: chat.subject,
                    lastMessage: new Date(),
                    isActive: chat.id === activeChat
                }));

                setChats(formattedChats);

                // Fetch initial messages for the active chat
                if (activeChat) {
                    const messages = await fetchTutorChatSessionMessages(activeChat);
                    setChats(prev => prev.map(chat =>
                        chat.id === activeChat
                            ? { ...chat, messages }
                            : chat
                    ));
                }
            } catch (error) {
                console.error("Failed to fetch chats:", error.message);
            }
        };

        fetchChats();
    }, [])


    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentChat) return;

            try {
                const messages = await fetchTutorChatSessionMessages(currentChat.id);
                setChats(prev => prev.map(chat =>
                    chat.id === currentChat.id
                        ? { ...chat, messages }
                        : chat
                ));
            } catch (error) {
                console.error("Failed to fetch messages:", error.message);
            }
        };

        fetchMessages();
    }, [currentChat?.id]);


    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages]);

    // Create new chat
    const createNewChat = async () => {
        const subject = "math"; // You could prompt the user or pick from dropdown in future
        const title = `New Chat ${chats.length + 1}`;

        try {
            const newChatData = await createTutorChatSession({ subject, title });

            const initialBotMessage = {
                id: Date.now(),
                text: "Hello! I'm your AI tutor. How can I help you learn today?",
                sender: "ai",
                timestamp: new Date()
            };

            const newChat = {
                id: newChatData.id,
                title: newChatData.title,
                messages: [initialBotMessage],
                lastMessage: new Date(),
                isActive: true
            };

            setChats(prev => [
                newChat,
                ...prev.map(chat => ({ ...chat, isActive: false }))
            ]);
            setActiveChat(newChat.id);
        } catch (error) {
            console.error("Failed to create new chat:", error.message);
        }
    };


    // Switch to different chat
    const switchChat = (chatId) => {
        setChats(prev => prev.map(chat => ({
            ...chat,
            isActive: chat.id === chatId
        })));
        setActiveChat(chatId);
    };

    // Delete chat
    const deleteChat = (chatId) => {
        if (chats.length === 1) return; // Don't delete if it's the only chat

        setChats(prev => {
            const updatedChats = prev.filter(chat => chat.id !== chatId);
            if (activeChat === chatId && updatedChats.length > 0) {
                setActiveChat(updatedChats[0].id);
                updatedChats[0].isActive = true;
            }
            return updatedChats;
        });
    };

    // Start editing chat title
    const startEditingTitle = (chatId, currentTitle) => {
        setEditingChatId(chatId);
        setEditTitle(currentTitle);
    };

    // Save edited title
    const saveEditedTitle = () => {
        if (editTitle.trim()) {
            setChats(prev => prev.map(chat =>
                chat.id === editingChatId
                    ? { ...chat, title: editTitle.trim() }
                    : chat
            ));
        }
        setEditingChatId(null);
        setEditTitle("");
    };

    // Handle sending messages
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: "user",
            timestamp: new Date()
        };

        // Update UI immediately with user message
        setChats(prev => prev.map(chat =>
            chat.id === activeChat
                ? {
                    ...chat,
                    messages: [...chat.messages, userMessage],
                    lastMessage: new Date()
                }
                : chat
        ));

        setInputMessage("");
        setIsLoading(true);

        try {
            const response = await sendTutorChatMessage(activeChat, { content: userMessage.text });

            const aiResponse = {
                id: Date.now() + 1,
                text: response.content,
                sender: "ai",
                timestamp: new Date(response.created_at)
            };

            setChats(prev => prev.map(chat =>
                chat.id === activeChat
                    ? {
                        ...chat,
                        messages: [...chat.messages, aiResponse],
                        lastMessage: new Date()
                    }
                    : chat
            ));
        } catch (error) {
            console.error("Error sending message:", error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        } else if (e.key === 'Enter' && editingChatId) {
            e.preventDefault();
            saveEditedTitle();
        }
    };

    const formatTime = (timestamp) => {
        // return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return timestamp
    };


    const formatSubject = (subject) => {
        switch (subject) {
            case "math":
                return "Mathematics";
            case "biology":
                return "Biology";
            case "physics":
                return "Physics";
            case "chemistry":
                return "Chemistry";
            case "history":
                return "History";
            case "geography":
                return "Geography";
            case "computer_science":
                return "Computer Science";
            case "art":
                return "Art";
            case "music":
                return "Music";
            case "kazakh":
                return "Kazakh Language";
            case "russian":
                return "Russian Language";
            case "english":
                return "English Language";
            default:
                return "Unknown Subject";
        }
    };

    const formatChatTime = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "now";
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    return (
        <div className={styles.container}>
            {/* Chat Sidebar */}
            <div className={styles.sidebar}>
                {/* Sidebar Header */}
                <div className={styles.sidebarHeader}>
                    <button
                        onClick={createNewChat}
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
                            onClick={() => switchChat(chat.id)}
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
                                {chats.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteChat(chat.id);
                                        }}
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div className={styles.sidebarFooter}>
                    <div className={styles.footerText}>
                        AI Tutor • {chats.length} chat{chats.length !== 1 ? 's' : ''}

                        <button><Link to="/dashboard" >Back</Link></button>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={styles.mainChat}>
                {/* Chat Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerInfo}>
                            <h1>{currentChat?.title || "AI Tutor"}</h1>
                            <p>Ask me anything to get started learning</p>
                        </div>
                        <div className={styles.statusIndicator}>
                            <div className={styles.statusDot}></div>
                            <span className={styles.statusText}>Online</span>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className={styles.messagesContainer}>
                    {currentChat?.messages.map((message) => (
                        <div
                            key={message.id}
                            className={`${styles.messageWrapper} ${styles[message.role]}`}
                        >
                            <div className={`${styles.messageContent} ${styles[message.role]}`}>
                                {/* Avatar */}
                                <div className={`${styles.avatar} ${styles[message.role]}`}>
                                    {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>

                                {/* Message Content */}
                                <div className={`${styles.messageInfo} ${styles[message.role]}`}>
                                    <div className={`${styles.messageBubble} ${styles[message.role]}`}>
                                        <ReactMarkdown
                                            // className={styles.messageText} // Apply your paragraph styles to the markdown output
                                            remarkPlugins={[remarkGfm]} // Add plugins if you need extended markdown features
                                        // rehypePlugins={[rehypeRaw]} // Uncomment if you need to render raw HTML from markdown
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                    <span className={styles.messageTime}>
                                        {formatTime(message.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className={styles.loadingWrapper}>
                            <div className={styles.loadingContent}>
                                <div className={`${styles.avatar} ${styles.ai}`}>
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
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={styles.inputArea}>
                    <div className={styles.inputWrapper}>
                        <div className={styles.inputContainer}>
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your question here..."
                                className={styles.textInput}
                                rows={1}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className={styles.sendButton}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className={styles.inputHint}>
                        Press Enter to send, Shift + Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Tutor;