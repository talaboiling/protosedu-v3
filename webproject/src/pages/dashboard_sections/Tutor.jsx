import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Send, User, Bot, Plus, MessageSquare, Edit3, Trash2 } from "lucide-react";
import styles from './Tutor.module.css';
import { Link } from "react-router-dom";
import {
    createTutorChatSession,
    fetchTutorChatSessionMessages,
    fetchTutorChatSessions,
    deleteTutorChatSession,
    sendTutorChatMessage
} from "../../utils/apiService";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ToastContainer, toast } from 'react-toastify';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem
} from '@mui/material';
import { WS_URL } from "../../utils/config";

// WebSocket hook for managing connections
const useWebSocket = (chatId, onMessage) => {
    const wsRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const connect = useCallback(() => {
        if (!chatId || wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        setIsConnecting(true);
        // Construct WebSocket URL properly - remove http:// and use ws://

        const wsUrl = `${WS_URL}/chat/${chatId}/`;

        console.log(`Connecting to WebSocket for chat ${chatId} at ${wsUrl}`);

        try {
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log(`WebSocket connected for chat ${chatId}`);
                setIsConnected(true);
                setIsConnecting(false);
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    onMessage(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            wsRef.current.onclose = (event) => {
                console.log(`WebSocket closed for chat ${chatId}:`, event.code, event.reason);
                setIsConnected(false);
                setIsConnecting(false);

                // Reconnect after delay if it wasn't a manual close
                if (event.code !== 1000) {
                    setTimeout(() => {
                        if (chatId) connect();
                    }, 3000);
                }
            };

            wsRef.current.onerror = (error) => {
                console.error(`WebSocket error for chat ${chatId}:`, error);
                setIsConnecting(false);
            };
        } catch (error) {
            console.error('Error creating WebSocket:', error);
            setIsConnecting(false);
        }
    }, [chatId, onMessage]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close(1000, 'Component unmounting');
            wsRef.current = null;
        }
        setIsConnected(false);
        setIsConnecting(false);
    }, []);

    const sendMessage = useCallback((message) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
            return true;
        }
        return false;
    }, []);

    useEffect(() => {
        if (chatId) {
            connect();
        }
        return disconnect;
    }, [chatId, connect, disconnect]);

    return { isConnected, isConnecting, sendMessage, disconnect };
};

