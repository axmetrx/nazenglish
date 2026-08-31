import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    url.startsWith('/games/student') ||
    url.startsWith('/dictionary/student') ||
    url.startsWith('/homeworks/student')
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

// Автоматический перенаправление при истечении сессии (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      if (url.startsWith('/students') || url.startsWith('/games/student')) {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_data');
        if (window.location.pathname.startsWith('/student')) {
          window.location.href = '/';
        }
      } else {
        localStorage.removeItem('teacher_token');
        localStorage.removeItem('teacher_data');
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

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
  syncGrades: () => api.post('/classes/sync-grades'),
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
  login: (data) => api.post('/students/login', data),
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
  update: (id, data) => api.put(`/games/item/${id}`, data),
  delete: (id) => api.delete(`/games/item/${id}`),
  // Student
  getForStudent: () => api.get('/games/student/list'),
  complete: (id, score) => api.post(`/games/student/complete/${id}`, { score }),
};

// ─── Dictionary ──────────────────────────────────────────────
export const dictionaryAPI = {
  // Teacher
  getByClass: (classId) => api.get(`/dictionary/${classId}`),
  create: (classId, data) => api.post(`/dictionary/${classId}`, data),
  update: (id, data) => api.put(`/dictionary/item/${id}`, data),
  delete: (id) => api.delete(`/dictionary/item/${id}`),
  syncFromGames: (classId) => api.post(`/dictionary/${classId}/sync-games`),
  // Student
  getForStudent: () => api.get('/dictionary/student/list'),
};

// ─── Homeworks ───────────────────────────────────────────────
export const homeworksAPI = {
  // Teacher
  getByClass: (classId) => api.get(`/homeworks/class/${classId}`),
  create: (classId, data) => api.post(`/homeworks/class/${classId}`, data),
  update: (id, data) => api.put(`/homeworks/item/${id}`, data),
  delete: (id) => api.delete(`/homeworks/item/${id}`),
  getSubmissions: (homeworkId) => api.get(`/homeworks/submissions/${homeworkId}`),
  reviewSubmission: (submissionId, data) => api.post(`/homeworks/review/${submissionId}`, data),
  // Student
  getForStudent: () => api.get('/homeworks/student/list'),
  submit: (homeworkId, data) => api.post(`/homeworks/student/submit/${homeworkId}`, data),
};

export default api;
