// axios.js
import axios from 'axios';

const userData = JSON.parse(localStorage.getItem('userData'));

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Your base URL here
  timeout: 20000, // Timeout in milliseconds
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData'))?.token}`,
    'Content-Type': 'application/json', // You can add default headers here
    'Access-Control-Allow-Origin': '*',
  },
});

export default axiosInstance;