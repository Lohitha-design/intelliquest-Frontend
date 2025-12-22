import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Test from './pages/Test';
import Questions from './pages/Questions';
import Score from './pages/Score';
import InterviewSession from './pages/InterviewSession'; // ✅ Interview session
import Performance from './pages/Performance'; // ✅ Performance dashboard

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/test" element={<Test />} />
      <Route path="/questions" element={<Questions />} />
      <Route path="/score" element={<Score />} />
      <Route path="/interview" element={<InterviewSession />} />
      <Route path="/dashboard/performance" element={<Performance />} /> {/* ✅ New route */}
      <Route path="/performance" element={<Performance />} />
    </Routes>
  );
}

export default App;