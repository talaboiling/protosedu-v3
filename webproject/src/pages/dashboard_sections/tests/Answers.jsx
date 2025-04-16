import React from 'react'

const Answers = ({answers,selectedAnswer,answerState, onSelect, index, mode, isCorrect}) => {
    console.log(selectedAnswer, answers);
    return (
        <ul id='answers'>
            {answers.map(answer=>{
                let isSelected = false;
                if (selectedAnswer && selectedAnswer.text === answer.text){
                    isSelected = true;
                }
                let cssClasses = ''
                if (isSelected){
                    cssClasses = 'selected'
                }
                if ((answerState==='correct' || answerState==='wrong') && isSelected){
                    cssClasses = answerState
                }

                if (mode==="review"){
                    return (
                        <li key={answer} className='answer'>
                            <button key={answer.id} 
                                style={{
                                    backgroundColor: isSelected ? isCorrect ? "green" : "red" : "",
                                    cursor: "default",
                                }}
                            >
                                {answer.text}
                            </button>
                        </li>
                    )
                }
                return (<li key={answer} className='answer'>
                    <button key={answer.id} onClick={()=>onSelect(answer, index)} 
                        style={{backgroundColor: isSelected ? "green" : ""}}
                    >
                        {answer.text}
                    </button>
                </li>)
                    })}
        </ul>
    )
}

export default Answers