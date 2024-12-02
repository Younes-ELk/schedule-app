import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ScheduleList from "./components/ScheduleList";
import AddSchedule from "./components/AddSchedule";
import CalendarView from "./components/CalendarView";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Router>
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 bg-gray-50">
          <Routes>
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/schedules" />}
            />
            <Route
              path="/signup"
              element={!isAuthenticated ? <Signup /> : <Navigate to="/schedules" />}
            />
            {isAuthenticated && (
              <>
                <Route path="/schedules" element={<ScheduleList />} />
                <Route path="/add-schedule" element={<AddSchedule />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route path="*" element={<Navigate to="/schedules" />} />
              </>
            )}
            {!isAuthenticated && <Route path="*" element={<Navigate to="/login" />} />}
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
