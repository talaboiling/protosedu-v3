import React from 'react'

const Answers = ({answers,selectedAnswer,answerState, onSelect}) => {
    return (
        <ul id='answers'>
            {answers.map(answer=>{
                const isSelected = selectedAnswer === answer.text
                let cssClasses = ''
                if (answerState==='answered' && isSelected){
                    cssClasses = 'selected'
                }
                if ((answerState==='correct' || answerState==='wrong') && isSelected){
                    cssClasses = answerState
                }

                return (<li key={answer} className='answer'>
                    <button key={answer.id} onClick={()=>onSelect(answer)} className={cssClasses}>
                        {answer.text}
                    </button>
                </li>)
                    })}
        </ul>
    )
}

export default Answers