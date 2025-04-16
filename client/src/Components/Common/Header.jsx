import React, { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  LogInIcon,
  LogOutIcon,
  IndianRupee,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import Button from "./Button";
import { GetCurrentUser, UserLogOut } from "../../Store/userSlice";

function Header() {
  const loginStatus = useSelector((state) => state.user.status);
  const UserData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(UserData);
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Initialize dark mode on component mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  useEffect(() => {
    if (UserData?.data?.amount === undefined) {
      dispatch(GetCurrentUser()).unwrap();
    }
  }, []);

  const navitems = [
    {
      name: "Sign up",
      path: "/signup",
      Status: !loginStatus,
      icon: <LogInIcon className="h-6 w-6 text-white dark:text-black" />,
    },
    {
      name: "Login",
      path: "/signin",
      Status: !loginStatus,
      icon: <LogOutIcon className="h-6 w-6 text-white dark:text-black" />,
    },
    {
      name: Math.round(UserData?.data?.amount),
      Status: loginStatus,
      path: "/dashboard",
      icon: <IndianRupee className="h-6 w-6 text-white dark:text-black" />,
    },
  ];

  const logout = async () => {
    try {
      const user = await dispatch(UserLogOut()).unwrap();
      if (user) {
        sessionStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  const toggleDarkMode = () => {
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-white dark:bg-black text-black dark:text-white p-4 flex flex-wrap items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold">InvestTrack</h1>

      <div className="flex items-center space-x-4 md:order-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-white" />
          ) : (
            <MoonIcon className="h-6 w-6 text-black" />
          )}
        </button>

        <div className="flex space-x-2">
          {navitems.map((option) => {
            return option.Status ? (
              <Link to={option.path} key={option.path}>
                <Button
                  className={`px-4 py-1 flex items-center gap-2 rounded-md transition duration-300 
                    ${
                      darkMode
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  type="button"
                >
                  {option.icon}
                  {option.name}
                </Button>
              </Link>
            ) : null;
          })}

          {loginStatus ? (
            <Button
              className={`px-4 py-1 flex items-center gap-2 rounded-md transition duration-300 
                ${
                  darkMode
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              type="button"
              onClick={logout}
            >
              Logout
            </Button>
          ) : null}
        </div>
      </div>

      <ul className="flex space-x-6 mt-2 md:mt-0 w-full md:w-auto md:order-1 justify-center">
        <li>
          <a href="#features" className="hover:text-gray-400">
            Features
          </a>
        </li>
        <li>
          <a href="#pricing" className="hover:text-gray-400">
            Pricing
          </a>
        </li>
        <li>
          <a href="#contact" className="hover:text-gray-400">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
