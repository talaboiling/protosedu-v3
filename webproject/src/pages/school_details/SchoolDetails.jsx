import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Superside from "../admin_components/Superside.jsx";
import {
  addClasses,
  fetchClassesData,
  fetchSchoolData,
  assignSupervisor,
  deassignSupervisor,
  importSchoolExcel,
  changeClassLanguage,
  incrementSchoolGrades,
  decrementSchoolGrades
} from "../../utils/apiService.js";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  Grid,
  Stack
} from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ToastContainer, toast } from 'react-toastify';



import Loader from "../Loader.jsx";

const SchoolDetails = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [supervisorModal, setSupervisorModal] = useState(false); // Modal for supervisor
  const [formData, setFormData] = useState({
    grade: "",
    section: "",
  });
  const [supervisorData, setSupervisorData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
  });

  const [showUploadModal, setShowUploadModal] = useState(false); // Modal for Excel upload
  const [excelFile, setExcelFile] = useState(null);  // State for Excel file
  const [formPlan, setFormPlan] = useState("annual"); // State for plan selection
  const [uploadStatus, setUploadStatus] = useState(null);  // State for upload status
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null); // 'increment' or 'decrement'
  const [showConfirmModal, setShowConfirmModal] = useState(false);



  const fetchData = async () => {
    await fetchSchoolDetails();
    await fetchClasses();
  };
  useEffect(() => {
    fetchData();
  }, [schoolId]);

  const fetchSchoolDetails = async () => {
    try {
      const schoolData = await fetchSchoolData(schoolId);
      setSchool(schoolData);
    } catch (error) {
      console.error("Error fetching school details:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const classesData = await fetchClassesData(schoolId);
      setClasses(classesData);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
    setLoading(false);
  };


  const handleLanguageChange = async (classId, newLanguage) => {
    try {
      await changeClassLanguage(schoolId, classId, newLanguage);
      const updatedClasses = await fetchClassesData(schoolId);
      setClasses(updatedClasses);
    } catch (error) {
      console.error("Error updating class language:", error);
      alert("Ошибка при обновлении языка класса.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.includes("excel") || file.type.includes("spreadsheetml") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setExcelFile(file);
    } else {
      alert("Пожалуйста, загрузите файл Excel (.xlsx или .xls).");
    }
  };


  const handleSupervisorFormChange = (e) => {
    const { name, value } = e.target;
    setSupervisorData({
      ...supervisorData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addClasses(schoolId, formData);
      setShowModal(false);
      setFormData({ grade: "", section: "" });
      fetchClasses(); // Fetch the updated list of classes
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  const handleSupervisorSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignSupervisor(schoolId, supervisorData);
      setSupervisorModal(false);
      setSupervisorData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone_number: "",
      });
      fetchSchoolDetails(); // Fetch the updated school details
    } catch (error) {
      console.error("Error assigning supervisor:", error);
    }
  };

  const handleUploadExcel = async () => {
    if (!excelFile) {
      alert("Пожалуйста, выберите файл для загрузки.");
      return;
    }
    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("plan", formPlan);

    try {
      setUploadStatus("loading");
      await importSchoolExcel(formData, schoolId);
      setUploadStatus("success");
      setExcelFile(null);
      setShowUploadModal(false);
      const updatedClasses = await fetchClassesData(schoolId);
      setClasses(updatedClasses);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(error.message);
      setErrorDetails(error.exceptions);
    }
  };


  const handleDeassignSupervisor = async () => {
    try {
      await deassignSupervisor(schoolId);
      fetchSchoolDetails(); // Fetch the updated school details
    } catch (error) {
      console.error("Error deassigning supervisor:", error);
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleConfirmedAction = async () => {
    setShowConfirmModal(false);
    try {
      toast.info("Идёт обновление классов...", {
        autoClose: 1000,
      });

      if (confirmAction === "increment") {
        await incrementSchoolGrades(schoolId);
      } else if (confirmAction === "decrement") {
        await decrementSchoolGrades(schoolId);
      }

      await sleep(1000);
      await fetchData()

      toast.success(
        confirmAction === "increment"
          ? "Классы успешно повышены!"
          : "Классы успешно понижены!"
      );
    } catch (error) {
      console.error("Ошибка при обновлении классов:", error);
      toast.error("Ошибка при обновлении классов.");
    } finally {
      setConfirmAction(null);
    }
  };


  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain schoolCont">
        <h2>{school.name}</h2>
        <div className="schooldetails">
          <Typography className="defaultStyle"><b>Город:</b> {school.city}</Typography>
          <Typography className="defaultStyle"><b>Email:</b> {school.email}</Typography>
          <Typography className="defaultStyle"><b>Количество учеников:</b> {school.student_number}</Typography>
          <Typography className="defaultStyle"><b>Год обучения:</b> {school.school_year}</Typography>


          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ExpandLessIcon />}
              onClick={() => {
                setConfirmAction("increment");
                setShowConfirmModal(true);
              }}

            >
              Повысить классы
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<ExpandMoreIcon />}
              onClick={() => {
                setConfirmAction("decrement");
                setShowConfirmModal(true);
              }}

            >
              Понизить классы
            </Button>
          </Stack>
        </div>

        <h2>Классы</h2>
        {classes.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Typography color="textSecondary">
              Классы еще не добавлены :(
            </Typography>
          </div>
        ) : (
          <Grid container spacing={2} className="classList">
            {classes.map((classItem) => (
              <Grid item xs={12} sm={6} md={4} key={classItem.id}>
                <Card variant="outlined" className="classItem">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Класс: <b>{classItem.grade} {classItem.section}</b> <br />ID: <b>{classItem.id}</b>
                    </Typography>

                    <Typography color="textSecondary" gutterBottom>
                      Учеников: <b>{classItem.num_students}</b>
                    </Typography>

                    <Select
                      fullWidth
                      name="language"
                      value={classItem.language}
                      onChange={(e) => handleLanguageChange(classItem.id, e.target.value)}
                      sx={{ mt: 1, mb: 2 }}
                    >
                      <MenuItem value="kz">Казахский</MenuItem>
                      <MenuItem value="ru">Русский</MenuItem>
                    </Select>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() =>
                        navigate(`/schools/${schoolId}/classes/${classItem.id}`)
                      }
                    >
                      Перейти в класс
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            marginBottom: "20px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#509CDB",
            fontSize: "large",
            fontWeight: "600",
          }}
        >
          Импортировать школу
        </button>

        <br />
        <button
          onClick={() => setShowModal(true)}
          style={{
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#509CDB",
            fontSize: "large",
            fontWeight: "600",
          }}
        >
          Добавить класс
        </button>

        <h3>Супервайзер</h3>
        {school.supervisor ? (
          <div className="supervisorDetails">
            <p className="defaultStyle">
              <b>Имя:</b> {school.supervisor.first_name}{" "}
              {school.supervisor.last_name}
            </p>
            <p className="defaultStyle">
              <b>Email:</b> {school.supervisor.email}
            </p>
            <p className="defaultStyle">
              <b>Телефон:</b> {school.supervisor.phone_number}
            </p>
            <button
              onClick={handleDeassignSupervisor}
              style={{
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#D9534F",
                fontSize: "large",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Удалить супервайзера
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSupervisorModal(true)}
            style={{
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#509CDB",
              fontSize: "large",
              fontWeight: "600",
            }}
          >
            Назначить супервайзера
          </button>
        )}

        {showModal && (
          <dialog open className="modal supermodal">
            <div className="modal-content">
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                onClick={() => setShowModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
              <br />
              <form
                onSubmit={handleSubmit}
                style={{ padding: "20px", fontSize: "large" }}
              >
                <label htmlFor="grade">Класс</label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <label htmlFor="section">Буква</label>
                <input
                  type="text"
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <button type="submit" className="superBtn">
                  Добавить
                </button>
              </form>
            </div>
          </dialog>
        )}


        {showUploadModal && (
          <dialog open className="modal supermodal">
            <div className="modal-content">
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                onClick={() => setShowUploadModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
              <h2 style={{ color: "#4F4F4F", fontSize: "x-large" }}>
                Импортировать школы
              </h2>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{ marginTop: "20px", marginBottom: "20px" }}
              />
              <label style={{ fontSize: "20px" }} htmlFor="plan">План</label>
              <select name="plan" id="plan" onChange={(e) => setFormPlan(e.target.value)} value={formPlan} style={{ marginBottom: "20px", padding: "10px", fontSize: "large" }}>
                <option value="annual">Годовой</option>
                <option value="monthly">Ежемесячный</option>
              </select>
              <button
                onClick={handleUploadExcel}
                style={{
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#509CDB",
                  fontSize: "large",
                  fontWeight: "600",
                  padding: "10px 20px",
                }}
              >
                Импортировать
              </button>
              {uploadStatus === "loading" && (
                <p style={{ color: "blue", marginTop: "10px" }}>Загрузка...</p>
              )}
              {uploadStatus === "success" && (
                <p style={{ color: "green", marginTop: "10px" }}>
                  Файл успешно загружен!
                </p>
              )}
              {uploadStatus === "error" && (
                <div className="error-box">
                  <p><strong>Error:</strong> {errorMessage}</p>
                  {errorDetails.length > 0 && (
                    <ul>
                      {errorDetails.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

            </div>
          </dialog>
        )}


        {showConfirmModal && (
          <dialog open className="modal supermodal">
            <div className="modal-content">
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                onClick={() => setShowConfirmModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
              <h2 style={{ marginTop: "10px" }}>
                {confirmAction === "increment"
                  ? "Вы уверены, что хотите повысить классы?"
                  : "Вы уверены, что хотите понизить классы?"}
              </h2>
              <div style={{ marginTop: "20px", display: "flex", gap: "1rem" }}>
                <button
                  className="superBtn"
                  onClick={handleConfirmedAction}
                  style={{ padding: "10px 20px", fontSize: "large" }}
                >
                  Подтвердить
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "large",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          </dialog>
        )}



        {supervisorModal && (
          <dialog open className="modal supermodal">
            <div className="modal-content">
              <button
                style={{
                  border: "none",
                  float: "right",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                onClick={() => setSupervisorModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
              <br />
              <form
                onSubmit={handleSupervisorSubmit}
                style={{ padding: "20px", fontSize: "large" }}
              >
                <label htmlFor="first_name">Имя</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={supervisorData.first_name}
                  onChange={handleSupervisorFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <label htmlFor="last_name">Фамилия</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={supervisorData.last_name}
                  onChange={handleSupervisorFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <label htmlFor="username">Логин</label>
                <input type="text" id="username" name="username" value={supervisorData.username} onChange={handleSupervisorFormChange} required style={{ width: "100%", padding: "10px", fontSize: "large" }} />
                <br />
                <br />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={supervisorData.email}
                  onChange={handleSupervisorFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <label htmlFor="phone_number">Телефон</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={supervisorData.phone_number}
                  onChange={handleSupervisorFormChange}
                  required
                  style={{ width: "100%", padding: "10px", fontSize: "large" }}
                />
                <br />
                <br />
                <button type="submit" className="superBtn">
                  Назначить
                </button>
              </form>
            </div>
          </dialog>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SchoolDetails;
