import React, { useEffect, useState } from "react";
import Superside from "../admin_components/Superside";
import { useParams, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import bgtask from "../../assets/bgtask.svg";
import bgvideo from "../../assets/videolessonthumb.svg";
import Loader from "../Loader";
import { Hand } from "lucide-react";

import {
  fetchContents,
  createLesson,
  updateLesson,
  deleteLesson,
  createTask,
  updateTask,
  deleteTask,
  fetchChapter,
  fetchSection,
  fetchCourse,
  fetchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../utils/apiService";
import ToolsBar from "./tasks/ToolsBar";
import QuestionModal from "./tasks/QuestionModal";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import DraggableDroppableTask from "./DraggableDroppableTask";

const Tasksection = () => {
  const { courseId, sectionId, chapterId } = useParams();
  const [contents, setContents] = useState([]);
  const [chapter, setChapter] = useState();
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
  });
  const [videoDetails, setVideoDetails] = useState({
    video_url: "",
    title: "",
    description: "",
  });
  const [questions, setQuestions] = useState([]);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    question_type: "",
    template: "",
    title: "",
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
    images: ["", "", "", ""],
    drag_answers: ["", "", "", ""],
    imagesToUpdate: {},
    audio: null, // Add this line
  });
  console.log(questions)
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [move, setMove] = useState(false);

  useEffect(() => {
    const fetchContentsData = async () => {
      try {
        const contentsData = await fetchContents(courseId, sectionId, chapterId);
        setContents(contentsData);
        const chapterData = await fetchChapter(courseId, sectionId, chapterId);
        setChapter(chapterData);
        const sectionData = await fetchSection(courseId, sectionId);
        setSection(sectionData);
        const courseData = await fetchCourse(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error("Failed to fetch contents", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentsData();
  }, [courseId, sectionId, chapterId]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      ...taskDetails,
      section: sectionId,
      order: contents.length + 1,
    };

    try {
      let updatedContents;
      if (isEditingTask) {
        const updatedTask = await updateTask(
          courseId,
          sectionId,
          chapterId,
          contents[selectedTaskIndex].id,
          taskData
        );
        updatedContents = contents.map((content, index) =>
          index === selectedTaskIndex ? updatedTask : content
        );
      } else {
        const newTask = await createTask(courseId, sectionId, chapterId, taskData);
        updatedContents = [...contents, newTask];
      }

      setContents(updatedContents);
      setShowTaskModal(false);
      resetTaskDetails();
    } catch (error) {
      console.error("Failed to create or update task", error);
    }
  };

  const handleEditTask = (index) => {
    const task = contents[index];
    setSelectedTaskIndex(index);
    setTaskDetails({
      title: task.title,
      description: task.description,
    });
    setIsEditingTask(true);
    setShowTaskModal(true);
  };

  const resetTaskDetails = () => {
    setTaskDetails({
      title: "",
      description: "",
    });
    setIsEditingTask(false);
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const updatedVideoDetails = {
      ...videoDetails,
      content_type: "lesson",
      order: contents.length + 1,
      chapter: chapterId,
    };

    let updatedContents;
    if (isEditingVideo) {
      const updatedLesson = await updateLesson(
        courseId,
        sectionId,
        chapterId,
        contents[selectedTaskIndex].id,
        updatedVideoDetails
      );
      updatedContents = contents.map((content, index) =>
        index === selectedTaskIndex ? updatedLesson : content
      );
    } else {
      const newLesson = await createLesson(
        courseId,
        sectionId,
        chapterId,
        updatedVideoDetails
      );
      updatedContents = [...contents, newLesson];
    }

    setContents(updatedContents);
    setShowVideoModal(false);
    resetVideoDetails();
  };

  const resetVideoDetails = () => {
    setVideoDetails({
      video_url: "",
      title: "",
      description: "",
    });
    setIsEditingVideo(false);
  };

  const openLesson = (index) => {
    const lesson = contents[index];
    if (lesson.video_url) {
      window.open(lesson.video_url, "_blank");
    }
  };

  const handleDeleteContent = async (id, type) => {
    if (window.confirm("Вы действительно хотите удалить этот элемент?")) {
      let updatedContents;
      if (type === "lesson") {
        await deleteLesson(courseId, sectionId, chapterId, id);
        updatedContents = contents.filter((content) => content.id !== id);
      } else if (type === "task") {
        await deleteTask(courseId, sectionId, chapterId, id);
        updatedContents = contents.filter((content) => content.id !== id);
      }

      setContents(updatedContents);
    }
  };

  const fetchTaskQuestions = async (taskId) => {
    const response = await fetchQuestions(courseId, sectionId, chapterId, taskId);
    return response;
  };

  const handleTaskClick = async (index) => {
    const taskId = contents[index].id;
    setSelectedTaskIndex(index);
    setLoading(true);
    try {
      const taskQuestions = await fetchTaskQuestions(taskId);
      setQuestions(taskQuestions);
      setShowQuestionsModal(true);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e, content) => {
    e.preventDefault();
    console.log(content)
    setLoading(true);

    const formData = new FormData();
    formData.append("title", currentQuestion.title);
    formData.append("question_text", currentQuestion.question_text);
    formData.append("question_type", currentQuestion.question_type);
    formData.append("template", currentQuestion.template);
    Object.entries(currentQuestion).forEach(([key, value]) => {
      if (key.startsWith("canvasImage_")) {
        formData.append(key, value);
      }
    });
    console.log(formData.entries());
    if (currentQuestion.audio && currentQuestion.audio instanceof File) {
      formData.append("audio", currentQuestion.audio);
    }

    if (currentQuestion.question_type === "multiple_choice_text") {
      const options = currentQuestion.options.map((option, idx) => ({
        id: idx + 1,
        value: option,
      }));
      formData.append("options", JSON.stringify(options));
      formData.append("correct_answer", currentQuestion.correct_answer);
    }

    if (currentQuestion.question_type === "multiple_choice_images") {
      if (Object.keys(currentQuestion.imagesToUpdate || {}).length > 0) {
        Object.keys(currentQuestion.imagesToUpdate).forEach((key) => {
          formData.append(`image_${key}`, currentQuestion.imagesToUpdate[key]);
        });
      }
      formData.append("correct_answer", currentQuestion.correct_answer);
    }

    if (currentQuestion.question_type === "click_image" || currentQuestion.question_type === "input_text") {
      formData.append("correct_answer", JSON.stringify({answer: currentQuestion.correct_answer}));
    }

    if (currentQuestion.question_type === "drag_and_drop_text") {
      const options = currentQuestion.options.map((option, idx) => ({
        id: idx + 1,
        value: option,
      }));
      formData.append("options", JSON.stringify(options));
      const filteredDragAnswers = currentQuestion.drag_answers
        .map((order, idx) => {
          const orderNum = parseInt(order, 10);
          return order !== "" &&
            orderNum > 0 &&
            orderNum <= currentQuestion.options.length
            ? { order: orderNum, id: idx + 1 }
            : null;
        })
        .filter((answer) => answer !== null)
        .sort((a, b) => a.order - b.order)
        .map((answer) => answer.id);
      formData.append("correct_answer", JSON.stringify({answer: currentQuestion.correct_answer}));
    }

    if (currentQuestion.question_type === "drag_and_drop_images") {
      if (Object.keys(currentQuestion.imagesToUpdate || {}).length > 0) {
        Object.keys(currentQuestion.imagesToUpdate).forEach((key) => {
          formData.append(`image_${key}`, currentQuestion.imagesToUpdate[key]);
        });
      }
      const filteredDragAnswers = currentQuestion.drag_answers
        .map((order, idx) => {
          const orderNum = parseInt(order, 10);
          return order !== "" &&
            orderNum > 0 &&
            orderNum <= currentQuestion.images.length
            ? { order: orderNum, id: idx + 1 }
            : null;
        })
        .filter((answer) => answer !== null)
        .sort((a, b) => a.order - b.order)
        .map((answer) => answer.id);
      formData.append("correct_answer", JSON.stringify(filteredDragAnswers));
    }

    try {
      let response;
      if (editingQuestionIndex !== null) {
        response = await updateQuestion(
          courseId,
          sectionId,
          chapterId,
          contents[selectedTaskIndex].id,
          questions[editingQuestionIndex].id,
          formData,
          true // Indicate that this is a multipart request
        );
        const updatedQuestions = questions.map((q, i) =>
          i === editingQuestionIndex ? response : q
        );
        setQuestions(updatedQuestions);
      } else {
        response = await createQuestion(
          courseId,
          sectionId,
          chapterId,
          contents[selectedTaskIndex].id,
          formData,
          content,
          true // Indicate that this is a multipart request
        );
        setQuestions([...questions, response]);
      }
      setShowQuestionModal(false);
      resetQuestionForm();
    } catch (error) {
      console.error("Failed to save question", error);
    } finally {
      setLoading(false);
    }
  };


  const resetQuestionForm = () => {
    setCurrentQuestion({
      question_type: "multiple_choice_text",
      template: "",
      title: "",
      question_text: "",
      options: ["", "", "", ""],
      correct_answer: "",
      images: ["", "", "", ""],
      drag_answers: ["", "", "", ""],
      audio: null,
    });
    setEditingQuestionIndex(null);
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];

    // Update the currentQuestion options with the new file
    const updatedImages = [...currentQuestion.options];
    updatedImages[index] = file;

    // Append the new file to imagesToUpdate
    const updatedImagesToUpdate = {
      ...currentQuestion.imagesToUpdate,
      [index + 1]: file,
    };

    setCurrentQuestion({
      ...currentQuestion,
      options: updatedImages,
      imagesToUpdate: updatedImagesToUpdate,
    });
  };

  const handleSelectCorrectAnswer = (optionIndex) => {
    setCurrentQuestion({
      ...currentQuestion,
      correct_answer: optionIndex + 1, // Store as a 1-based index
    });
  };

  const handleEditQuestion = (index) => {
    const question = questions[index];
    console.log(question.audio);
    const formattedOptions = Array.isArray(question.options)
      ? question.options
      : [];
    const formattedImages = Array.isArray(question.images)
      ? question.images
      : [];

    setCurrentQuestion({
      ...question,
      options:
        formattedOptions.length > 0
          ? formattedOptions.map((opt) => opt.value)
          : ["", "", "", ""],
      images:
        formattedImages.length > 0
          ? formattedImages.map((img) => img.image)
          : ["", "", "", ""],
      correct_answer: question.correct_answer,
      drag_answers: Array.isArray(question.correct_answer)
        ? question.correct_answer
        : ["", "", "", ""],
      audio: question.audio || null, // Add this line
    });
    setEditingQuestionIndex(index);
    setShowQuestionModal(true);
  };

  const handleEditContent = (index) => {
    const content = contents[index];
    setSelectedTaskIndex(index);
    setVideoDetails(content);
    setIsEditingVideo(true);
    setShowVideoModal(true);
  };

  const handleDeleteQuestion = async (index) => {
    const questionId = questions[index].id;
    try {
      await deleteQuestion(
        courseId,
        sectionId,
        chapterId,
        contents[selectedTaskIndex].id,
        questionId
      );
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Failed to delete question", error);
    }
  };

  if (loading) {
    return <Loader />;
  };

  function handleDragEnd(event){
    const {active, over} = event;
    console.log(active, over);
    if (!over){
      return;
    }

    const draggableTaskIndex = active.data.current.index;
    const droppableTaskIndex = over.data.current.index;
    const currentTasks = [...contents];
    active.data.index = droppableTaskIndex;
    over.data.index = draggableTaskIndex;
    const draggableContent = currentTasks[draggableTaskIndex];
    const droppableContent = currentTasks[droppableTaskIndex];
    currentTasks[droppableTaskIndex] = draggableContent;
    currentTasks[draggableTaskIndex] = droppableContent;
    setContents(currentTasks);
  };

  const containerWidth = 800;
  const itemWidth = 225;
  const baseRowHeight = 90;
  const xOffset = 285;
  const yOffset = 150;

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain">
        <Link to={"/login"}>
          <button
            style={{
              border: "none",
              borderRadius: "4px",
              backgroundColor: "transparent",
              color: "#444",
              fontSize: "large",
              float: "right",
            }}
          >
            Выйти
          </button>
        </Link>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Link to={"/admindashboard/tasks"} style={{color:"black"}}>
            <p
              className="defaultStyle"
              style={{
                padding: "10px 25px",
                borderRadius: "20px",
                backgroundColor: "lightgray",
                marginRight: "20px",
              }}
            >
              {course.name} ({course.grade} класс)
            </p>
          </Link>
          <Link to={`/admindashboard/tasks/courses/${course.id}/sections/${section.id}`}>
            <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" , marginRight:"20px"}}>
              {'>'} {section.title}
            </p>
          </Link>
          <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
            {'>'} {chapter.title}
          </p>
          
        </div>

        <div className="superCont sectCont" style={{padding: "100px", position: "relative"}}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '20%',
                padding: '8px 10px',
                background: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
                color: '#fff',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px'
              }}
            >
              <div 
                onClick={()=>setMove(prev=>!prev)} 
                style={{
                  margin: 0, 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: 8,
                  color: move ? "green": "",
                  cursor: "pointer"
                }}
              >
                <Hand size={20}/>
                <p style={{margin: 0}}>Move elements</p>
              </div>
            </div>
          <div style={{
            position: "relative",
            width: containerWidth,
            height: 1200,
            margin: "0 auto"
          }}>
            <DndContext onDragEnd={handleDragEnd}>
              {contents &&
                contents.map((content, contentIndex) => {
                  return <DraggableDroppableTask
                    key={contentIndex}
                    content={content}
                    contentIndex={contentIndex}
                    xOffset={xOffset}
                    itemWidth={itemWidth}
                    containerWidth={containerWidth}
                    yOffset={yOffset}
                    openLesson={openLesson}
                    handleEditContent={handleEditContent}
                    handleTaskClick={handleTaskClick}
                    handleEditTask={handleEditTask}
                    handleDeleteContent={handleDeleteContent}
                    move={move}
                  />
                })
              }
            </DndContext>
          </div>
          <div className="taskAdder" style={{position: "absolute", right: "50px", top: "50px"}}>
            <button
              className="adderBtn"
              onClick={() => {
                setShowVideoModal(true);
                resetVideoDetails();
              }}
            >
              Видеоурок
            </button>
            <button
              className="adderBtn"
              onClick={() => {
                setShowTaskModal(true);
                setTaskDetails({
                  title: "",
                  description: "",
                });
              }}
            >
              Задание
            </button>
          </div>
        </div>

      </div>

      {showVideoModal && (
        <dialog
          open={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          className="modal supermodal"
          style={{ padding: "60px" }}
        >
          <div className="modal-content">
            <div className="modalHeader">
              <h2 className="defaultStyle" style={{ color: "#666" }}>
                {isEditingVideo
                  ? "Редактировать видеоурок"
                  : "Добавить видеоурок"}
              </h2>
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  padding: "0",
                }}
                onClick={() => setShowVideoModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
            </div>
            <form onSubmit={handleVideoSubmit}>
              <div className="formVideo">
                <label htmlFor="videoUrl">URL видео:</label>
                <label htmlFor="videoName">Название видео:</label>
                <input
                  type="text"
                  id="videoUrl"
                  value={videoDetails.video_url}
                  placeholder="https://www.youtube.com/watch?=..."
                  onChange={(e) =>
                    setVideoDetails({
                      ...videoDetails,
                      video_url: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  id="videoName"
                  value={videoDetails.title}
                  onChange={(e) =>
                    setVideoDetails({
                      ...videoDetails,
                      title: e.target.value,
                    })
                  }
                  required
                />
                <span>
                  <label htmlFor="videoDescription">Описание:</label>
                  <br />
                  <textarea
                    id="videoDescription"
                    value={videoDetails.description}
                    onChange={(e) =>
                      setVideoDetails({
                        ...videoDetails,
                        description: e.target.value,
                      })
                    }
                    style={{ width: "300px", height: "100px" }}
                    required
                  />
                  <br />
                </span>
              </div>
              <button
                type="submit"
                className="superBtn"
                style={{ marginTop: "30px" }}
              >
                {isEditingVideo ? "Сохранить" : "Добавить"}
              </button>
            </form>
          </div>
        </dialog>
      )}

      {showTaskModal && (
        <dialog
          open={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          className="modal supermodal"
          style={{ padding: "60px" }}
        >
          <div className="modal-content">
            <div className="modalHeader">
              <h2 className="defaultStyle" style={{ color: "#666" }}>
                Добавить задание
              </h2>
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  padding: "0",
                }}
                onClick={() => setShowTaskModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
            </div>
            <form onSubmit={handleTaskSubmit}>
              <div className="formVideo">
                <label htmlFor="taskTitle">Название задания:</label>
                <label htmlFor="taskDescription">Описание задания:</label>
                <input
                  type="text"
                  id="taskTitle"
                  value={taskDetails.title}
                  onChange={(e) =>
                    setTaskDetails({
                      ...taskDetails,
                      title: e.target.value,
                    })
                  }
                  required
                />

                <textarea
                  id="taskDescription"
                  value={taskDetails.description}
                  onChange={(e) =>
                    setTaskDetails({
                      ...taskDetails,
                      description: e.target.value,
                    })
                  }
                  style={{ width: "300px", height: "40px" }}
                />
              </div>
              <button
                type="submit"
                className="superBtn"
                style={{ marginTop: "30px" }}
              >
                Создать
              </button>
            </form>
          </div>
        </dialog>
      )}

      {showQuestionsModal && (
        <dialog
          open={showQuestionsModal}
          onClose={() => setShowQuestionsModal(false)}
          className="modal supermodal"
          style={{ padding: "60px" }}
        >
          {loading ? (
            <Loader />
          ) : (
          <div className="modal-content">
            <div className="modalHeader">
              <h2 className="defaultStyle" style={{ color: "#666" }}>
                Вопросы задания
              </h2>
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  padding: "0",
                }}
                onClick={() => setShowQuestionsModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
            </div>
            <button
                onClick={() => {
                  setCurrentQuestion({
                    question_type: "",
                    template: "",
                    title: "",
                    question_text: "",
                    options: ["", "", "", ""],
                    correct_answer: "",
                    images: ["", "", "", ""],
                    drag_answers: ["", "", "", ""],
                  });
                  setEditingQuestionIndex(null);
                  setShowQuestionModal(true);
                }}
                className="adderBtn"
                style={{ marginTop: "20px" }}
              >
                Добавить вопрос
              </button>
            <div className="questionsList">
              
              {selectedTaskIndex !== null && questions.length > 0 && (
                <ul>
                  {questions.map((question, index) => (
                    <li
                      key={index}
                      onClick={() => handleEditQuestion(index)}
                      className="questions"
                    >
                      <p className="defaultStyle">{index + 1}.</p>
                      {question.title || `Вопрос ${index + 1}`}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(index);
                        }}
                        className="transBtn"
                        style={{ paddingTop: "3px" }}
                      >
                        <DeleteForeverIcon sx={{ color: "darkred" }} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              
            </div>
          </div>
          )}
        </dialog>
      )}

      {showQuestionModal && (
        <QuestionModal 
          showQuestionModal={showQuestionModal} 
          setShowQuestionModal={setShowQuestionModal}
          setCurrentQuestion={setCurrentQuestion}
          loading={loading}
          editingQuestionIndex={editingQuestionIndex}
          currentQuestion={currentQuestion}
          handleSelectCorrectAnswer={handleSelectCorrectAnswer}
          handleQuestionSubmit={handleQuestionSubmit}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

export default Tasksection;
