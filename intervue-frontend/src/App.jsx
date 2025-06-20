import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import Teacher from './pages/Teacher';
import StudentPoll from './pages/StudentPoll';
import ProtectedRoute from './components/ProtectedRoutes';
import Navbar from './components/Navbar';
import PollHistory from './pages/PollHistory';
import socket from "./js/socket"
import Kicked from './pages/Kicked';

function App() {
  
  useEffect(() => {
  socket.connect();
  return () => {
    socket.disconnect();
  };
}, []);

useEffect(() => {
  const studentName = sessionStorage.getItem("studentName"); // or however you store it

  const handleBeforeUnload = () => {
    if (studentName) {
      socket.emit("kickStudentByName", studentName);
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);



  return (
  
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student" element={<StudentLogin />} />
        <Route path="/history" element={<PollHistory/>} />
        <Route path="/kicked" element={<Kicked />} />
        <Route
          path="/student/poll"
          element={
            <ProtectedRoute>
              <StudentPoll />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    
  );
}

export default App;
