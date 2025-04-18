import axios from "axios";
import { API_URL } from "./config";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};
export const setRefreshToken = (token) =>
  localStorage.setItem(REFRESH_TOKEN_KEY, token);

export const clearTokens = () => {
  localStorage.clear();
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  // console.log("isAuthenticated token:", token); // Debugging log
  return !!token;
};

export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role || user?.parent;

  // console.log("getUserRole:", role); // Debugging log
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });
    if (response.status === 200) {
      const { data } = response;
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error("Email или пароль не правильный");
      } else if (error.response.status === 500) {
        throw new Error("Ошибка сервера. Попробуйте зайти позже");
      } else {
        throw new Error(error.response.data.detail || "Ошибка сервера");
      }
    } else {
      throw new Error("Ошибка с подключением к интернету");
    }
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  setAccessToken(data.access);
  return data.access;
};

export const logout = () => {
  clearTokens();
};
