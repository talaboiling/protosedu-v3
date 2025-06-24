import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions, Button } from '@mui/material';

const TutorCreateChatModel = ({
    isModalOpen,
    setIsModalOpen,
    newChatTitle,
    setNewChatTitle,
    newChatSubject,
    setNewChatSubject,
    handleCreateChatFromModal,
    formatSubject
}) => {
    return (
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
    );
};

export default TutorCreateChatModel;