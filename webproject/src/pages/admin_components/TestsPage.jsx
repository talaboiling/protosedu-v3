/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import '../../tailwind.css' // Import Tailwind CSS
import Superside from './Superside'
import { capitalizeFirstLetter } from '../../lib/helperFunctions'
import TestCreationModal from './tests/TestCreationModal'
import {
  fetchTests,
  removeTestFromCategory,
  fetchTestCategory,
  updateTestOrder,
} from '../../utils/apiService'
import Loader from '../Loader'
import TestsListModal from './tests/TestsListModal'
import { Card, CardContent, Typography, Button, Grid } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

// TestList Component with Drag and Drop functionality
function SortableTestItem({
  id,
  children,
  test,
  openTest,
  handleDeleteTest,
  index,
  handleRemoveFromCategory,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <li
        key={index}
        onClick={() => openTest(test.id)}
        className="questions"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
          margin: '8px 0',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          cursor: 'pointer',
          border: '1px solid #ddd',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#e8f4fd'
          e.target.style.borderColor = '#2196f3'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#f5f5f5'
          e.target.style.borderColor = '#ddd'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <p className="defaultStyle" style={{ margin: 0, fontWeight: 'bold' }}>
            {index + 1}.
          </p>
          <div>
            <div style={{ fontWeight: 'bold', color: '#333' }}>
              {test.title || `Тест ${index + 1}`}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Описание: {test.description?.slice(0, 50) || 'Нет описания'}...
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveFromCategory(test.id)
            }}
            className="transBtn"
            style={{
              padding: '4px',
              backgroundColor: '#ff4444',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
            title="Убрать из категории"
          >
            <DeleteForeverIcon sx={{ fontSize: 16 }} />
          </button>
          <div
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            style={{
              cursor: 'grab',
              padding: '4px',
              userSelect: 'none',
              fontSize: '18px',
              color: '#666',
            }}
            title="Перетащить для изменения порядка"
          >
            &#9776;
          </div>
        </div>
      </li>
    </div>
  )
}

