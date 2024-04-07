import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import './App.css';
import Login from './pages/teacher/home';
import TeacherLayout from './pages/teacher/layout/layout';
import TeacherDashboard from './pages/teacher/dashboard';
import Question from './pages/teacher/question';
import SearchExam from './pages/teacher/searchExam';
import Answer from './pages/teacher/answer';
import SearchQuestion from './pages/teacher/searchExam/searchQuestion';
import Home from './pages/student/Home';
import Result from './pages/student/Dashboard';
import Exam from './pages/student/Exam';
import Layout from './pages/student/Layout';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Manager Router here */}
        <Route path="manager" element={<ManagerDashboard />} />
        {/* Student Router here */}
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="Result" element={<Result />} />
          <Route path="Exam" element={<Exam />} />
        </Route>
        {/* Teacher Router here */}
        <Route path="/login">
          {/* Trang chủ đăng nhập */}
          <Route index element={<Login />} />
        </Route>
        {/* Route trang Dashboard của giáo viên */}
        <Route path="teacher" element={<TeacherLayout />}>
          {/* Trang Dashboard chính */}
          <Route index element={<TeacherDashboard />} />
          {/* Route của trang Exam */}
          <Route path="question" element={<Question />} />
          {/* Route của trang SearchExam */}
          <Route path="searchExam" element={<SearchExam />} />

          <Route path="searchQuestion" element={<SearchQuestion />} />
          {/* Route của trang Answer */}
          <Route path="answer" element={<Answer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
