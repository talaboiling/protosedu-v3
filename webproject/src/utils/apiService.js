import axios from "axios";
import { API_URL } from "./config";
import {
  getAccessToken,
  refreshAccessToken,
  clearTokens,
  setAccessToken,
} from "./authService";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        setAccessToken(newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const fetchStudentsAdmin = async () => {
  try {
    const response = await instance.get("/all-students");
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const fetchStudentsOfClass = async (schoolId, classId) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/${classId}/students/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const fetchUserData = async (childId) => {
  try {
    const endpoint = childId ? `/children/${childId}` : "/current-user";
    const response = await instance.get(endpoint);
    return childId ? response.data : response.data.user;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Something went wrong");
  }
};

export const fetchChildren = async () => {
  try {
    const endpoint = `/children/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const addChild = async (formData) => {
  try {
    const response = await instance.post("/children/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const addStudent = async (schoolId, classId, formData) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/${classId}/students/`;
    const response = await instance.post(endpoint, formData);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const deleteChild = async (childId) => {
  try {
    const response = await instance.delete(`/children/${childId}/`);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchSchools = async () => {
  try {
    const endpoint = `/schools`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchClass = async (schoolId, classId) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/${classId}/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchCourses = async (childId) => {
  try {
    const endpoint = childId ? `/courses?child_id=${childId}` : "/courses";
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const changeCourseActivity = async (courseId, isActive) => {
  try {
    const endpoint = `/courses/${courseId}/`;
    const response = await instance.patch(endpoint, { is_active: isActive });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const fetchCourse = async (courseId, child_id) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}?child_id=${child_id}`
      : `/courses/${courseId}`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchTests = async () => {
  try {
    let endpoint = "modo/tests";
    if (localStorage.getItem("child_id")) {
      endpoint += `?child_id=${localStorage.getItem("child_id")}`;
    }
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchTest = async (testId) => {
  try {
    let endpoint = `modo/tests/${testId}/`;
    if (localStorage.getItem("child_id")) {
      endpoint += `?child_id=${localStorage.getItem("child_id")}`;
    }
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const createTest = async (testData) => {
  try {
    const endpoint = "modo/tests/create-full/";
    const response = await instance.post(endpoint, testData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const answerTestQuestion = async (question_id, answer_option) => {
  try {
    let endpoint = "modo/answer-question/";
    endpoint += `?question_id=${question_id}`;
    if (localStorage.getItem("child_id")) {
      endpoint += `&child_id=${localStorage.getItem("child_id")}`;
    }
    const response = await instance.post(endpoint, { answer_option });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const getTestReview = async (test_id) => {
  try {
    let endpoint = "modo/test-review/";
    endpoint += `?test_id=${test_id}`;
    if (localStorage.getItem("child_id")) {
      endpoint += `&child_id=${localStorage.getItem("child_id")}`;
    }
    const response = await instance.get(endpoint);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const updateTest = async (testData, id) => {
  try {
    const endpoint = `modo/tests/${id}/update-full/`;
    const response = await instance.put(endpoint, testData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error || "Something went wrong");
  }
};

export const deleteTest = async (id) => {
  try {
    const endpoint = `modo/tests/${id}/`;
    const response = await instance.delete(endpoint);

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error || "Something went wrong");
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await instance.post("/courses/", courseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await instance.patch(`/courses/${courseId}/`, courseData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await instance.delete(`/courses/${courseId}/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const createSections = async (courseId, sections) => {
  try {
    const response = await instance.post(
      `/courses/${courseId}/sections/`,
      sections
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const updateSection = async (courseId, sectionId, sectionData) => {
  try {
    const response = await instance.patch(
      `/courses/${courseId}/sections/${sectionId}/`,
      sectionData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const deleteSection = async (courseId, sectionId) => {
  try {
    const response = await instance.delete(
      `/courses/${courseId}/sections/${sectionId}/`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const fetchSections = async (courseId, child_id) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}/sections/?child_id=${child_id}`
      : `/courses/${courseId}/sections/`;
    console.log(endpoint);
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchSection = async (courseId, sectionId, child_id) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}/sections/${sectionId}/?child_id=${child_id}`
      : `/courses/${courseId}/sections/${sectionId}/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const createChapters = async (courseId, sectionId, chapters) => {
  try {
    const response = await instance.post(
      `/courses/${courseId}/sections/${sectionId}/chapters/`,
      chapters
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const updateChapter = async (
  courseId,
  sectionId,
  chapterId,
  chapterData
) => {
  try {
    const response = await instance.patch(
      `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/`,
      chapterData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const updateChapterContents = async (
  courseId,
  sectionId,
  chapterId,
  contents
) => {
  console.log(contents);
  try {
    const response = await instance.patch(
      `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/contents/update_contents/`,
      { contents }
    );
    console.log(response);
    return response;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const deleteChapter = async (courseId, sectionId, chapterId) => {
  try {
    const response = await instance.delete(
      `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

export const fetchChapters = async (courseId, sectionId, child_id) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}/sections/${sectionId}/chapters/?child_id=${child_id}`
      : `/courses/${courseId}/sections/${sectionId}/chapters/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchChapter = async (
  courseId,
  sectionId,
  chapterId,
  child_id
) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/?child_id=${child_id}`
      : `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchContents = async (
  courseId,
  sectionId,
  chapterId,
  child_id
) => {
  try {
    const endpoint = child_id
      ? `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/contents/?child_id=${child_id}`
      : `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/contents/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchLessons = async (courseId, sectionId, chapterId) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/lessons`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchTasks = async (courseId, sectionId, chapterId, childId) => {
  try {
    const endpoint = childId
      ? `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks?child_id=${childId}`
      : `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const updateTaskContents = async (
  courseId,
  sectionId,
  chapterId,
  taskId,
  questionsData
) => {
  console.log(questionsData);
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/questions/update_questions/`;
    const response = await instance.patch(endpoint, {
      questions: questionsData,
    });
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchQuestions = async (
  courseId,
  sectionId,
  chapterId,
  taskId,
  childId
) => {
  try {
    const endpoint = childId
      ? `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/questions/?child_id=${childId}`
      : `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/questions`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

// Fetch specific objects
export const fetchTask = async (
  courseId,
  sectionId,
  chapterId,
  taskId,
  childId
) => {
  try {
    const endpoint = childId
      ? `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/?child_id=${childId}`
      : `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchQuestion = async (
  courseId,
  sectionId,
  chapterId,
  taskId,
  questionId
) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/questions/${questionId}`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchWeeklyProgress = async (childId) => {
  try {
    const endpoint = childId
      ? `/progress/weekly?child_id=${childId}`
      : "/progress/weekly";
    const response = await instance.get(endpoint);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchRatings = async (childId) => {
  try {
    const endpoint = childId
      ? `/rating/global?child_id=${childId}`
      : `/rating/class`;
    const response = await instance.get(endpoint);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error || "Something went wrong");
  }
};

export const activateAccount = async (activationToken) => {
  try {
    const endpoint = `/activate/${activationToken}/`;
    const response = await instance.get(endpoint);
    return response;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const registerParent = async (formData) => {
  try {
    const endpoint = `/register-parent/`;
    const response = await instance.post(endpoint, formData);
    return response.data;
  } catch (error) {
    if (error.response.status == 400) {
      throw new Error("Пользователь с таким email уже существует");
    } else if (error.response.status == 500) {
      throw new Error("Ошибка сервера. Попробуйте зайти позже");
    }
    throw new Error(error || "Что то полшло не так.");
  }
};

export const fetchSchoolData = async (schoolId) => {
  try {
    const endpoint = `/schools/${schoolId}/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const addSchool = async (formData) => {
  try {
    const response = await instance.post("/schools/", formData);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchClassesData = async (schoolId) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/`;
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const addClasses = async (schoolId, formData) => {
  try {
    const endpoint = `/schools/${schoolId}/classes/`;
    const response = await instance.post(endpoint, formData);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const createLesson = async (courseId, sectionId, chapterId, data) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/lessons/`;
    const response = await instance.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const updateLesson = async (
  courseId,
  sectionId,
  chapterId,
  lessonId,
  data
) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/lessons/${lessonId}/`;
    const response = await instance.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const deleteLesson = async (
  courseId,
  sectionId,
  chapterId,
  lessonId
) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/lessons/${lessonId}/`;
    const response = await instance.delete(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};
export const createTask = async (courseId, sectionId, chapterId, data) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/`;
    const response = await instance.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};
export const updateTask = async (
  courseId,
  sectionId,
  chapterId,
  taskId,
  data
) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/`;
    const response = await instance.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};
export const deleteTask = async (courseId, sectionId, chapterId, taskId) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/`;
    const response = await instance.delete(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

function formDataToObject(formData) {
  const result = {};
  for (const [key, value] of formData.entries()) {
    if (key in result) {
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export const createQuestion = async (
  courseId,
  sectionId,
  chapterId,
  taskId,
  data,
  content
) => {
  const updatedData = formDataToObject(data);
  console.log(content);
  updatedData["content"] = JSON.stringify(content);
  console.log(updatedData);
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/questions/`;
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await instance.post(endpoint, updatedData, { headers });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Something went wrong");
  }
};

export const updateQuestion = async (
  courseId,
  sectionId,
  chapterId,
  taskId,
  questionId,
  data
) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/questions/${questionId}/`;
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await instance.patch(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Something went wrong");
  }
};

export const deleteQuestion = async (
  courseId,
  sectionId,
  chapterId,
  taskId,
  questionId
) => {
  try {
    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/questions/${questionId}/`;
    const response = await instance.delete(endpoint);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error || "Something went wrong");
  }
};

// SUPERVISOR

export const assignSupervisor = async (schoolId, formData) => {
  try {
    const response = await instance.post(
      `/schools/${schoolId}/assign_supervisor/`,
      formData
    );
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const deassignSupervisor = async (schoolId) => {
  try {
    const response = await instance.get(
      `/schools/${schoolId}/deassign_supervisor/`
    );
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const fetchSupervisorSchoolData = async () => {
  {
    try {
      const response = await instance.get("/supervisor_school/school/");
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorClassesData = async () => {
  {
    try {
      const response = await instance.get("/supervisor_school/classes/");
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorClassData = async (classId) => {
  {
    try {
      const response = await instance.get(
        `/supervisor_school/classes/${classId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorStudentsData = async (classId) => {
  {
    try {
      const response = await instance.get(
        `/supervisor_school/classes/${classId}/students/`
      );
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorStudentData = async (studentId) => {
  {
    try {
      const response = await instance.get(
        `/supervisor_school/students/${studentId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorStudentProgress = async (studentId) => {
  {
    try {
      const response = await instance.get(
        `/supervisor_school/students/${studentId}/progress/`
      );
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const fetchSupervisorTopStudents = async () => {
  {
    try {
      const response = await instance.get("/supervisor_school/top-students/");
      return response.data;
    } catch (error) {
      throw new Error(error || "Something went wrong");
    }
  }
};

export const answerQuestion = async (
  courseId,
  sectionId,
  chapterId,
  taskId,
  questionId,
  childId
) => {
  try {
    console.log(courseId, sectionId, chapterId, taskId, questionId, childId);

    const endpoint = `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/tasks/${taskId}/questions/${questionId}/answer/`;
    const requestData = {
      is_correct: true,
      ...(childId && { child_id: childId }),
    };
    const response = await instance.post(endpoint, requestData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error || "Something went wrong");
  }
};

export const playGame = async (childId) => {
  try {
    const endpoint = childId
      ? `/play-game/?child_id=${childId}`
      : "/play-game/";
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error || "Something went wrong");
  }
};

export const requestResetPassword = async (username) => {
  try {
    const response = await instance.post("/reset-password/", { username });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response.status === 404) {
      throw new Error("Пользователь с таким username не найден");
    } else if (error.response.status === 400) {
      throw new Error("Вам нужно ввести username");
    } else if (error.response.status === 500) {
      throw new Error("Ошибка сервера. Попробуйте зайти позже");
    } else {
      throw new Error("Произошла неизвестная ошибка");
    }
  }
};

export const checkResetPasswordToken = async (token) => {
  try {
    const url = `/reset-password/${token}/`;
    const response = await instance.get(url);
    if (response.status === 200 || response.status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 404) {
      throw new Error("Ссылка не действительна. Запросите новую ссылку.");
    } else if (error.response?.status === 403) {
      throw new Error("Ссылка для сброса пароля устарела");
    } else if (error.response?.status === 500) {
      throw new Error("Ошибка сервера. Попробуйте зайти позже");
    } else {
      throw new Error("Произошла неизвестная ошибка");
    }
  }
};

export const resetPassword = async (password, token) => {
  try {
    const url = `/reset-password/${token}/`;
    const response = await instance.post(url, { password });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response.status === 400) {
      throw new Error("Ссылка не действительна");
    } else if (error.response.status === 403) {
      throw new Error("Ссылка для сброса пароля устарела");
    } else if (error.response.status === 500) {
      throw new Error("Ошибка сервера. Попробуйте зайти позже");
    } else {
      throw new Error("Произошла неизвестная ошибка");
    }
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await instance.post("/change-password/", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response.status === 400) {
      throw new Error("Неверный старый пароль или не удалось сменить пароль");
    } else if (error.response.status === 500) {
      throw new Error("Ошибка сервера. Попробуйте зайти позже");
    } else {
      throw new Error("Произошла неизвестная ошибка");
    }
  }
};

export const getProgressForDay = async (date, childId = null) => {
  try {
    let endpoint = `/progress/day?date=${date}`;
    if (childId) {
      endpoint += `&child_id=${childId}`;
    }
    const response = await instance.get(endpoint);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const initiatePayment = async (duration) => {
  try {
    const response = await instance.post("/payments/initiate-payment/", {
      duration,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to initiate payment"
    );
  }
};

export const importSchoolExcel = async (formData, school_id) => {
  try {
    const response = await instance.post(
      "/schools/upload-excel/?school_id=" + school_id,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    const serverError = error.response?.data;

    throw {
      message: serverError?.message || error.message || "Failed to import data",
      exceptions: serverError?.exceptions || [],
    };
  }
};

export const changeRequiredPassword = async (password) => {
  try {
    const response = await instance.post("/change-required-password/", {
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to change required password"
    );
  }
};

export const changeClassLanguage = async (schoolId, classId, language) => {
  try {
    const response = await instance.patch(
      `/schools/${schoolId}/classes/${classId}/change_language/`,
      { language }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to change class language"
    );
  }
};

export const fetchSubjects = async (grade) => {
  console.log("grade", grade);
  try {
    if (grade === null) {
      throw new Error("Grade is required");
    }
    const endpoint = `${API_URL}/subjects/?grade=${grade}`;
    console.log(endpoint);
    const response = await axios.get(endpoint);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

const validateFetchDocumentsParams = (type, subject_id, language) => {
  if (type === null || subject_id === null || language === null) {
    throw new Error("All parameters are required");
  }
  if (type === "") {
    throw new Error("Type cannot be empty");
  }
  if (subject_id === "") {
    throw new Error("Subject ID cannot be empty");
  }
  if (language === "") {
    throw new Error("Language cannot be empty");
  }
  if (language !== "kz" && language !== "ru" && language !== "en") {
    console.log(language);
    throw new Error("Invalid language");
  }
};

export const fetchDocuments = async (type, subject_id, language) => {
  try {
    validateFetchDocumentsParams(type, subject_id, language);
    const endpoint = `${API_URL}/documents/?subject=${subject_id}&type=${type}&language=${language}`;
    console.log(endpoint);
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const createSubject = async (formData) => {
  try {
    const response = await instance.post("/subjects/", formData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create subject"
    );
  }
};

export const deleteSubject = async (subjectId) => {
  try {
    const response = await instance.delete(`/subjects/${subjectId}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete subject"
    );
  }
};

export const updateSubject = async (subjectId, formData) => {
  try {
    const response = await instance.patch(`/subjects/${subjectId}/`, formData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update subject"
    );
  }
};

export const createDocument = async (formData) => {
  try {
    const response = await instance.post("/documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create document"
    );
  }
};

export const deleteDocument = async (documentId) => {
  try {
    const response = await instance.delete(`/documents/${documentId}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete document"
    );
  }
};

export const updateDocument = async (documentId, formData) => {
  try {
    const response = await instance.patch(
      `/documents/${documentId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to edit document");
  }
};

export const fetchDailyMessages = async () => {
  try {
    const response = await instance.get("/daily-messages/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch messages"
    );
  }
};

export const fetchMotivationalPhrases = async () => {
  try {
    const response = await instance.get("/motivational-phrases/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch phrases");
  }
};

export const createMotivationalPhrase = async (formData) => {
  try {
    const response = await instance.post("/motivational-phrases/", formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create phrase");
  }
};

export const updateMotivationalPhraseStatus = async (phraseId, is_active) => {
  try {
    const response = await instance.patch(
      `/motivational-phrases/${phraseId}/`,
      { is_active }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update phrase");
  }
};

export const deleteMotivationalPhrase = async (phraseId) => {
  try {
    const response = await instance.delete(
      `/motivational-phrases/${phraseId}/`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete phrase");
  }
};

export const deleteDailyMessage = async (messageId) => {
  try {
    const response = await instance.delete(`/daily-messages/${messageId}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete daily message"
    );
  }
};

export const randomizeDailyMessage = async (languages) => {
  try {
    const requestBody = languages ? { languages } : {};
    const response = await instance.patch(
      "/daily-message-student/",
      requestBody
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to randomize messages"
    );
  }
};

export const fetchDailyMessageStudent = async (language) => {
  if (language === null) {
    throw new Error("Language is required");
  }
  if (language === "") {
    throw new Error("Language cannot be empty");
  }
  if (language === "kk") {
    language = "kz";
  }
  const languages = ["en", "ru", "kz"];
  if (!languages.includes(language)) {
    throw new Error("Invalid language");
  }
  console.log(language);
  console.log("fetchDailyMessageStudent");
  try {
    const response = await instance.get(
      "/daily-message-student/?language=" + language
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch messages"
    );
  }
};

export const setPhraseForDailyMessage = async (phraseId) => {
  try {
    const response = await instance.patch(
      "/daily-messages/set-daily-message/?phrase=" + phraseId
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to set phrase for message"
    );
  }
};

export const fetchComplaints = async () => {
  try {
    const response = await instance.get("/complaints/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch complaints"
    );
  }
};

export const createComplaint = async (formData) => {
  try {
    console.log("Formdata", formData);
    const response = await instance.post("/complaints/", formData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create complaint"
    );
  }
};

export const deleteComplaint = async (complaintId) => {
  try {
    const response = await instance.delete(`/complaints/${complaintId}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete complaint"
    );
  }
};

export const updateComplaint = async (complaintId, formData) => {
  try {
    const response = await instance.patch(
      `/complaints/${complaintId}/`,
      formData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update complaint"
    );
  }
};

export const listSchoolsCredentials = async () => {
  try {
    const response = await instance.get("/schools/list-credentials/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch schools credentials"
    );
  }
};

export const downloadSchoolCredential = async (filename) => {
  try {
    const url = `/schools/download-credential/?filename=${encodeURIComponent(
      filename
    )}`;

    const response = await instance.get(url, { responseType: "blob" });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to download credentials file"
    );
  }
};

export const deleteSchoolCredential = async (filename) => {
  try {
    const response = await instance.delete(
      `/schools/delete-credential/?filename=${encodeURIComponent(filename)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete credentials file"
    );
  }
};

export const fetchTutorChatSessions = async () => {
  try {
    const response = await instance.get(`/tutor/sessions/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch chat sessions"
    );
  }
};

export const createTutorChatSession = async (formData) => {
  try {
    const response = await instance.post(`/tutor/sessions/`, formData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch chat sessions"
    );
  }
};

export const fetchTutorChatSessionMessages = async (chat_id) => {
  try {
    const response = await instance.get(`/tutor/sessions/${chat_id}/messages/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch chat sessions"
    );
  }
};

export const sendTutorChatMessage = async (chat_id, formData) => {
  try {
    const response = await instance.post(
      `/tutor/sessions/${chat_id}/send/`,
      formData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch chat sessions"
    );
  }
};

export const incrementSchoolGrades = async (schoolId) => {
  try {
    const response = await instance.patch(
      `/schools/${schoolId}/increment-grade/`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to increment school grades"
    );
  }
};

export const decrementSchoolGrades = async (schoolId) => {
  try {
    const response = await instance.patch(
      `/schools/${schoolId}/decrement-grade/`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to decrement school grades"
    );
  }
};

export const incrementClassGrades = async (schoolId, classId) => {
  try {
    const response = await instance.patch(
      `/schools/${schoolId}/classes/${classId}/increment-grade/`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to increment class grades"
    );
  }
};

export const decrementClassGrades = async (schoolId, classId) => {
  try {
    const response = await instance.patch(
      `/schools/${schoolId}/classes/${classId}/decrement-grade/`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to decrement class grades"
    );
  }
};

export const incrementClassGradesGlobally = async () => {
  try {
    const response = await instance.patch(`/schools/increment-grades-global/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to increment class grades globally"
    );
  }
};

export const decrementClassGradesGlobally = async () => {
  try {
    const response = await instance.patch(`/schools/decrement-grades-global/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to decrement class grades globally"
    );
  }
};
