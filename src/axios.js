import axios from "axios";

// Function to retrieve userData from localStorage
const getUserData = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return userData ? userData.token : null;
};

// Create axios instance
const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000", // Your base URL here
  baseURL: "https://backend-4k75.onrender.com/", // Your base URL here
  timeout: 20000, // Timeout in milliseconds
  headers: {
    "Content-Type": "application/json", // You can add default headers here
    "Access-Control-Allow-Origin": "*",
  },
});

// Add request interceptor to axios instance
axiosInstance.interceptors.request.use(
  (config) => {
    // Get userData token
    const token = getUserData();
    // If token exists, set authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
