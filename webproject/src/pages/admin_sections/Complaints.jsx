import React, { useEffect, useState } from "react";
import { fetchComplaints, updateComplaint, deleteComplaint } from "../../utils/apiService";
import { useNavigate } from "react-router-dom";
import "./Complaints.css";
import { ToastContainer, toast } from 'react-toastify';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchComplaints();
                setComplaints(data);
            } catch (error) {
                console.error("Не удалось загрузить жалобы", error);
                toast.error("Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await updateComplaint(id, { status });
            setComplaints((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status } : c))
            );
            toast.success("Статус успешно обновлён");
        } catch (err) {
            console.error("Ошибка при обновлении статуса", err);
            toast.error("Не удалось обновить статус");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteComplaint(id);
            setComplaints((prev) => prev.filter((c) => c.id !== id));
            toast.success("Жалоба удалена");
        } catch (err) {
            console.error("Ошибка при удалении жалобы", err);
            toast.error("Не удалось удалить жалобу");
        }
    };

    const renderDetails = (complaint) => (
        <div className="complaint-details">
            <p><strong>Отправлено:</strong> {new Date(complaint.created_at).toLocaleString("ru-RU")}</p>
            <p><strong>Курс:</strong> {complaint.course}</p>
            <p><strong>Раздел:</strong> {complaint.section}</p>
            <p><strong>Глава:</strong> {complaint.chapter}</p>
            <p><strong>Задание:</strong> {complaint.task}</p>
            <p><strong>Вопрос:</strong> {complaint.question}</p>
        </div>
    );

    if (loading) return <p className="loading-text">Загрузка жалоб...</p>;

    return (
        <div className="complaints-container">
            <h2>Управление жалобами</h2>
            <table className="complaints-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Описание</th>
                        <th>Статус</th>
                        <th>Пользователь</th>
                        <th>Детали</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((complaint) => (
                        <tr key={complaint.id}>
                            <td>{complaint.id}</td>
                            <td>{complaint.description}</td>
                            <td>
                                <select
                                    value={complaint.status}
                                    onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                                >
                                    <option value="pending">Ожидает</option>
                                    <option value="resolved">Решено</option>
                                    <option value="rejected">Отклонено</option>
                                </select>
                            </td>
                            <td>{complaint.user_email || "Аноним"}</td>
                            <td>{renderDetails(complaint)}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/admindashboard/tasks/courses/${complaint.course_id}/sections/${complaint.section_id}/chapters/${complaint.chapter_id}#task-${complaint.task_id}`
                                        )
                                    }
                                    className="explore-button"
                                    style={{ margin: "5px", width: "100px" }}

                                >
                                    Перейти
                                </button>
                                <button
                                    onClick={() => handleDelete(complaint.id)}
                                    className="delete-button"
                                    style={{ margin: "5px", width: "100px" }}

                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default Complaints;
