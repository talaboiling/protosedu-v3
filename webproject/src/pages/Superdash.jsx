import React, { useEffect, useState } from "react";
import axios from "axios";
import Superside from "./admin_components/Superside.jsx";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "/src/superdash.css";
import { addSchool, fetchSchools } from "../utils/apiService.js";
import Loader from "./Loader.jsx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { logout } from "../utils/authService.js";

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

  useEffect(() => {
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
          Школы
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
            Добавить школу
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
        </div>
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
              Добавить школу
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
    </div>
  );
};

export default Superdash;
