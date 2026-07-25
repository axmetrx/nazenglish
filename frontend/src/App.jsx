import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Student from './pages/Student';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ClassPage from './pages/ClassPage';

function PrivateTeacher({ children }) {
  return localStorage.getItem('teacher_token') ? children : <Navigate to="/admin/login" replace />;
}

function PrivateStudent({ children }) {
  return localStorage.getItem('student_token') ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student routes */}
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<PrivateStudent><Student /></PrivateStudent>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<PrivateTeacher><Dashboard /></PrivateTeacher>} />
        <Route path="/admin/class/:id" element={<PrivateTeacher><ClassPage /></PrivateTeacher>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
