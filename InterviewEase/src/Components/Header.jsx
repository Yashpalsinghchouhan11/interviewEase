import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, logOut } from "../Features/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const LoggedIn = useSelector(isAuthenticated)
  const location = useLocation();
  const iconColor = location.pathname === "/";

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleLogout = () =>{
    dispatch(logOut())
    navigate("/")
  }

  return (
    <>
      <header
        className={`fixed flex items-center justify-between p-4 w-full ${
          iconColor ? "" : "bg-transparent"
        }`}
      >
        <button type="button" onClick={handleToggle}>
          <MenuIcon
            className={`cursor-pointer ${
              iconColor ? "text-white" : "text-black"
            }`}
            style={{ height: "2rem", width: "3rem" }}
          />
        </button>

        <h1 className="gradient-text text-2xl font-semibold tracking-normal max-md:text-lg">
          InterviewEase
        </h1>
        {!LoggedIn && (
          <nav className="max-md:hidden">
            <ul className="flex space-x-4 max-md:space-x-1 max-md:hidden">
              <li>
                <Link
                  to="/login"
                  className="text-white p-2 bg-rose-500 rounded-tl-xl rounded-br-xl"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-white p-2 bg-rose-500 rounded-tl-xl rounded-br-xl"
                >
                  Signup
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <nav
        className={`h-screen w-48 fixed top-0 left-0 bg-rose-500 max-md:bg-opacity-95 transition-transform transform duration-300 ${
          toggle ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <CloseIcon
          onClick={() => handleToggle(false)}
          className=" float-end text-white p-2 cursor-pointer"
          style={{ height: "3rem", width: "3rem" }}
        />
        <ul className=" mt-10 ml-4">
          <li className="text-white my-4 font-bold cursor-pointer tracking-wide hover:underline hover:underline-offset-8 hover:decoration-4">
            Home
          </li>
          <li className="text-white my-4 font-bold cursor-pointer tracking-wide hover:underline hover:underline-offset-8 hover:decoration-4">
            Register
          </li>
          <li className="text-white my-4 font-bold cursor-pointer tracking-wide hover:underline hover:underline-offset-8 hover:decoration-4">
            Contact
          </li>
          { !LoggedIn && (
            <>
              <li className="text-white my-4 font-bold cursor-pointer tracking-wide hover:underline hover:underline-offset-8 hover:decoration-4">
                <Link to="/login">Login</Link>
              </li>
              <li className="text-white my-4 font-bold cursor-pointer tracking-wide hover:underline hover:underline-offset-8 hover:decoration-4">
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
          { LoggedIn && (
          <li className="text-white my-4 font-bold cursor-pointer tracking-wide hover:underline hover:underline-offset-8 hover:decoration-4">
                <Link onClick={handleLogout}>Logout</Link>
              </li>
          )}
        </ul>
      </nav>
    </>
  );
}
