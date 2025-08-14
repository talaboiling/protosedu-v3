import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import Superside from './Superside'
import { fetchTest, updateTestData } from '../../utils/apiService'
import classes from './TestPage.module.css'
import { useForm } from 'react-hook-form'
import { deleteTest } from '../../utils/apiService'
import ReactLoading from 'react-loading'
import QuestionsListAdmin from './QuestionsListAdmin'

const TestPage = () => {
  const { testId } = useParams()
  const [testData, setTestData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [editLoading, setEditLoading] = useState(null)

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: testData
      ? {
        title: testData.title,
        description: testData.description,
        test_type: testData.test_type,
        shuffle_questions: testData.shuffle_questions,
      }
      : {
        title: '',
        description: '',
        test_type: '',
        shuffle_questions: 'no',
      },
  })

  async function getTest() {
    try {
      setLoading(true)
      const data = await fetchTest(testId)
      if (data.title) {
        setValue('title', data.title)
      }
      if (data.description) {
        setValue('description', data.description)
      }
      if (data.test_type) {
        setValue('test_type', data.test_type)
      }
      if (data.shuffle_questions) {
        setValue('shuffle_questions', data.shuffle_questions ? 'yes' : 'no')
      }

      if (Array.isArray(data.questions)) {
        data.questions.sort((a, b) => a.id - b.id)
      }
      setTestData(data)
    } catch (e) {
      setError(e)
      toast.error(e.message || 'Error happened')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTest()
  }, [testId])
  console.log(testData)

  const deleteTestHandler = async (id) => {
    console.log(id, 134134212341234)
    try {
      setLoading(true)
      const response = await deleteTest(id)
      console.log(response)
      toast.success('Тест удален!')
    } catch (e) {
      toast.error('Ошибка: ' + e.message)
      throw new Error(e)
    } finally {
      setLoading(false)
    }
  }

  async function onSave(data) {
    console.log(data)
    if (data.shuffle_questions === 'yes') {
      data.shuffle_questions = true
    } else {
      data.shuffle_questions = false
    }
    try {
      setEditLoading(true)
      const response = await updateTestData(data, testId)
      console.log(response)
      toast.success('Тест изменен!')
    } catch (e) {
      console.log(e)
      setEditLoading(false)
      toast.error('Не получилось изменить тест')
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && !error && (
        <div className="spdash">
          <Superside />
          <div className="superMain">
            <Link to={'/login'}>
              <button
                style={{
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: '#444',
                  fontSize: 'large',
                  float: 'right',
                }}
              >
                Выйти
              </button>
            </Link>
            <h2>Данные теста</h2>
            <form
              className={classes.form}
              style={{ marginBottom: '1rem', position: 'relative' }}
              onSubmit={handleSubmit(onSave)}
            >
              <div
                style={{
                  width: '90%',
                  margin: 'auto',
                  marginBottom: '20px',
                  padding: '20px',
                  borderBottom: '1px solid grey',
                }}
              >
                <div className={classes.inputField}>
                  <label htmlFor="title">Title</label>
                  <input
                    {...register('title')}
                    type="text"
                    placeholder="Enter title"
                  />
                </div>
                <div className={classes.inputField}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    {...register('description')}
                    placeholder="Enter description"
                  ></textarea>
                </div>
                <div className={classes.inputField}>
                  <label htmlFor="test_type">Type</label>
                  <select
                    {...register('test_type')}
                    name="test_type"
                    style={{ width: 'fit-content' }}
                  >
                    <option value="modo">Modo</option>
                    <option value="ent">Ent</option>
                    <option value="diagnostic">Функциональная грамотность</option>
                  </select>
                </div>
                <div className={classes.inputField}>
                  <label htmlFor="shuffle_questions">Shuffle questions</label>
                  <select
                    {...register('shuffle_questions')}
                    name="shuffle_questions"
                    style={{ width: 'fit-content' }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    width: '80px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {editLoading && <ReactLoading type="spokes" width={24} />}
                  {!editLoading && <>Save</>}
                </button>
                <button
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '20px',
                  }}
                  type="button"
                  onClick={() => deleteTestHandler(testData.id)}
                >
                  Удалить тест
                </button>
              </div>
            </form>
            <h2>Вопросы теста</h2>
            <div
              className="superCont"
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              {!loading && testData && (
                <QuestionsListAdmin
                  questions={testData.questions}
                  testId={testId}
                  getTest={getTest}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  )
}

export default TestPage
