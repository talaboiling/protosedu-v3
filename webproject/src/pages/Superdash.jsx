import React, { useEffect, useState } from "react";
import axios from "axios";
import Superside from "./admin_components/Superside.jsx";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "/src/superdash.css";
import { addSchool, decrementClassGradesGlobally, fetchSchools, incrementClassGradesGlobally } from "../utils/apiService.js";
import Loader from "./Loader.jsx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { logout } from "../utils/authService.js";
import { ToastContainer, toast } from 'react-toastify';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const Superdash = () => {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
  });
  const [loading, setLoading] = useState(true); // Add loading state
  const [totalStudents, setTotalStudents] = useState(0);
  const [confirmAction, setConfirmAction] = useState(null); // 'increment' or 'decrement'
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const fetchData = async () => {
    try {
      const schoolData = await fetchSchools();
      setFilteredSchools(schoolData);
      setSchools(schoolData);
    } catch (error) {
      console.error("Error fetching the data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = schools.filter((school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredSchools(filteredItems);
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to the homepage or login page
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSchool(formData);
      setShowModal(false);
      setFormData({ name: "", city: "", email: "" });
      const updatedSchools = await fetchSchools(); // Fetch the updated list of schools
      setSchools(updatedSchools); // Update the state with the new list
      setFilteredSchools(updatedSchools); // Update the filtered list as well
    } catch (error) {
      console.error("Error adding school:", error);
    }
  };

  const handleSchoolClick = (schoolId) => {
    navigate(`/schools/${schoolId}`);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSchools, {
      header: ["id", "name", "city", "email", "student_number"],
    });

    // Set custom headers in Russian
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["ID", "Название школы", "Город", "Email", "Количество учеников"]],
      { origin: "A1" }
    );

    // Apply styles to header row
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true, sz: 14 }, // Set font size to 14 and bold
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Adjust column widths to fit names
    const columnWidths = [
      { wch: 5 }, // ID
      { wch: 20 }, // Название школы
      { wch: 15 }, // Город
      { wch: 30 }, // Email
      { wch: 20 }, // Количество учеников
    ];

    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schools");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "schools.xlsx");
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleConfirmedAction = async () => {
    setShowConfirmModal(false);
    try {
      toast.info("Идёт обновление классов...", {
        autoClose: 5000,
      });

      if (confirmAction === "increment") {
        await incrementClassGradesGlobally();
      } else if (confirmAction === "decrement") {
        await decrementClassGradesGlobally();
      }

      await sleep(5000);
      await fetchData(); // Refresh the school data after the action

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
      <div className="superMain">
        <button
          className="superBtn"
          onClick={handleLogout}
          style={{ float: "right" }}
        >
          Выйти
        </button>
        <p style={{ fontSize: "xx-large", fontWeight: "500", color: "#666" }}>
          Платформы
        </p>
        <p style={{ fontSize: "large", color: "#666" }}>
          Всего платформ: {filteredSchools.length} | Всего учеников:{" "}
          {filteredSchools.reduce((acc, school) => acc + school.student_number, 0)}
        </p>
        <div className="addschool">
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
            Добавить платформу
          </button>
          <button
            onClick={downloadExcel}
            style={{
              marginLeft: "10px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#509CDB",
              fontSize: "large",
              fontWeight: "600",
            }}
          >
            Скачать Excel
          </button>

        </div >
        <div className="addschool">
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
          </Stack></div>
        <div className="superCont">
          <div className="superSearch">
            <input
              type="text"
              value={searchItem}
              onChange={handleInputChange}
              placeholder="Поиск школы по названию или ID"
              style={{ border: "none", width: "50%", fontSize: "large" }}
            />
          </div>
          <ul className="schoolsList">
            {filteredSchools.map((school) => (
              <li
                key={school.id}
                className="schoolItem"
                onClick={() => handleSchoolClick(school.id)}
              >
                <p
                  style={{
                    margin: "0",
                    marginBottom: "10px",
                    fontSize: "large",
                  }}
                >
                  {school.name}
                </p>
                <p style={{ margin: "0" }}>{school.city}</p>
                <p
                  style={{
                    margin: "0",
                    fontWeight: "500",
                    fontSize: "large",
                  }}
                >
                  Количество учеников: {school.student_number}
                </p>
                <p>Год обучения: {school.school_year}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
            <h2
              style={{
                animation: "none",
                color: "#4F4F4F",
                fontSize: "x-large",
              }}
            >
              Добавить платформу
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{ padding: "20px", fontSize: "large" }}
            >
              <label htmlFor="name">Название школы</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                style={{ width: "100%", padding: "10px", fontSize: "large" }}
              />
              <br />
              <br />
              <label htmlFor="city">Город</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                required
                style={{ width: "100%", padding: "10px", fontSize: "large" }}
              />
              <br />
              <br />
              <label htmlFor="email">Адрес электронной почты</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                style={{ width: "100%", padding: "10px", fontSize: "large" }}
              />
              <br />
              <br />
              <button type="submit" className="superBtn">
                Дальше
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
      <ToastContainer />
    </div>
  );
};

export default Superdash;
