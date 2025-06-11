import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Superside from "../admin_components/Superside.jsx";
import {
  addStudent,
  fetchClass,
  fetchStudentsOfClass,
  incrementClassGrades,
  decrementClassGrades
} from "../../utils/apiService.js";
import Loader from "../Loader.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ToastContainer, toast } from 'react-toastify';



const ClassDetails = () => {
  const { schoolId, classId } = useParams();
  const [students, setStudents] = useState([]);
  const [class_info, setClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    gender: "",
    phone_number: "",
  });
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleConfirmedAction = async () => {
    setShowConfirmModal(false);
    try {
      toast.info("Идёт обновление классов...", {
        autoClose: 1000,
      });

      if (confirmAction === "increment") {
        await incrementClassGrades(schoolId, classId);
      } else if (confirmAction === "decrement") {
        await decrementClassGrades(schoolId, classId);
      }

      await sleep(1000);
      await fetchData();

      toast.success(
        confirmAction === "increment"
          ? "Класс успешно повышен!"
          : "Класс успешно понижен!"
      );
    } catch (error) {
      console.error("Ошибка при обновлении класса:", error);
      toast.error("Ошибка при обновлении класса.");
    } finally {
      setConfirmAction(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [schoolId, classId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchData = async () => {
    try {
      const [studentsData, classData] = await Promise.all([
        fetchStudentsOfClass(schoolId, classId),
        fetchClass(schoolId, classId),
      ]);
      console.log(studentsData);
      setStudents(studentsData);
      setClass(classData);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStudent(schoolId, classId, formData);
      setShowModal(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
      });
      await fetchData();
    } catch (error) {
      console.error("Error adding student:", error.message);
    }
  };

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <div className="spdash">
      <Superside />
      <div className="superMain schoolCont">
        <h2>
          Класс: {class_info.grade}
          {class_info.section}{" "}
        </h2>
        <h4>ID: {class_info.id}</h4>


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
            Повысить класс
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
            Понизить класс
          </Button>
        </Stack>
        {students.length === 0 ? (
          <div
            className="classList"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <p style={{ color: "lightgray" }}>
              Пока нет учеников в этом классе.
            </p>
          </div>
        ) : (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>ФИО</b></TableCell>
                  <TableCell><b>Имя пользователя</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Телефон</b></TableCell>
                  <TableCell><b>Язык обучения</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      {student.user.first_name} {student.user.last_name}
                    </TableCell>
                    <TableCell>{student.user.username}</TableCell>
                    <TableCell>{student.user.email}</TableCell>
                    <TableCell>{student.user.phone_number || "—"}</TableCell>
                    <TableCell>
                      {student.language === "ru"
                        ? "Русский"
                        : student.language === "kz"
                          ? "Казахский"
                          : student.language}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        )}

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
          Добавить ученика
        </button>

        {showModal && (
          <dialog open className="modal supermodal">
            <div className="modal-content">
              <button
                className="transBtn"
                style={{ float: "right" }}
                onClick={() => setShowModal(false)}
              >
                <CloseIcon sx={{ color: "gray" }} />
              </button>
              <form className="registrationInput" style={{ marginTop: "40px" }} onSubmit={handleSubmit}>
                <label htmlFor="first_name">Имя</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleFormChange}
                  required
                />

                <label htmlFor="last_name">Фамилия</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleFormChange}
                  required
                />

                <label htmlFor="username">Имя пользователя</label>
                <input
                  type="username"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  required
                />

                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
                <label htmlFor="gender">Пол</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  required
                >
                  <option value="O">Выберите пол</option>
                  <option value="M">Мужской</option>
                  <option value="F">Женский</option>
                  <option value="O">Не указан</option>
                </select>

                <br />
                <button type="submit" className="superBtn">
                  Добавить
                </button>
              </form>
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
                  ? "Вы уверены, что хотите повысить класс?"
                  : "Вы уверены, что хотите понизить класс?"}
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
      </div>
      <ToastContainer />

    </div>
  );
};

export default ClassDetails;