const TestList = ({
  tests,
  openTest,
  handleRemoveFromCategory,
  setTests,
  categoryId,
  type,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  async function handleDragEnd(event) {
    const { active, over } = event
    console.log(active, over)

    if (!over || !active) {
      return
    }

    try {
      const oldIndex = tests.findIndex((test) => test.id === active.id)
      const newIndex = tests.findIndex((test) => test.id === over.id)

      const updatedTests = arrayMove(tests, oldIndex, newIndex)

      // Update order property for each test
      updatedTests.forEach((test, index) => {
        test.order = index + 1
      })

      setTests(updatedTests)

      // Prepare data for API call
      const testOrderData = updatedTests.map((test, index) => ({
        id: test.id,
        order: index + 1,
      }))

      // Call API to update test order in backend
      await updateTestOrder(categoryId, testOrderData)
      console.log('New test order saved to backend:', testOrderData)
      toast.success('Порядок тестов обновлен!')
    } catch (error) {
      console.error('Error saving test order:', error)
      toast.error('Ошибка при сохранении порядка тестов')
      // Revert to original order on error
      setTests(tests)
    }
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = tests.findIndex((test) => test.id === active.id)
      const newIndex = tests.findIndex((test) => test.id === over.id)
      const currentTests = [...tests];
      [currentTests[oldIndex], currentTests[newIndex]] = [
        currentTests[newIndex],
        currentTests[oldIndex],
      ]
      setTests(currentTests)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
      onDragOver={handleDragOver}
    >
      <SortableContext items={tests.map((test) => test.id)}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tests.map((test, index) => (
            <SortableTestItem
              key={test.id}
              id={test.id}
              index={index}
              test={test}
              openTest={openTest}
              handleRemoveFromCategory={handleRemoveFromCategory}
            >
              {test}
            </SortableTestItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

const createTest = async (test) => console.log('Test Created:', test)
const featuredTypes = ['modo', 'ent', 'diagnostic', 'pisa']

const TestsPage = () => {
  const [tests, setTests] = useState([])
  const [testList, setTestList] = useState([])
  const [newTest, setNewTest] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTestListModalOpen, setIsTestListModalOpen] = useState(false)
  const [categoryData, setCategoryData] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const [type, setType] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  useEffect(() => {
    if (searchParams && searchParams.get('type')) {
      setType(searchParams.get('type'))
    }
    if (searchParams && searchParams.get('category')) {
      setCategoryId(searchParams.get('category'))
    }
    if (searchParams && searchParams.get('test')) {
      setCurrentTest(searchParams.get('test'))
    }
  }, [searchParams])

  const navigate = useNavigate()

  const [testData, setTestData] = useState({ id: -1 })
  const [testLoading, setTestLoading] = useState()
  const [mode, setMode] = useState(null)
  const [currentTest, setCurrentTest] = useState(null)
  const [showTestList, setShowTestList] = useState(false)

  const formatType = (type) => {
    switch (type) {
      case 'modo':
        return 'МОДО'
      case 'ent':
        return 'ЕНТ'
      case 'diagnostic':
        return 'Функциональная грамотность'
      case 'pisa':
        return 'PISA'
      default:
        return 'Неизвестный тип'
    }
  }

  const loadTests = async () => {
    setLoading(true)

    // If only `test` param is set, load all tests and find that specific test.
    if (searchParams.get('test')) {
      console.log("Loading all tests because 'test' param is set...")
      const data = await fetchTests() // Fetch all tests
      const testId = searchParams.get('test')
      const foundTest = data.find((test) => test.id == testId)
      if (foundTest) {
        setTestData(foundTest) // Set the test data to display the modal with the correct test
        setMode('update')
        setIsModalOpen(true)
      } else {
        console.log('Test not found for ID:', testId)
      }
      setTests(data)
      setLoading(false)
      return
    }

    // If `type` and `categoryId` are both set, load tests for that category and type.
    if (!type || !categoryId) {
      console.log('Type or categoryId is not set, skipping loadTests.')
      toast.error(
        'Не указан тип тестов или категория. Пожалуйста, вернитесь во вкладку тесты.'
      )
      setLoading(false)
      return
    }

    console.log('Loading tests for type:', type, 'and categoryId:', categoryId)
    const data = await fetchTests(type, categoryId)
    console.log('Tests loaded:', data)
    setTests(data)
    setLoading(false)

    if (data.length === 0) {
      toast.info('Нет тестов в этой категории.')
    } else {
      toast.success('Тесты успешно загружены!')
    }
  }

  const loadCategoryData = async () => {
    if (!categoryId) return
    try {
      const data = await fetchTestCategory(categoryId)
      console.log('Category data loaded:', data)
      setCategoryData(data)
    } catch (error) {
      console.error('Error loading category data:', error)
      toast.error('Не удалось загрузить данные категории.')
    }
  }

  const loadAllTests = async () => {
    if (!type || !categoryId) return
    console.log('Loading all tests...')
    const data = await fetchTests(type)
    console.log('All tests loaded:', data)
    setTestList(data)
  }

  const openTestListModal = () => {
    setIsTestListModalOpen(true)
    loadAllTests()
  }

  const closeTestListModal = () => {
    setIsTestListModalOpen(false)
    loadTests()
  }

  const updateTestList = (tests) => {
    setTestList(tests)
  }

  const handleRemoveFromCategory = async (testId) => {
    if (!categoryId) return
    try {
      await removeTestFromCategory(testId, categoryId)
      setTests(tests.filter((test) => test.id !== testId))
      toast.success('Тест успешно убран из категории!')
    } catch (error) {
      console.error('Error removing test from category:', error)
      toast.error(
        'Не удалось убрать тест из категории. Пожалуйста, попробуйте позже.'
      )
    }
  }

  const handleEditTest = (index) => {
    const test = tests[index]
    setTestData(test)
    setMode('update')
    setIsModalOpen(true)
  }

  const toggleTestList = () => {
    setShowTestList(!showTestList)
  }

  useEffect(() => {
    loadTests()
  }, [type, categoryId])

  useEffect(() => {
    loadCategoryData()
  }, [categoryId])

  useEffect(() => {
    if (tests.length && searchParams.get('test')) {
      const testId = searchParams.get('test')
      const foundTest = tests.find((test) => test.id == testId)
      if (foundTest) {
        setTestData(foundTest)
        setMode('update')
        setIsModalOpen(true)
        setCurrentTest(testId)
      } else {
        console.error('Test not found for ID:', testId)
      }
    }
  }, [tests, searchParams])

  const handleTestCreate = async () => {
    if (newTest.title.trim() === '') return alert('Test title cannot be empty!')
    await createTest(newTest)
    setTests([...tests, { ...newTest, id: Date.now(), test_type: 'modo' }])
    setNewTest({ title: '', description: '' })
    setIsModalOpen(false) // Close modal after creating test
  }

  if (loading) {
    return <Loader />
  }

  let filteredTests = [...tests]

  async function openTest(testId) {
    navigate(`${testId}`)
  }

  function handleClose() {
    setIsModalOpen(false)
    setCurrentTest(null)
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams)
      newParams.delete('test') // Remove the test parameter
      return newParams
    })
  }

  function testCreationButton() {
    setIsModalOpen(true)
    setMode('creation')
    setTestData({ id: -1 })
  }

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain">
        <Link to={'/login'}>
          <Button variant="outlined" style={{ float: 'right' }}>
            Выйти
          </Button>
        </Link>

        <Typography
          variant="h5"
          style={{ fontWeight: '500', color: '#666', marginBottom: '20px' }}
        >
          Мои тесты
        </Typography>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <Link to={'/admindashboard/test-categories'}>
            <Button variant="contained">Назад</Button>
          </Link>
          <Button variant="contained" color="success" onClick={loadTests}>
            Обновить
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={openTestListModal}
          >
            Добавить существующий тест
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={toggleTestList}
          >
            {showTestList ? 'Скрыть список' : 'Показать список'}
          </Button>
          <Button variant="contained" onClick={testCreationButton}>
            Создать тест
          </Button>
        </div>
        <Typography
          variant="body1"
          style={{ marginBottom: '20px', color: '#666' }}
        >
          Тип тестов: {formatType(type)}
        </Typography>

        {showTestList ? (
          <div>
            <Typography
              variant="h6"
              style={{ marginBottom: '16px', color: '#333' }}
            >
              Список тестов (перетащите для изменения порядка)
            </Typography>
            <TestList
              tests={filteredTests}
              openTest={openTest}
              handleRemoveFromCategory={handleRemoveFromCategory}
              setTests={setTests}
              categoryId={categoryId}
              type={type}
            />
          </div>
        ) : (
          <Grid container spacing={2}>
            {filteredTests.length > 0 &&
              filteredTests.map((test) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={test.id}>
                  <Card style={{ cursor: 'pointer', height: '100%' }}>
                    <CardContent
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <Typography variant="h6" style={{ color: 'black' }}>
                        {test.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: '#666', flexGrow: 1 }}
                      >
                        Описание: {test.description}
                      </Typography>
                      <Button
                        onClick={() => openTest(test.id)}
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '8px' }}
                      >
                        Открыть тест
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        style={{ marginTop: '8px' }}
                        onClick={() => {
                          handleRemoveFromCategory(test.id)
                        }}
                      >
                        Убрать из категории
                      </Button>
                      <br />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
        {isModalOpen && (
          <TestCreationModal
            mode={mode}
            testData={testData}
            categoryData={categoryData}
            onClose={handleClose}
          />
        )}
        {isTestListModalOpen && (
          <TestsListModal
            onClose={closeTestListModal}
            tests={testList}
            categoryId={categoryId}
            type={type}
            updateTestList={updateTestList}
            formatType={formatType}
          />
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default TestsPage
