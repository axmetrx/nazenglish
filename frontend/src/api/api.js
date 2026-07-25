import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Автоматически добавляем токен в заголовки
api.interceptors.request.use((config) => {
  let token;
  const url = config.url || '';
  if (
    url === '/students/class' ||
    url === '/students/leaderboard/class' ||
    url === '/students/activity' ||
    url === '/students/activity/weekly' ||
    url.startsWith('/students/progress') ||
    url.startsWith('/games/student')
  ) {
    token = localStorage.getItem('student_token');
  } else {
    token = localStorage.getItem('teacher_token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth (Teacher) ──────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  guestLogin: (data) => api.post('/auth/guest', data),
  me: () => api.get('/auth/me'),
};

// ─── Classes ─────────────────────────────────────────────────
export const classesAPI = {
  getAll: () => api.get('/classes'),
  getStats: () => api.get('/classes/stats'),
  getOne: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
};

// ─── Videos ──────────────────────────────────────────────────
export const videosAPI = {
  getByClass: (classId) => api.get(`/videos/${classId}`),
  create: (classId, data) => api.post(`/videos/${classId}`, data),
  update: (id, data) => api.put(`/videos/item/${id}`, data),
  delete: (id) => api.delete(`/videos/item/${id}`),
};

// ─── Students ────────────────────────────────────────────────
export const studentsAPI = {
  join: (data) => api.post('/students/join', data),
  getClass: () => api.get('/students/class'),
  getLeaderboard: () => api.get('/students/leaderboard/class'),
  getWeeklyActivity: () => api.get('/students/activity/weekly'),
  getByClass: (classId) => api.get(`/students/${classId}`),
  sendActivity: () => api.post('/students/activity'),
  markVideoWatched: (videoId) => api.post(`/students/progress/${videoId}`),
  delete: (id) => api.delete(`/students/${id}`),
};

// ─── Games ───────────────────────────────────────────────────
export const gamesAPI = {
  // Teacher
  getByClass: (classId) => api.get(`/games/${classId}`),
  create: (classId, data) => api.post(`/games/${classId}`, data),
  delete: (id) => api.delete(`/games/item/${id}`),
  // Student
  getForStudent: () => api.get('/games/student/list'),
  complete: (id, score) => api.post(`/games/student/complete/${id}`, { score }),
};

export default api;
