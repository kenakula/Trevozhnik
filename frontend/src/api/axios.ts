import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5173',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});
