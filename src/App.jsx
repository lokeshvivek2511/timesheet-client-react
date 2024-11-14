import { Routes, Route, Navigate,BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Adminlogin from "./components/adminlogin";
import Admin from "./components/admin";
import { ToastContainer } from "react-toastify";
import { createContext, useState, useEffect } from 'react';
import './Home.css'

export const UserContext = createContext();

function App() {
  const [userEmail, setUserEmail] = useState(() => {
    // Initialize userEmail from localStorage if it exists
    return localStorage.getItem('userEmail') || ""
  });

  // Update localStorage whenever userEmail changes
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [userEmail]);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('userEmail');
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <UserContext.Provider value={{ userEmail, setUserEmail }}>
        <Routes>
          <Route path="/adminlogin" element={<Adminlogin/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/login" element={
            userEmail ? <Navigate to="/home" /> : <Login />
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/signup" replace />} />
        </Routes>
      </UserContext.Provider>
      <ToastContainer />
    </>
  );
}

export default App;
