import React, { useEffect, useState } from 'react';

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Modal
} from '@mui/material'; 
import AttemptOverview from './AttemptOverview';

const PreviousAttemptsList = ({ previousAttemps, testId }) => {
    const [attempt, setAttempt] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })

    const handleRowClick = (event, id) => {
        console.log(id);
        setAttempt(id);
        const rect = event.target.closest('tr').getBoundingClientRect();
        setModalPosition({
          top: rect.top + window.scrollY, // Adjust for the page scroll
          left: rect.right + 75, // Adjust for the page scroll
        });
    };

    const handleClose = () => {
        setAttempt(null);
    };

    console.log(previousAttemps);
    return (
        <Paper elevation={4} sx={{ borderRadius: 2, p: 2, position:"relative" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                История попыток
            </Typography>

            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Попытка</strong></TableCell>
                        <TableCell><strong>Правильно</strong></TableCell>
                        <TableCell><strong>Общее</strong></TableCell>
                        <TableCell><strong>Процент</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...previousAttemps].reverse().map((prevAttempt, idx) => (
                    <TableRow
                        key={idx}
                        hover
                        sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}
                        onClick={(event)=>handleRowClick(event, prevAttempt.attempt_number)}
                    >
                        <TableCell>{prevAttempt.attempt_number}</TableCell>
                        <TableCell>{prevAttempt.correct_answers}</TableCell>
                        <TableCell>{prevAttempt.total_questions}</TableCell>
                        <TableCell>{prevAttempt.score}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Box>
            {attempt && modalPosition && (
                <AttemptOverview 
                    attempt={attempt} 
                    testId={testId} 
                    handleClose={handleClose} 
                    modalPosition={modalPosition}
                />
            )}
        </Paper>
      );
};

export default PreviousAttemptsList;