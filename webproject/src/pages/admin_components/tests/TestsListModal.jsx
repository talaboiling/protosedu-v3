import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { Plus } from 'lucide-react';
import { addTestToCategory } from '../../../utils/apiService';
import { Typography, Divider, Box } from '@mui/material';

const TestsListModal = ({ onClose, tests, categoryId, type }) => {
    const handleAddTest = async (testId) => {
        await addTestToCategory(testId, categoryId);
        onClose();
    };


    const formatType = (type) => {
        switch (type) {
            case 'modo':
                return 'МОДО';
            case 'ent':
                return 'ЕНТ';
            case 'diagnostic':
                return 'Диагностический';
            case 'pisa':
                return 'PISA';
            default:
                return 'Неизвестный тип';
        }
    };

    // Filter out tests that already belong to the current category
    const availableTests = tests.filter(test => {
        return !test.category || parseInt(test.category) !== parseInt(categoryId);
    });

    const getCategoryStatus = (test) => {
        if (!test.category) {
            return { text: 'Не используется', color: 'green' };
        }
        if (parseInt(test.category) === parseInt(categoryId)) {
            return { text: 'Текущая категория', color: 'blue' };
        }
        return { text: 'Используется', color: 'red' };
    };

    return (
        <Dialog onClose={onClose} open maxWidth="md" fullWidth>
            <DialogTitle align="center" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                Выберите тест с типом "{formatType(type)}"
            </DialogTitle>
            <Box p={2}>
                <List>
                    {availableTests.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="Нет доступных тестов." />
                        </ListItem>
                    ) : (
                        availableTests.map((test) => {
                            const { text, color } = getCategoryStatus(test);
                            return (
                                <Box key={test.id} sx={{ mb: 1, borderRadius: '8px', boxShadow: 2, '&:hover': { boxShadow: 4, backgroundColor: '#f5f5f5' } }}>
                                    <ListItem
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            padding: '12px 16px',
                                        }}
                                        secondaryAction={
                                            <IconButton edge="end" onClick={() => handleAddTest(test.id)} style={{ color: '#077AC2' }}>
                                                <Plus />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6" style={{ fontWeight: '600' }}>
                                                    {test.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" style={{ color }}>
                                                    {text}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </Box>
                            );
                        })
                    )}
                </List>
            </Box>
        </Dialog>
    );
};

export default TestsListModal;