const Tutor = () => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [editingChatId, setEditingChatId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChatTitle, setNewChatTitle] = useState('');
    const [newChatSubject, setNewChatSubject] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);
    const [pendingMessage, setPendingMessage] = useState(null);


    const messagesEndRef = useRef(null);

    // Get current active chat
    const currentChat = useMemo(() =>
        chats.find(chat => chat.id === activeChat),
        [chats, activeChat]
    );

    // Handle incoming WebSocket messages
    const handleWebSocketMessage = useCallback((message) => {
        console.log('Received WebSocket message:', message);

        if (message.role === 'assistant') {
            // Add AI response to the current chat
            const fullText = message.content;
            let currentText = '';
            const messageId = message.id;

            setPendingMessage({
                id: messageId,
                content: '',
                role: message.role,
                created_at: message.created_at
            });
            setIsLoading(false)

            let index = 0;
            const typingInterval = 5;
            const type = () => {
                if (index < fullText.length) {
                    currentText += fullText.charAt(index);
                    setPendingMessage(prev => ({
                        ...prev,
                        content: currentText
                    }));
                    index++;
                    setTimeout(type, typingInterval);
                } else {
                    // Done typing, push message into chats
                    setChats(prev => prev.map(chat =>
                        chat.id === activeChat
                            ? {
                                ...chat,
                                messages: [...chat.messages, {
                                    id: messageId,
                                    content: fullText,
                                    role: message.role,
                                    created_at: message.created_at
                                }],
                                lastMessage: new Date(message.created_at)
                            }
                            : chat
                    ));
                    setPendingMessage(null);
                    setIsLoading(false);
                }
            };

            type(); // Stop loading when AI response arrives
        }
    }, [activeChat]);

    // Add timeout for WebSocket responses
    const messageTimeoutRef = useRef(null);

    // Clear timeout when component unmounts or chat changes
    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
        };
    }, [activeChat]);

    // WebSocket connection for active chat
    const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocket(
        activeChat,
        handleWebSocketMessage
    );

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Fetch all chats and set active chat
    const fetchChats = useCallback(async (newActiveChatId = null) => {
        try {
            setInitialLoading(true);
            const chatSessions = await fetchTutorChatSessions();

            const formattedChats = await Promise.all(
                chatSessions.map(async (chat) => {
                    let messages = [];
                    // Only fetch messages for the active chat to improve performance
                    if (chat.id === newActiveChatId || (!newActiveChatId && chatSessions[0]?.id === chat.id)) {
                        try {
                            messages = await fetchTutorChatSessionMessages(chat.id);
                        } catch (error) {
                            console.error(`Failed to fetch messages for chat ${chat.id}:`, error);
                        }
                    }

                    return {
                        id: chat.id,
                        title: chat.title,
                        messages,
                        subject: chat.subject,
                        lastMessage: new Date(chat.updated_at || chat.created_at),
                        // isActive: chat.id === (newActiveChatId || (!newActiveChatId && chatSessions[0]?.id))
                    };
                })
            );

            setChats(formattedChats);

            // Set active chat
            // const activeChatId = newActiveChatId || chatSessions[0]?.id;
            // if (activeChatId) {
            //     setActiveChat(activeChatId);
            // }
        } catch (error) {
            console.error("Failed to fetch chats:", error);
            toast.error("Failed to load chats");
        } finally {
            setInitialLoading(false);
        }
    }, []);

    // Load messages for a specific chat when switching
    const loadChatMessages = useCallback(async (chatId) => {
        try {
            const messages = await fetchTutorChatSessionMessages(chatId);
            setChats(prev => prev.map(chat =>
                chat.id === chatId
                    ? { ...chat, messages }
                    : chat
            ));
        } catch (error) {
            console.error(`Failed to fetch messages for chat ${chatId}:`, error);
            toast.error("Failed to load messages");
        }
    }, []);

    // Initialize chats on component mount
    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    useEffect(() => {
        if (pendingMessage) {
            scrollToBottom();
        }
    }, [pendingMessage, scrollToBottom]);


    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages, scrollToBottom]);

    // Create new chat
    const createNewChat = useCallback(async (title = null, subject = "math") => {
        const chatTitle = title || `New Chat ${chats.length + 1}`;

        try {
            const newChat = await createTutorChatSession({ subject, title: chatTitle });
            toast.success("New chat created successfully!");
            await fetchChats(newChat.id);
        } catch (error) {
            console.error("Failed to create new chat:", error);
            toast.error("Failed to create new chat");
        }
    }, [chats.length, fetchChats]);

    // Switch to different chat
    const switchChat = useCallback(async (chatId) => {
        if (chatId === activeChat) return;

        setChats(prev => prev.map(chat => ({
            ...chat,
            isActive: chat.id === chatId
        })));

        setActiveChat(chatId);

        // Load messages if not already loaded
        const targetChat = chats.find(chat => chat.id === chatId);
        if (targetChat && targetChat.messages.length === 0) {
            await loadChatMessages(chatId);
        }
    }, [activeChat, chats, loadChatMessages]);

    // Delete chat
    const deleteChat = useCallback(async (chatId) => {
        if (!window.confirm("Are you sure you want to delete this chat?")) {
            return;
        }

        try {
            await deleteTutorChatSession(chatId);
            toast.success("Chat deleted successfully!");

            setChats(prev => {
                const updatedChats = prev.filter(chat => chat.id !== chatId);

                // If we're deleting the active chat, switch to another one
                if (activeChat === chatId && updatedChats.length > 0) {
                    const newActiveChat = updatedChats[0];
                    newActiveChat.isActive = true;
                    setActiveChat(newActiveChat.id);

                    // Load messages for the new active chat if needed
                    if (newActiveChat.messages.length === 0) {
                        loadChatMessages(newActiveChat.id);
                    }
                } else if (updatedChats.length === 0) {
                    setActiveChat(null);
                }

                return updatedChats;
            });
        } catch (error) {
            console.error("Failed to delete chat:", error);
            toast.error("Failed to delete chat");
        }
    }, [activeChat, loadChatMessages]);

    // Start editing chat title
    const startEditingTitle = useCallback((chatId, currentTitle) => {
        setEditingChatId(chatId);
        setEditTitle(currentTitle);
    }, []);

    // Save edited title
    const saveEditedTitle = useCallback(() => {
        if (editTitle.trim()) {
            setChats(prev => prev.map(chat =>
                chat.id === editingChatId
                    ? { ...chat, title: editTitle.trim() }
                    : chat
            ));
            // TODO: Add API call to update title on server
        }
        setEditingChatId(null);
        setEditTitle("");
    }, [editingChatId, editTitle]);

    // Handle sending messages
    const handleSendMessage = useCallback(async () => {
        if (!inputMessage.trim() || !activeChat || isLoading) return;

        const userMessage = {
            id: `temp-${Date.now()}`, // Temporary ID
            content: inputMessage.trim(),
            role: "user",
            created_at: new Date().toISOString()
        };

        // Clear input immediately
        const messageContent = inputMessage.trim();
        setInputMessage("");
        setIsLoading(true);

        // Add user message to UI immediately
        setChats(prev => prev.map(chat =>
            chat.id === activeChat
                ? {
                    ...chat,
                    messages: [...chat.messages, userMessage],
                    lastMessage: new Date()
                }
                : chat
        ));

        // Set timeout for WebSocket response (30 seconds)
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }

        messageTimeoutRef.current = setTimeout(() => {
            if (isLoading) {
                console.warn('WebSocket response timeout, stopping loading');
                setIsLoading(false);
                toast.warning("Response is taking longer than expected. Please check your connection.");
            }
        }, 30000); // 30 second timeout

        try {
            // Send user message via HTTP API
            // The server will process it and send AI response back via WebSocket
            await sendTutorChatMessage(activeChat, {
                content: messageContent
            });

            // Don't set isLoading to false here - wait for WebSocket response
            // The AI response will come through handleWebSocketMessage which will set isLoading to false

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
            setIsLoading(false);

            // Clear timeout on error
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }

            // Remove the user message if sending failed
            setChats(prev => prev.map(chat =>
                chat.id === activeChat
                    ? {
                        ...chat,
                        messages: chat.messages.filter(msg => msg.id !== userMessage.id)
                    }
                    : chat
            ));
        }
    }, [inputMessage, activeChat, isLoading]);

    // Handle key press
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        } else if (e.key === 'Enter' && editingChatId) {
            e.preventDefault();
            saveEditedTitle();
        }
    }, [handleSendMessage, editingChatId, saveEditedTitle]);

    // Format time helper
    const formatTime = useCallback((timestamp) => {
        const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    // Format subject helper
    const formatSubject = useCallback((subject) => {
        const subjects = {
            "math": "Mathematics",
            "biology": "Biology",
            "physics": "Physics",
            "chemistry": "Chemistry",
            "history": "History",
            "geography": "Geography",
            "computer_science": "Computer Science",
            "art": "Art",
            "music": "Music",
            "kazakh": "Kazakh Language",
            "russian": "Russian Language",
            "english": "English Language"
        };
        return subjects[subject] || "Unknown Subject";
    }, []);

    // Create new chat from modal
    const handleCreateChatFromModal = useCallback(async () => {
        if (!newChatTitle.trim() || !newChatSubject) {
            toast.error("Please enter both title and subject.");
            return;
        }

        try {
            const newChat = await createTutorChatSession({
                title: newChatTitle.trim(),
                subject: newChatSubject
            });
            toast.success("New chat created!");
            setIsModalOpen(false);
            setNewChatTitle('');
            setNewChatSubject('');
            await fetchChats(newChat.id);
        } catch (error) {
            console.error("Failed to create new chat:", error);
            toast.error("Failed to create new chat");
        }
    }, [newChatTitle, newChatSubject, fetchChats]);

    if (initialLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading chats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Chat Sidebar */}
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
                            <div className={`${styles.statusDot} ${isConnected ? styles.connected : ''}`}></div>
                            <span className={styles.statusText}>
                                {isConnected ? 'Connected' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className={styles.messagesContainer}>
                    {!currentChat ? (
                        <div className={styles.emptyState}>
                            <h2 className={styles.emptyStateHeading}>Select a chat to start using the AI Tutor</h2>
                            <p className={styles.emptyStateText}>You can create a new chat from the sidebar to get started.</p>
                        </div>
                    ) : (
                        <>
                            {currentChat.messages.map((message) => (
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
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
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

                            {/* ✅ Typing effect message */}
                            {pendingMessage && currentChat.id === activeChat && (
                                <div className={`${styles.messageWrapper} ${styles[pendingMessage.role]}`}>
                                    <div className={`${styles.messageContent} ${styles[pendingMessage.role]}`}>
                                        <div className={`${styles.avatar} ${styles[pendingMessage.role]}`}>
                                            <Bot size={20} />
                                        </div>
                                        <div className={`${styles.messageInfo} ${styles[pendingMessage.role]}`}>
                                            <div className={`${styles.messageBubble} ${styles[pendingMessage.role]}`}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {pendingMessage.content}
                                                </ReactMarkdown>
                                            </div>
                                            <span className={styles.messageTime}>
                                                {formatTime(pendingMessage.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}



                    {/* Loading indicator */}
                    {isLoading && (
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
                                disabled={isLoading || !activeChat}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading || !activeChat}
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

            {/* Create Chat Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DialogTitle>Create New Chat</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Chat Title"
                        fullWidth
                        value={newChatTitle}
                        onChange={(e) => setNewChatTitle(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        select
                        label="Subject"
                        fullWidth
                        value={newChatSubject}
                        onChange={(e) => setNewChatSubject(e.target.value)}
                        margin="normal"
                    >
                        {[
                            "math", "biology", "physics", "chemistry", "history", "geography",
                            "computer_science", "art", "music", "kazakh", "russian", "english"
                        ].map((subject) => (
                            <MenuItem key={subject} value={subject}>
                                {formatSubject(subject)}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateChatFromModal}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </div>
    );
};

export default Tutor;