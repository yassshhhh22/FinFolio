import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./views/login.jsx";
import Register from "./views/register.jsx";
import VerifyOtpPage from "./views/verifyotp-page.jsx";
import { Outlet } from "react-router";
import Header from "./Components/Common/Header.jsx";
import Footer from "./Components/Common/Footer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { GetCurrentUser } from "./Store/userSlice.js";
import { ToastContainer } from "react-toastify";
import { useCallback } from "react";

function App() {
  const dispatch = useDispatch();

  const UserData = useSelector((state) => state.user.userData);

  const fetchCurrentUser = useCallback(async () => {
    try {
      await dispatch(GetCurrentUser()).unwrap();
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!UserData) {
      fetchCurrentUser();
    }
  }, [UserData, fetchCurrentUser]);

  return (
    <>
      <ToastContainer />
      <Header />
      <main className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
