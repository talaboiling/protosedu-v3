import React from 'react'

const Answers = ({answers,selectedAnswer,answerState, onSelect, index, mode, isCorrect}) => {
    console.log(selectedAnswer, answers);
    return (
        <ul id='answers'>
            {answers.map(answer=>{
                let isSelected = false;
                if (selectedAnswer && selectedAnswer.text === answer.text){
                    if (answer.option_type=="image" && selectedAnswer.image==answer.image){
                        isSelected = true;
                    }else if (answer.option_type=="text" && selectedAnswer.text==answer.text){
                        isSelected = true;
                    }
                    
                }
                let cssClasses = ''
                if (isSelected){
                    cssClasses = 'selected'
                }
                if ((answerState==='correct' || answerState==='wrong') && isSelected){
                    cssClasses = answerState
                }

                if (mode==="review"){
                    if (answer.option_type==="text"){
                        return (
                            <li key={answer.id} className='answer'>
                                <button key={answer.id}
                                    style={{backgroundColor: isSelected ? "green" : ""}}
                                >
                                    {answer.text}
                                </button>
                            </li>
                        )
                    }else if (answer.option_type==="image"){
                        return <li key={answer.id} className='answer'>
                                <button key={answer.id}
                                    style={{backgroundColor: isSelected ? "green" : ""}}
                                >
                                    <img src={answer.image} style={{width: "100px"}}/>
                                </button>
                        </li>
                    }
                }
                if (answer.option_type==="text"){
                    return (
                        <li key={answer.id} className='answer'>
                            <button key={answer.id} onClick={()=>onSelect(answer, index)} 
                                style={{backgroundColor: isSelected ? "green" : ""}}
                            >
                                {answer.text}
                            </button>
                        </li>
                    )
                }else if (answer.option_type==="image"){
                    return <li key={answer.id} className='answer'>
                            <button key={answer.id} onClick={()=>onSelect(answer, index)} 
                                style={{backgroundColor: isSelected ? "green" : ""}}
                            >
                                <img src={answer.image} style={{width: "100px"}}/>
                            </button>
                    </li>
                }
                    })}
        </ul>
    )
}

export default Answers