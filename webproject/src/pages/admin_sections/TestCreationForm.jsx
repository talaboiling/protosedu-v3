/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import styles from './TestCreationForm.module.css'
import QuestionsCreator from './QuestionsCreator'
import { useForm } from 'react-hook-form'
import { createTest, deleteTest, updateTest } from '../../utils/apiService'
import { toast } from 'react-toastify'
import {
  buildFormDataForUpdate,
  buildFormDataForCreation,
} from '../../lib/helperFunctions'
import { Loader } from 'lucide-react'

const TestCreationForm = ({ mode, onClose, testData, categoryData }) => {
  // Helper functions for user-friendly values
  const getTestTypeDisplayName = (testType) => {
    switch (testType) {
      case 'modo':
        return 'МОДО'
      case 'ent':
        return 'ЕНТ'
      case 'diagnostic':
        return 'Функциональная грамотность'
      case 'pisa':
        return 'PISA'
      default:
        return testType
    }
  }

  const getLanguageDisplayName = (language) => {
    switch (language) {
      case 'kz':
        return 'Казахский'
      case 'ru':
        return 'Русский'
      case 'en':
        return 'English'
      default:
        return language
    }
  }

  const mockQuestions = [];

  const [loading, setLoading] = useState(null)
  const { register, handleSubmit } = useForm({
    defaultValues:
      mode === 'creation'
        ? {
          title: '',
          description: '',
          test_type: '',
        }
        : {
          title: testData.title,
          description: testData.description,
          test_type: testData.test_type,
        },
  })

  const [questions, setQuestions] = useState([])

  console.log(mode)

  useEffect(() => {
    if (mode == 'update') {
      setQuestions(testData.questions)
    } else {
      setQuestions(mockQuestions)
    }
  }, [testData.id, mode])

  console.log(testData)

  async function onSave(data) {
    if (questions.length === 0) {
      return toast.error("Нельзя создать тест без вопросов");
    }
    data['questions'] = [...questions]
    data['category'] = categoryData.id
    console.log(data)
    setLoading(true)
    if (mode === 'creation') {
      const formData = new FormData()
      buildFormDataForCreation(formData, data)
      for (const [key, value] of formData.entries()) {
        console.log(key, value)
      }
      try {
        const response = await createTest(formData)
        console.log(response)
        toast.success('Тест добавлен!')
      } catch (e) {
        toast.error('Ошибка: ' + e.message)
        throw new Error(e)
      } finally {
        setLoading(false)
        onClose()
      }
    } else if (mode === 'update') {
      const formData = new FormData()
      buildFormDataForUpdate(formData, data)
      for (const [key, value] of formData.entries()) {
        console.log(key, value)
      }
      try {
        console.log(formData)

        const response = await updateTest(formData, testData.id)
        console.log(response)
        toast.success('Тест обновлен!')
      } catch (e) {
        toast.error('Ошибка: ' + e.message)
        throw new Error(e)
      } finally {
        setLoading(false)
        onClose()
      }
    }
  }

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
      onClose()
    }
  }

  return (
    <div>
      <form
        className={styles.form}
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
          <div className={styles.inputField}>
            <label htmlFor="title">Название</label>
            <input
              {...register('title')}
              type="text"
              placeholder="Введите название"
              required
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor="description">Описание</label>
            <textarea
              {...register('description')}
              placeholder="Введите описание"
              required
            ></textarea>
          </div>
          <div className={styles.inputField}>
            <label htmlFor="test_type">Тип</label>
            <select
              {...register('test_type')}
              name="test_type"
              style={{ width: 'fit-content' }}
              required
            >
              <option value="" disabled selected>Выберите тип теста (должен совпадать с категорией)</option>
              <option value="modo">МОДО</option>
              <option value="ent">ЕНТ</option>
              <option value="diagnostic">Функциональная грамотность</option>
              <option value="pisa">PISA</option>
            </select>
          </div>
          {categoryData && (
            <div className={styles.inputField}>
              <label htmlFor="category">Категория</label>
              <input
                type="text"
                value={`${getTestTypeDisplayName(categoryData.test_type)}: ${categoryData.name
                  } (${getLanguageDisplayName(categoryData.language)})`}
                readOnly
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>
          )}
          <QuestionsCreator questions={questions} setQuestions={setQuestions} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit">Сохранить</button>
          <button onClick={onClose}>Закрыть</button>
          {mode === 'update' && (
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
          )}
        </div>
      </form>
      {loading && <Loader />}
    </div>
  )
}

export default TestCreationForm
