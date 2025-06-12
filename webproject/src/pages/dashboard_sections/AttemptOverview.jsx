import React, { useEffect, useState } from 'react'
import { Box, Modal} from '@mui/material'; 
import { toast } from 'react-toastify';
import { fetchTestAttempt } from '../../utils/apiService';

const AttemptOverview = ({attempt, testId, handleClose, modalPosition}) => {
    const [loading, setLoading] = useState(false);
    const [attemptData, setAttemptData] = useState(null);

    useEffect(()=>{
        async function fetchAttempt(){
            try{
                setLoading(true);
                const data = await fetchTestAttempt(testId, attempt);
                setAttemptData(data);
            }catch(e){
                toast.error(e.message || "Fail to fetch attemp")
            }finally{
                setLoading(false);
            }
        }
        fetchAttempt();
    }, [attempt, testId]);

    console.log(attemptData);
    return (
        <Modal open={attempt !== null} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: modalPosition.top - 320, // Adjust top position for a small margin
                        left: modalPosition.left, // Position it at the calculated right edge of the row
                        width: 'auto',
                        maxWidth: '90vw', // Ensures responsiveness (on smaller screens)
                        maxHeight: '80vh', // Ensures scrolling if the modal becomes too large
                        bgcolor: '#fff',
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        overflowY: 'auto', // Allow vertical scrolling if needed
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {loading && <p>Loading...</p>}
                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
                        Попытка {attemptData?.attempt_number}
                    </h3>
                    
                    <div style={{ borderBottom: '1px solid #ccc', paddingBottom: 8 }}>
                        <p><strong>Дата:</strong> {attemptData?.date_taken}</p>
                        <p><strong>Всего вопросов:</strong> {attemptData?.total_questions}</p>
                        <p><strong>Правильных ответов:</strong> {attemptData?.correct_answers}</p>
                        <p><strong>Балл:</strong> {attemptData?.score}</p>
                    </div>

                    <h4 style={{ marginTop: 16, fontSize: '1.25rem', color: '#444' }}>Ответы:</h4>
                    
                    {attemptData?.test_answers.map((answer, index) => {
                        const correctAnswer = answer.question.answer_options.find(answer=>answer.is_correct);
                        return <div key={index} style={{ marginBottom: 12 }}>
                            <p style={{ margin: 0 }}>
                                <strong>Вопрос {index + 1}:</strong>
                                <br />
                                {
                                    answer.answer_option.option_type==="text" && (
                                        <span><strong>Ваш ответ:</strong> {answer.answer_option.text}{' '}</span>
                                    )
                                }
                                {
                                    answer.answer_option.option_type==="image" && (
                                        <>
                                            <strong>Ваш ответ:</strong> {answer.answer_option.image && <img src={answer.answer_option.image}/>}
                                        </>
                                    )
                                }
                                <span
                                    style={{
                                        color: answer.is_correct ? '#4caf50' : '#f44336',
                                        fontWeight: 'bold',
                                    }}
                                >
                                {answer.is_correct ? '(Правильно)' : '(Неправильно)'}
                                </span>
                            </p>
                            <p style={{ margin: 0, color: '#555' }}>
                                <strong>Правильный ответ:{' '}</strong>
                                {
                                    correctAnswer.option_type==="text" && (
                                        <span>{correctAnswer.text}</span>
                                    )
                                }
                                {
                                    correctAnswer.option_type==="image" && (
                                        <>
                                            {correctAnswer.image && <img src={correctAnswer.image}/>}
                                        </>
                                    )
                                }
                            </p>
                        </div>
                    })}
                </Box>
        </Modal>
    )
}

export default AttemptOverview