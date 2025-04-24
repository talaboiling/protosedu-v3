import React, { useState, useEffect } from "react";
import Superside from "../admin_components/Superside";
import { Link, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  createSections,
  updateSection,
  fetchCourse,
} from "../../utils/apiService";

import Loader from "../Loader";

const Tasks = () => {
  const [showModal, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseGrade, setCourseGrade] = useState("");
  const [courseLanguage, setCourseLanguage] = useState("");
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await fetchCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCourseName("");
    setCourseDesc("");
    setCourseGrade("");
    setCourseLanguage("");
    setSections([]);
    setEditingCourseId(null);
  };

  const handleAddSection = () => {
    const newSection = {
      id: `temp-id-${sections.length}`, // Temporary ID for client-side handling
      title: "",
      description: "",
      order: sections.length + 1, // Set the order to the next available index
    };
    setSections([...sections, newSection]);
  };

  const handleDeleteSection = (id) => {
    const updatedSections = sections.filter((section) => section.id !== id);
    // Reorder the remaining sections
    const reorderedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index + 1,
    }));
    setSections(reorderedSections);
  };

  const handleSectionChange = (id, field, value) => {
    const updatedSections = sections.map((section) => {
      if (section.id === id) {
        return { ...section, [field]: value };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // Update order based on the new position
    const reorderedSections = items.map((section, index) => ({
      ...section,
      order: index + 1,
    }));
    setSections(reorderedSections);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!courseName.trim() || !courseGrade.trim()) {
      alert("Course name and grade cannot be empty");
      return;
    }

    const nonEmptySections = sections.filter((section) => section.title.trim());

    const newCourse = {
      name: courseName,
      description: courseDesc,
      grade: parseInt(courseGrade),
      language: courseLanguage,
    };

    try {
      let savedCourse;
      if (editingCourseId) {
        savedCourse = await updateCourse(editingCourseId, newCourse);
        const updatedCourses = courses.map((course) =>
          course.id === editingCourseId ? savedCourse : course
        );
        setCourses(updatedCourses);
      } else {
        savedCourse = await createCourse(newCourse);
        setCourses([...courses, savedCourse]);
      }

      // Save sections
      const sectionsToCreate = [];
      for (const section of nonEmptySections) {
        const sectionId = section.id.toString();
        if (sectionId && !sectionId.startsWith("temp-id-")) {
          await updateSection(savedCourse.id, sectionId, {
            title: section.title,
            description: section.description,
            order: section.order,
          });
        } else {
          sectionsToCreate.push({
            title: section.title,
            description: section.description,
            order: section.order,
          });
        }
      }
      if (sectionsToCreate.length > 0) {
        await createSections(savedCourse.id, sectionsToCreate);
      }

      // Fetch updated course data to reflect changes in the UI
      const updatedCourse = await fetchCourse(savedCourse.id);
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === savedCourse.id ? updatedCourse : course
        )
      );

      handleClose();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleEditCourse = (id) => {
    const courseToEdit = courses.find((course) => course.id === id);
    setCourseName(courseToEdit.name);
    setCourseDesc(courseToEdit.description);
    setCourseGrade(courseToEdit.grade.toString());
    setCourseLanguage(courseToEdit.language);
    setSections(courseToEdit.sections || []);
    setEditingCourseId(id);
    setOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (window.confirm("Вы действительно хотите удалить этот курс?")) {
      try {
        await deleteCourse(editingCourseId);
        const updatedCourses = courses.filter(
          (course) => course.id !== editingCourseId
        );
        setCourses(updatedCourses);
        handleClose();
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleNavigateToSection = (courseId, sectionId) => {
    navigate(`/admindashboard/tasks/courses/${courseId}/sections/${sectionId}`);
  };

  if (loading) {
    return <Loader></Loader>;
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

        <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
          Мои курсы
        </p>
        <div className="superCont coursesList">
          <button className="courseAdder" onClick={handleClickOpen}>
            <AddIcon sx={{ fontSize: 50 }} />
            Создать курс
          </button>

          {courses.map((course) => (
            <div key={course.id} className="addedCourses">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <h3
                  className="defaultStyle"
                  style={{ fontSize: "x-large", color: "black" }}
                >
                  {course.name}
                </h3>
                <p className="defaultStyle" style={{ color: "#666" }}>
                  {course.grade} класс
                </p>
                <p className="defaultStyle" style={{ color: "#666" }}>
                  {course.description}
                </p>
              </div>

              <ul className="sectListInfo">
                {course.sections.map((section, index) => (
                  <li
                    className="sectionsInfo"
                    key={section.id}
                    onClick={() =>
                      handleNavigateToSection(course.id, section.id)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <span>{index + 1}.</span>
                    {section.title}
                  </li>
                ))}
              </ul>
              <button
                className="superBtn"
                onClick={() => handleEditCourse(course.id)}
              >
                <EditIcon />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <dialog
          open={showModal}
          onClose={handleClose}
          className="modal supermodal"
          style={{ padding: "60px" }}
        >
          <div className="modal-content">
            <button
              style={{
                border: "none",
                float: "right",
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: "0",
              }}
              onClick={handleClose}
            >
              <CloseIcon sx={{ color: "gray" }} />
            </button>
            <h2 className="defaultStyle" style={{ color: "#666" }}>
              {editingCourseId ? "Редактировать курс" : "Добавить курс"}
            </h2>
            <form className="registrationInput" onSubmit={handleFormSubmit}>
              <div className="formCont">
                <div className="formLeft">
                  <label htmlFor="courseName">Название курса:</label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Математика"
                    required
                  />{" "}
                  <label htmlFor="courseDesc">Описание курса</label>
                  <input
                    type="text"
                    id="courseDesc"
                    name="courseDesc"
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    placeholder="Описание курса"
                  />
                  <label htmlFor="courseGrade">Выберите уровень</label>
                  <select
                    type="text"
                    id="courseGrade"
                    name="courseGrade"
                    value={courseGrade}
                    onChange={(e) => setCourseGrade(e.target.value)}
                    placeholder="Дошкольный"
                    required
                  >
                    <option value="">Выберите уровень</option>
                    <option value="0">Дошкольный</option>
                    <option value="1">1 класс</option>
                    <option value="2">2 класс</option>
                    <option value="3">3 класс</option>
                    <option value="4">4 класс</option>
                    <option value="-1">Общий для всех</option>
                  </select>
                  <label htmlFor="courselang">Выберите язык обучения</label>
                  <select
                    id="courselang"
                    name="courselang"
                    value={courseLanguage}
                    onChange={(e) => setCourseLanguage(e.target.value)}
                    required
                  >
                    <option value="">Выберите язык</option>
                    <option value="ru">Русский</option>
                    <option value="kz">Қазақша</option>
                    <option value="cm">Общий для всех</option>
                  </select>
                  <span style={{ display: "flex", flexDirection: "row", marginTop: "30px" }}>
                    <button
                      type="submit"
                      className="superBtn"
                    >
                      {editingCourseId ? "Сохранить изменения" : "Добавить курс"}
                    </button>
                    {editingCourseId && (
                      <button
                        type="button"
                        className="superBtn"
                        style={{
                          color: "red",
                          marginLeft: "10px",
                        }}
                        onClick={handleDeleteCourse}
                      >
                        Удалить курс
                      </button>
                    )}
                  </span>
                </div>
                <div className="formRight">
                  <label htmlFor="coursePrice">Добавить секций</label> <br />
                  <button
                    type="button"
                    style={{
                      border: "2px dotted #aaa",
                      color: "#aaa",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      width: "200px",
                      marginBottom: "20px",
                    }}
                    onClick={handleAddSection}
                  >
                    <AddIcon sx={{ color: "#aaa" }} />
                  </button>{" "}
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <ul
                          className="sectList"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {sections.map((section, index) => (
                            <Draggable
                              key={section.id}
                              draggableId={section.id.toString()} // Ensure draggableId is a string
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  className="sectAdder"
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) =>
                                      handleSectionChange(
                                        section.id,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Название секции"
                                  />
                                  {/* <textarea
                                    value={section.description}
                                    onChange={(e) =>
                                      handleSectionChange(
                                        section.id,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Описание секции"
                                  ></textarea> */}
                                  <button
                                    onClick={() =>
                                      handleDeleteSection(section.id)
                                    }
                                    className="transBtn"
                                  >
                                    <DeleteForeverIcon />
                                  </button>
                                  <button
                                    className="transBtn"
                                    name="dragger"
                                    {...provided.dragHandleProps}
                                  >
                                    <MenuIcon />
                                  </button>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Tasks;
