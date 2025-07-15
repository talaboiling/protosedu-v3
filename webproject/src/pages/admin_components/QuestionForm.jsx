import React, { useEffect, useState } from 'react'
import styles from './TestPage.module.css'

const emptyQuestionData = {
  option_type: 'text',
  is_correct: false,
  text: '',
  image: null,
}

const QuestionForm = ({ mode, questionData, onSubmit, testId }) => {
  const [currentQuestionData, setCurrentQuestionData] = useState({
    test: parseInt(testId),
    title: '',
    description: '',
    contents: [],
    type: 'mcq',
    answer_options: [
      emptyQuestionData,
      emptyQuestionData,
      emptyQuestionData,
      emptyQuestionData,
    ],
    correct_answer: '',
  })

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setCurrentQuestionData((prev) => ({
        ...prev,
        contents: [
          {
            content_type: 'image',
            image: file,
          },
        ],
      }))
    }
  }

  const handleAnswerCorrect = (aIndex) => {
    const tempQuestionData = { ...currentQuestionData }
    tempQuestionData.answer_options = currentQuestionData.answer_options.map(
      (answer) => ({ ...answer, is_correct: false })
    )
    tempQuestionData.answer_options[aIndex].is_correct = true
    setCurrentQuestionData(tempQuestionData)
  }

  const handleQuestionAnswerTypeChange = (aIndex, field, value) => {
    const tempQuestionData = { ...currentQuestionData }
    if (field === 'option_type') {
      tempQuestionData.answer_options[aIndex]['text'] = ''
      tempQuestionData.answer_options[aIndex]['image'] = ''
    }
    tempQuestionData.answer_options[aIndex][field] = value
    setCurrentQuestionData(tempQuestionData)
  }

  const handleAnswerChange = (aIndex, value, type = 'text') => {
    const tempQuestionData = { ...currentQuestionData }
    if (type === 'text') {
      tempQuestionData.answer_options[aIndex].text = value
    } else {
      tempQuestionData.answer_options[aIndex].image = value
    }
    setCurrentQuestionData(tempQuestionData)
  }

  const handleAnswerImageChange = (aIndex, event) => {
    event.stopPropagation()
    const file = event.target.files[0]
    if (file) {
      handleAnswerChange(aIndex, file, 'image')
    }
  }

  useEffect(() => {
    if (mode === 'update' && questionData) {
      setCurrentQuestionData((prev) => {
        const merged = {
          ...prev,
          ...Object.keys(questionData).reduce((acc, key) => {
            if (questionData[key] !== undefined) acc[key] = questionData[key]
            return acc
          }, {}),
        }
        if (merged.type === 'open' && merged.correct_answer === undefined) {
          merged.correct_answer = ''
        }
        return merged
      })
    }
  }, [mode, questionData?.id])
  console.log(currentQuestionData)

  return (
    <div className={styles.questionItem}>
      <p>Question</p>
      <textarea
        placeholder="Question title"
        value={currentQuestionData.title}
        onChange={(e) =>
          setCurrentQuestionData((prev) => ({ ...prev, title: e.target.value }))
        }
        style={{
          height: '200px',
          overflow: 'auto',
          border: '1px solid black',
          padding: '1rem',
          fieldSizing: 'normal',
        }}
        contentEditable={true}
        className={styles?.questionHeading}
      />

      <div style={{ margin: '0.5rem 0' }}>
        <div className={styles.inputField}>
          <label>Upload question image: </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
          />
        </div>
        {currentQuestionData.contents &&
          currentQuestionData.contents.map((content, idx) => (
            <img
              key={idx}
              src={content.image}
              alt="question preview"
              className={styles.questionImage}
            />
          ))}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="question-type">Тип вопроса: </label>
        <select
          id="question-type"
          value={currentQuestionData.type}
          onChange={(e) =>
            setCurrentQuestionData((prev) => ({
              ...prev,
              type: e.target.value,
              answer_options:
                e.target.value === 'mcq'
                  ? [
                      emptyQuestionData,
                      emptyQuestionData,
                      emptyQuestionData,
                      emptyQuestionData,
                    ]
                  : [],
              correct_answer:
                e.target.value === 'open' ? prev.correct_answer || '' : '',
            }))
          }
        >
          <option value="mcq">С вариантами ответов</option>
          <option value="open">С правильным ответом</option>
        </select>
      </div>
      <div className={styles.answers}>
        {currentQuestionData.answer_options.map((answer_option, aIndex) => (
          <div
            key={aIndex}
            className={styles.answer}
            onClick={() => handleAnswerCorrect(aIndex)}
            style={{
              backgroundColor: currentQuestionData.answer_options[aIndex]
                .is_correct
                ? 'green'
                : '',
            }}
          >
            <div style={{ margin: '0.5rem 0' }}>
              <select
                value={answer_option.option_type}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  handleQuestionAnswerTypeChange(
                    aIndex,
                    'option_type',
                    e.target.value
                  )
                }
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </div>
            {answer_option.option_type === 'text' ? (
              <input
                type="text"
                placeholder={`Answer ${aIndex + 1}`}
                value={answer_option.text}
                onChange={(e) => handleAnswerChange(aIndex, e.target.value)}
                className={styles.answerInput}
              />
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAnswerImageChange(aIndex, e)}
                  className={styles.answerImageInput}
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
      {currentQuestionData.type === 'open' && (
        <div className={styles.inputField}>
          <label>Correct answer: </label>
          <input
            type="text"
            value={currentQuestionData.correct_answer}
            onChange={(e) =>
              setCurrentQuestionData((prev) => ({
                ...prev,
                correct_answer: e.target.value,
              }))
            }
          />
        </div>
      )}
      <button
        onClick={() =>
          mode === 'update'
            ? onSubmit(currentQuestionData, questionData.id)
            : onSubmit(currentQuestionData)
        }
      >
        Save
      </button>
    </div>
  )
}

export default QuestionForm
