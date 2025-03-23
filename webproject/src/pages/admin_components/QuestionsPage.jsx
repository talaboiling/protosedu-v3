import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../../tailwind.css";  // Import Tailwind CSS


const fetchQuestions = async () => [
    { id: 1, title: "What is 2+2?", testId: 1 },
    { id: 2, title: "What is 3+3?", testId: 1 },
];
const createQuestion = async (question) => console.log("Question Created:", question);

const QuestionsPage = () => {
    const { testId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ title: "", testId: testId });

    useEffect(() => {
        const loadQuestions = async () => {
            const data = await fetchQuestions();
            setQuestions(data.filter((q) => q.testId.toString() === testId));
        };
        loadQuestions();
    }, [testId]);

    const handleQuestionCreate = async () => {
        if (newQuestion.title.trim() === "") return alert("Question title cannot be empty!");
        await createQuestion(newQuestion);
        setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
        setNewQuestion({ title: "", testId: testId });
    };

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-10">
            <div className="bg-white shadow-2xl rounded-xl p-8 max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-700">
                    Questions for Test {testId}
                </h2>

                <div className="grid grid-cols-1 gap-6 mb-12">
                    {questions.map((question) => (
                        <Link
                            to={`/questions/${question.id}`}
                            key={question.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
                        >
                            <p className="text-xl font-semibold text-gray-800 mb-2">{question.title}</p>
                        </Link>
                    ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-8 shadow-inner mb-12">
                    <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        Add New Question
                    </h3>
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Question Title"
                            value={newQuestion.title}
                            onChange={(e) =>
                                setNewQuestion({ ...newQuestion, title: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <button
                        onClick={handleQuestionCreate}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Create Question
                    </button>
                </div>

                <div className="text-center mt-6">
                    <Link
                        to="/tests"
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                        ← Back to Tests
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuestionsPage;
