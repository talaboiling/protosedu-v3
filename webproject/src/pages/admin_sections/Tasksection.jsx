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
  updateChapterContents,
  createNode,
  getNodes,
  addTaskToNode,
} from "../../utils/apiService";
import ToolsBar from "./tasks/ToolsBar";
import QuestionModal from "./tasks/QuestionModal";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import DraggableDroppableTask from "./DraggableDroppableTask";
import QuestionsList from "./QuestionsList";
import { useLocation } from "react-router-dom";
import Modal from "../../helpers/Modal";
import { toast } from "react-toastify";
import ContentNode from "./ContentNode";

const Tasksection = () => {
  const { courseId, sectionId, chapterId } = useParams();
  const [contents, setContents] = useState([]);
  const [chapter, setChapter] = useState();
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNodeModal, setShowNodeModal] = useState(false);
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
  const [selectedTask, setSelectedTask] = useState(null);
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
  console.log(questions, taskDetails);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [move, setMove] = useState(false);

  const [nodes, setNodes] = useState([]);
  const [addTaskMode, setAddTaskMode] = useState(null);

  console.log(contents);
  console.log(nodes);
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
    const fetchNodes = async () => {
      const payload = { courseId, sectionId, chapterId };
      const nodes = await getNodes(payload);
      setNodes(nodes);
    }

    fetchContentsData();
    fetchNodes();
  }, [courseId, sectionId, chapterId]);


  const location = useLocation();

  useEffect(() => {
    if (!location.hash || contents.length === 0) return;

    const id = location.hash.replace("#", "");
    const tryScroll = (retries = 10) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (retries > 0) {
        setTimeout(() => tryScroll(retries - 1), 300); // retry every 300ms
      }
    };

    tryScroll();
  }, [contents, location.hash]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      ...taskDetails,
      section: sectionId,
      order: contents.length + 1,
    };

    if (formNode) {
      taskData["content-node"] = formNode.id;
    }

    try {
      let updatedContents;
      if (isEditingTask) {
        const updatedTask = await updateTask(
          courseId,
          sectionId,
          chapterId,
          selectedTask.id,
          taskData
        );
        updatedContents = contents.map((content) =>
          content.id === selectedTask.id ? updatedTask : content
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

  const handleAddTaskToNode = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const task = formData.get("task");
    const nodeId = formNode.id;
    const payload = {
      courseId,
      sectionId,
      chapterId,
      nodeId,
      task
    }
    try {
      const data = await addTaskToNode(payload);
      console.log("Success:", data);
      toast.success('Сохранено');
    } catch (error) {
      toast.error('Ошибка');
      console.error("Error submitting node:", error);
    }
  }

  const handleEditTask = (task) => {
    if (!task.content_node) {
      setFormNode(null);
    }
    setSelectedTask(task);
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
      // "content-node": formNode.id || null
    };

    let updatedContents;
    if (isEditingVideo) {
      console.log("Updating existing lesson with ID:", selectedTask.id);
      console.log("Updated video details:", updatedVideoDetails);
      const updatedLesson = await updateLesson(
        courseId,
        sectionId,
        chapterId,
        selectedTask.id,
        updatedVideoDetails
      );
      updatedContents = contents.map((content) =>
        content.id === selectedTask.id ? updatedLesson : content
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

  const handleNodeSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const clickedButton = event.nativeEvent.submitter;

    const videoId = formData.get("video");
    const taskId = formData.get("task");
    const title = formData.get("title");
    const description = formData.get("description");

    const payload = {
      videoId, taskId, courseId, sectionId, chapterId, title, description
    };

    if (clickedButton.name === "createFromBlank") {
      payload.videoId = null;
      payload.taskId = null;
    }
    try {
      const data = await createNode(payload);
      console.log("Success:", data);
      toast.success('Сохранено')
    } catch (error) {
      toast.error('Ошибка');
      console.error("Error submitting node:", error);
    }
  }

  const resetVideoDetails = () => {
    setVideoDetails({
      video_url: "",
      title: "",
      description: "",
    });
    setIsEditingVideo(false);
  };

  const openLesson = (lesson) => {
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

  const handleTaskClick = async (task) => {
    const taskId = task.id;
    setSelectedTask(task);
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
      formData.append("correct_answer", JSON.stringify({ answer: currentQuestion.correct_answer }));
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
      formData.append("correct_answer", JSON.stringify({ answer: currentQuestion.correct_answer }));
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
          selectedTask.id,
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
          selectedTask.id,
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

  const handleEditContent = (content) => {
    setSelectedTask(content);
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
        selectedTask.id,
        questionId
      );
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Failed to delete question", error);
    }
  };

  const [formNode, setFormNode] = useState(null);

  if (loading) {
    return <Loader />;
  };

  const seperateContents = contents.filter(content => {
    return nodes.every(node => node.task !== content.id && node.lesson !== content.id)
  });

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const draggableTaskIndex = active.data.current.index;
    const droppableTaskIndex = over.data.current.index;
    active.data.index = droppableTaskIndex;
    over.data.index = draggableTaskIndex;
    const draggableContent = seperateContents[draggableTaskIndex];
    const droppableContent = seperateContents[droppableTaskIndex];
    draggableContent.order = droppableTaskIndex + 1;
    droppableContent.order = draggableTaskIndex + 1;
    seperateContents[droppableTaskIndex] = draggableContent;
    seperateContents[draggableTaskIndex] = droppableContent;

    const previousTasks = [...seperateContents];
    console.log(seperateContents);
    console.log(active, over);
    setContents(seperateContents);

    try {
      console.log(seperateContents);
      const response = await updateChapterContents(courseId, sectionId, chapterId, seperateContents);
      console.log(response);
      console.log('New order saved to backend');
      return true;
    } catch (error) {
      console.error('Error saving tasks order:', error);
      setContents(previousTasks);
    }
  };

  const containerWidth = 800;
  const itemWidth = 225;
  const baseRowHeight = 90;
  const xOffset = 285;
  const yOffset = 150;

  console.log(contents);

  const handleAddVideoButton = (node = null) => {
    if (node) {
      setFormNode(node);
    }
    setShowVideoModal(true);
    resetVideoDetails();
  };

  const handleAddTaskButton = (node = null) => {
    if (node) {
      setFormNode(node);
    }
    setShowTaskModal(true);
    setTaskDetails({
      title: "",
      description: "",
    });
  }

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
          <Link to={"/admindashboard/tasks"} style={{ color: "black" }}>
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
            <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666", marginRight: "20px" }}>
              {'>'} {section.title}
            </p>
          </Link>
          <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
            {'>'} {chapter.title}
          </p>

        </div>

        <div className="superCont sectCont" style={{ position: "relative", margin: "2rem", padding: "100px" }}>
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
              style={{
                margin: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <p style={{ margin: 0 }}>Пары</p>
            </div>
          </div>
          <button
            className="adderBtn"
            style={{ position: "absolute", right: "0px", top: "0px", width: "fit-content" }}
            onClick={() => {
              setShowNodeModal(true);
            }}
          >
            Урок
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {nodes.length > 0 && nodes.map(node => {
              const lessonId = node.lesson;
              const taskId = node.task;
              const lesson = contents.find(content => content.content_type === "lesson" && content.id === lessonId);
              const task = contents.find(content => content.content_type === "task" && content.id === taskId);
              return <ContentNode
                node={node}
                video={lesson}
                task={task}
                handleEditContent={handleEditContent}
                handleEditTask={handleEditTask}
                openLesson={openLesson}
                handleTaskClick={handleTaskClick}
                handleAddTaskButton={handleAddTaskButton}
                handleAddVideoButton={handleAddVideoButton}
              />
            })}
          </div>
        </div>
        <div className="superCont sectCont" style={{ padding: "100px", position: "relative" }}>
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
              onClick={() => setMove(prev => !prev)}
              style={{
                margin: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                color: move ? "green" : "",
                cursor: "pointer"
              }}
            >
              <Hand size={20} />
              <p style={{ margin: 0 }}>Move elements</p>
            </div>
          </div>
          <div style={{
            position: "relative",
            width: containerWidth,
            height: 1200,
            margin: "0 auto"
          }}>
            <DndContext onDragEnd={handleDragEnd}>
              {seperateContents &&
                seperateContents.map((content, contentIndex) => {
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
                    htmlId={`task-${content.id}`}
                  />
                })
              }
            </DndContext>
          </div>
          <div className="taskAdder" style={{ position: "absolute", right: "50px", top: "50px" }}>
            <button
              className="adderBtn"
              onClick={handleAddVideoButton}
            >
              Видеоурок
            </button>
            <button
              className="adderBtn"
              onClick={handleAddTaskButton}
            >
              Задание
            </button>
            <button
              className="adderBtn"
              onClick={() => {
                setShowNodeModal(true);
              }}
            >
              Урок
            </button>
          </div>
        </div>

      </div>
      {showNodeModal && (
        <dialog
          open={showNodeModal}
          onClose={() => setShowNodeModal(false)}
          className="modal supermodal"
          style={{ padding: "60px" }}
        >
          <div className="modal-content">
            <div className="modalHeader">
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  padding: "0",
                }}
                onClick={() => setShowNodeModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
            </div>
            <form onSubmit={handleNodeSubmit}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="title">Title</label>
                <input id="title" name="title" style={{ width: "200px" }} />
                <label htmlFor="description">Description</label>
                <input id="description" name="description" style={{ width: "200px" }} />
                <label htmlFor="video">Video</label>
                <select name="video" style={{ width: "fit-content" }}>
                  {seperateContents.map(content => {
                    if (content.content_type === "lesson") {
                      return <option value={content.id}><p>{content.title}: {content.description}</p></option>
                    }
                  })}
                </select>
                <label htmlFor="task">Task</label>
                <select name="task" style={{ width: "fit-content" }}>
                  {seperateContents.map(content => {
                    if (content.content_type === "task") {
                      return <option value={content.id}><p>{content.title}: {content.description}</p></option>
                    }
                  })}
                </select>
              </div>
              <button
                type="submit"
                className="superBtn"
                style={{ marginTop: "30px" }}
                name="createWithExisting"
              >
                {isEditingVideo ? "Сохранить" : "Добавить"}
              </button>
              <button
                type="submit"
                className="superBtn"
                style={{ marginTop: "30px" }}
                name="createFromBlank"
              >
                Добавить пустой
              </button>
            </form>
          </div>
        </dialog>
      )}
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
            <form onSubmit={addTaskMode === "existing" ? handleAddTaskToNode : handleTaskSubmit}>
              <div className="formVideo" style={{ display: "flex", flexDirection: "column" }}>
                <label htmlFor="mode">Как вы хотите добавить задание:</label>
                <select
                  name="mode"
                  style={{ width: "fit-content" }}
                  onChange={e => setAddTaskMode(e.target.value)}
                >
                  <option value="new">Создать новый</option>
                  <option value="existing">Взять с существующих</option>
                </select>
                {addTaskMode !== 'existing' && (
                  <>
                    <label htmlFor="taskTitle">Название задания:</label>
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

                    <label htmlFor="taskDescription">Описание задания:</label>
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
                  </>)}
                {addTaskMode === "existing" && (
                  <>
                    <label htmlFor="task">Задача</label>
                    <select
                      name="task"
                      style={{ width: "fit-content" }}
                    >
                      {seperateContents
                        .filter(content => content.content_type === "task")
                        .map(content => <option value={content.id}><p>{content.title}: {content.description}</p></option>)
                      }
                    </select>
                  </>
                )}
                {!formNode && !isEditingTask && <label htmlFor="node">Пара</label>}
                {!formNode && !isEditingTask && (
                  <select
                    name="node"
                    style={{ width: "fit-content" }}
                    onChange={(e) => {
                      const selectedNode = nodes.find((node) => node.id === parseInt(e.target.value));
                      if (selectedNode) {
                        console.log(selectedNode);
                        setFormNode(selectedNode);
                      }
                    }}
                  >
                    <option></option>
                    {nodes.map(node => {
                      if (!node.task) {
                        return <option value={node.id}><p>{node.title}: {node.description}</p></option>
                      }
                    })}
                  </select>
                )}
                {formNode && <p>{formNode.title}: {formNode.description}</p>}
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
                {selectedTask !== null && questions.length > 0 && (
                  <QuestionsList
                    questions={questions}
                    handleEditQuestion={handleEditQuestion}
                    handleDeleteQuestion={handleDeleteQuestion}
                    setQuestions={setQuestions}
                    metaData={{ courseId, sectionId, chapterId }}
                  />
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
