// axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Your base URL here
  timeout: 20000, // Timeout in milliseconds
  headers: {
    'Content-Type': 'application/json', // You can add default headers here
    'Access-Control-Allow-Origin': '*',
    
  },
});

export default axiosInstance;