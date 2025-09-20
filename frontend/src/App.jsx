import React, { useEffect } from "react";
import Navbar from "./component/Navbar";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {

  const {checkAuth, authuser, isCheckingAuth} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  }, [checkAuth])
  console.log({authuser});
  
  if(!authuser && isCheckingAuth){
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={authuser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authuser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authuser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={ <SettingPage />} />
        <Route path="/profile" element={authuser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
