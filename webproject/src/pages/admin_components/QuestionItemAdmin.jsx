import React, { useState } from 'react'
import classes from './QuestionItemAdmin.module.css';
import styles from './TestPage.module.css';
import { X } from 'lucide-react';

const QuestionItemAdmin = ({question, qIndex, handleDeleteQuestion}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={classes.item}>
          <div className={classes.header} onClick={toggleAccordion}>
            <h3 style={{color: "black"}}>{qIndex+1}. {question.title}</h3>
          </div>
          {isOpen && (
            <div className={classes.content}>
                <textarea
                    placeholder="Question title"
                    value={question.title}
                    style={{height: "200px", overflow:"auto", border: "1px solid black", padding: "1rem", fieldSizing: "normal"}}
                    contentEditable={true}
                    className={styles.questionHeading}
                />
    
                <div style={{ margin: "0.5rem 0" }}>
                    <label>Upload question image: </label>
                    <input
                        type="file"
                        accept="image/*"
                        disabled
                    />
                    {question.contents && question.contents.map(content=>
                        (
                            <img
                                src={content.image}
                                alt="question preview"
                                className={styles.questionImage}
                            />
                        )
                    )}
                </div>
    
                <div className={styles.answers}>
                    {question.answer_options.map((answer_option, aIndex) => (
                        <div key={aIndex} className={styles.answer} style={{backgroundColor: question.answer_options[aIndex].is_correct ? "green" : ""}}>
                            <div style={{ margin: "0.5rem 0" }}>
                                <select
                                value={answer_option.option_type}
                                disabled
                                >
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                                </select>
                            </div>
                            {answer_option.option_type === "text" ? (
                                <input
                                type="text"
                                placeholder={`Answer ${aIndex + 1}`}
                                value={answer_option.text}
                                className={styles.answerInput}
                                disabled
                                />
                            ) : (
                                <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={styles.answerImageInput}
                                    disabled
                                />
                                {answer_option.image && (
                                    <img
                                    src={answer_option.image}
                                    alt={`Answer ${aIndex + 1}`}
                                    className={styles.answerPreview}
                                    />
                                )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          )}
            <div style={{
                    position: "absolute", 
                    right: "20px", 
                    top: "20px", 
                    cursor: "pointer"
                }}
                onClick={()=>handleDeleteQuestion(question.id)}
            >
                <X size={28} color="red"/>
            </div>
        </div>
    );
}

export default QuestionItemAdmin