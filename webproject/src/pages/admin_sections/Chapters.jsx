import React, { useEffect, useState } from "react";
import Superside from "../admin_components/Superside";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import Loader from "../Loader";
import {
  fetchSection,
  fetchCourse,
  createChapters,
  deleteChapter,
  updateChapter,
  fetchChapters,
  fetchTests,
  addTestBeforeChapter,
  addTestAfterChapter,
} from "../../utils/apiService";
import DataList from "./DataList";
import test from "node:test";
import { toast, ToastContainer } from "react-toastify";
import { t } from "i18next";
import { set } from "react-hook-form";

const Chapters = () => {
  const { courseId, sectionId } = useParams();
  const [contents, setContents] = useState([]);
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedDTest, setSelectedDTest] = useState(null);

  const [addTestDialog, setAddTestDialog] = useState(false);

  const [chapterTest, setChapterTest] = useState(null);
  const [orderType, setOrderType] = useState(null);

  const navigate = useNavigate();

  const fetchContentsData = async () => {
    try {
      const contentsData = await fetchChapters(courseId, sectionId);
      setContents(contentsData);
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
  useEffect(() => {
    fetchContentsData();
  }, [courseId, sectionId]);

  const handleOpenAddDialog = () => {
    setChapterTitle("");
    setOpenAddDialog(true);
  };

  const handleOpenAddTestDialog = () => {
    setAddTestDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (chapter) => {
    setSelectedChapter(chapter);
    setChapterTitle(chapter.title);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleAddChapter = async () => {
    try {
      await createChapters(courseId, sectionId, { title: chapterTitle });
      const updatedChapters = await fetchChapters(courseId, sectionId);
      setContents(updatedChapters);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Failed to add chapter", error);
    }
  };

  const handleEditChapter = async () => {
    try {
      await updateChapter(courseId, sectionId, selectedChapter.id, {
        title: chapterTitle,
      });
      const updatedChapters = await fetchChapters(courseId, sectionId);
      setContents(updatedChapters);
      handleCloseEditDialog();
    } catch (error) {
      console.error("Failed to edit chapter", error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await deleteChapter(courseId, sectionId, chapterId);
      setContents(contents.filter((chapter) => chapter.id !== chapterId));
      toast.success("Глава успешно удалена");
    } catch (error) {
      console.error("Failed to delete chapter", error);
      toast.error("Не удалось удалить главу");
    }
  };

  const handleChapterClick = (chapterId) => {
    navigate(
      `/admindashboard/tasks/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`
    );
  };

  const handleTestRemove = async (chapterId, testType) => {
    console.log(`${testType}_diagnostic_test_detail`);
    try {
      if (testType === "before") {
        await updateChapter(courseId, sectionId, chapterId, {
          before_diagnostic_test: null,
        });
      } else if (testType === "after") {
        await updateChapter(courseId, sectionId, chapterId, {
          after_diagnostic_test: null,
        });
      }

      toast.success("Тест успешно удален");
      setTimeout(async () => {
        const updatedChapters = await fetchChapters(courseId, sectionId);
        setContents(updatedChapters);
      }, 2000);

    } catch (error) {
      console.error("Failed to remove test", error);
      toast.error("Не удалось удалить тест");

    }
  };


  async function handleAddTest() {
    console.log(selectedDTest, chapterTest, orderType);
    const courseId = section.course;
    const sectionId = section.id;
    const chapterId = chapterTest;
    const testId = selectedDTest;

    if (orderType === "before") {
      try {
        const responseData = await addTestBeforeChapter(courseId, sectionId, chapterId, testId);
        console.log(responseData);
        toast.success("Тест успешно добавлен перед главой");
      } catch (error) {
        toast.error("Тест не удалось добавить перед главой");
      }
    } else if (orderType === "after") {
      try {
        const responseData = await addTestAfterChapter(courseId, sectionId, chapterId, testId);
        console.log(responseData);
        toast.success("Тест успешно добавлен после главы");
      } catch (error) {
        toast.error("Тест не удалось добавить после главы");
      }
    }
    setTimeout(async () => {
      const updatedChapters = await fetchChapters(courseId, sectionId);
      setContents(updatedChapters);
    }, 2000);
    setAddTestDialog(false);
  };

  console.log(selectedDTest);
  console.log(section);

  if (loading) {
    return <Loader />;
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
          <p style={{ fontSize: "x-large", fontWeight: "500", color: "#666" }}>
            {'>'} {section.title}
          </p>
        </div>
        <div className="superCont chapterCont">
          <p
            style={{
              fontSize: "x-large",
              fontWeight: "700",
              color: "#444",
              alignSelf: "center",
            }}
          >
            Главы
          </p>
          <div className="chapters">
            <div className="addChapter" style={{ display: "flex" }}>
              <button className="chapterAdder" onClick={handleOpenAddDialog}>
                <AddIcon sx={{ fontSize: 30 }} />
                Добавить главы
              </button>
              <button className="chapterAdder" onClick={handleOpenAddTestDialog}>
                <AddIcon sx={{ fontSize: 30 }} />
                Добавить Диагностический тест
              </button>
            </div>

            <ul className="chapterList">
              {contents.map((chapter) => (
                <>
                  <Divider />

                  {/* Diagnostic Test before */}
                  {chapter.before_diagnostic_test_detail && (
                    <ListItem
                      key={chapter.id}
                      sx={{
                        backgroundColor: "#077AC2",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        padding: "12px",
                        color: "#fff",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        to={`/admindashboard/tests?test=${chapter.before_diagnostic_test_detail.id}`}
                        style={{
                          color: "#fff",
                          textDecoration: "none",
                          fontSize: "16px",
                        }}
                      >
                        Тест до: {chapter.before_diagnostic_test_detail.title}
                      </Link>
                      {/* Button to delete the test, not functional yet */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        style={{ marginLeft: '10px' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTestRemove(chapter.id, "before");
                        }} // Prevent propagation to avoid opening the chapter
                      >
                        Удалить
                      </Button>
                    </ListItem>
                  )}

                  {/* Chapter */}
                  <ListItem
                    key={chapter.id}
                    sx={{
                      padding: "10px",
                      margin: "5px 0",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() => handleChapterClick(chapter.id)}
                  >
                    <ListItemText primary={chapter.title} />
                    <div>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditDialog(chapter);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChapter(chapter.id);
                        }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </div>
                  </ListItem>


                  {/* Diagnostic Test after */}
                  {chapter.after_diagnostic_test_detail && (
                    <ListItem
                      key={chapter.id}
                      sx={{
                        backgroundColor: "#077AC2",
                        borderRadius: "8px",
                        marginBottom: "10px",
                        padding: "12px",
                        color: "#fff",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        to={`/admindashboard/tests?test=${chapter.after_diagnostic_test_detail.id}`}
                        style={{
                          color: "#fff",
                          textDecoration: "none",
                          fontSize: "16px",
                        }}
                      >
                        Тест после: {chapter.after_diagnostic_test_detail.title}
                      </Link>
                      {/* Button to delete the test, not functional yet */}
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        style={{ marginLeft: '10px' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTestRemove(chapter.id, "after");
                        }} // Prevent propagation to avoid opening the chapter
                      >
                        Удалить
                      </Button>
                    </ListItem>

                  )}
                  {/* <Divider /> */}

                </>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add Chapter Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Добавить Главу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название главы"
            fullWidth
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Отменить</Button>
          <Button onClick={handleAddChapter} disabled={!chapterTitle}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Chapter Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Изменить Главу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название главы"
            fullWidth
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />
          <div style={{ display: "flex", fontSize: "14px", gap: "1rem" }}>
            <p>Тест до:</p>
            {selectedChapter?.before_diagnostic_test_detail ? (
              <Link to={`/admindashboard/tests?test=${selectedChapter.before_diagnostic_test_detail.id}`}>
                <button style={{ paddingInline: "5px" }}>
                  {selectedChapter.before_diagnostic_test_detail.title}
                </button>
              </Link>
            ) : (
              <p>{' - '}</p>
            )}
          </div>
          <div style={{ display: "flex", fontSize: "14px", gap: "1rem" }}>
            <p>Тест после: </p>
            {selectedChapter?.after_diagnostic_test_detail ? (
              <Link to={`/admindashboard/tests?test=${selectedChapter.after_diagnostic_test_detail.id}`}>
                <button style={{ paddingInline: "5px" }}>
                  {selectedChapter.after_diagnostic_test_detail.title}
                </button>
              </Link>
            ) : (
              <p>{' - '}</p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Отменить</Button>
          <Button onClick={handleEditChapter} disabled={!chapterTitle}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addTestDialog} onClose={() => setAddTestDialog(false)}>
        <DialogTitle>Добавить Тест</DialogTitle>
        <DialogContent>
          <p>Тест привязан к главе. Выберите тест и главу к которой хотите привязать этот тест</p>
          <p>Выберите тест</p>
          <DataList type="async" asyncFunction={() => fetchTests("diagnostic")} actionFunction={(test) => setSelectedDTest(test)} />
          <p>Выберите Главу для теста</p>
          <DataList type="sync" data={section.chapters} actionFunction={(chapterId) => setChapterTest(chapterId)} />
          <p>Выберите Порядок</p>
          <DataList type="sync" data={[{ title: "До", id: 'before' }, { title: "После", id: 'after' }]} actionFunction={(orderType) => setOrderType(orderType)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTestDialog(false)}>Отменить</Button>
          <Button onClick={handleAddTest} disabled={!selectedDTest}>
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default Chapters;
