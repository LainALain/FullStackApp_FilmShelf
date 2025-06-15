import axios from 'axios';

const authApi = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3333',
  headers: { 'Content-Type': 'application/json' }
});

export function loginReq(email, password) {
  return authApi.post('/auth/login', { email, password });
}

export function registerReq(username, email, password) {
  return authApi.post('/auth/register', { username, email, password });
}
