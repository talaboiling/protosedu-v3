import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Superside from "../admin_components/Superside.jsx";
import {
  addStudent,
  fetchClass,
  fetchStudentsOfClass,
} from "../../utils/apiService.js";
import Loader from "../Loader.jsx";

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
          <ul className="classList">
            {students.map((student) => (
              <li key={student.id} className="classItem">
                <b>
                  {student.user.first_name} {student.user.last_name}
                </b> <br />
                <strong>{student.user.username}</strong>
                <br /> {student.user.email} <br />
                {student.user.phone_number}
                Язык обучения: {student.language === "ru"
                  ? "Русский"
                  : student.language === "kz"
                    ? "Казахский"
                    : student.language}
              </li>
            ))}
          </ul>
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
      </div>
    </div>
  );
};

export default ClassDetails;
