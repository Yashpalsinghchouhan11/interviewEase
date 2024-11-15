import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signupAsync, isAuthenticated } from "../Features/userSlice";
import {SetErrors, Newerrors} from "../Features/errorSlice"
export default function Signup() {
  const [formdata, setFormdata] = useState({
    username: "",
    email: "",
    password: "",
  });
  // const [errors, setError] = useState({})
  const navigate = useNavigate();
  const errors = useSelector(Newerrors);
  const LoggedIn = useSelector(isAuthenticated);
  const dispatch = useDispatch();
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const validate = () => {
    const newError = {};

    if (!formdata.username.trim()) newError.username = "Name is required";

    if (!formdata.email.trim()) {
      newError.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formdata.email)) {
      newError.email = "Email is invalid!";
    }

    if (!formdata.password.trim()) {
      newError.password = "Password is required!";
    } else if (formdata.password.length <= 7) {
      newError.password = "Password must be at least 8 characters long!";
    }
    return newError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(SetErrors({})); // Clear previous errors
    const error = validate();
    if (Object.keys(error).length > 0) {
      dispatch(SetErrors(error));
    } else {
      dispatch(signupAsync(formdata));
    }
  };
  

  const loading = useSelector(state => state.user.loading); // Example loading selector

  useEffect(() => {
    if (LoggedIn && !loading) {
      setFormdata({
        username: "",
        email: "",
        password: ""
      });
      dispatch(SetErrors({}));
      navigate('/');
    }
  }, [LoggedIn, loading, dispatch, navigate]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg ">
        <h3 className="gradient-text text-center mt-4 text-xl font-bold">
          InterviewEase
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col my-4">
          <label htmlFor="Name" className="my-4">
            Name
          </label>
          <input
            type="text"
            name="username"
            className="border border-gray-600 p-2 rounded-md"
            placeholder="Full name"
            required
            value={formdata.username}
            onChange={handleOnchange}
          />
          {errors?.username && (
            <p className="text-rose-600">{errors.username}</p>
          )}
          <label htmlFor="Email" className="my-4">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="border border-gray-600 p-2 rounded-md"
            placeholder="Email address"
            required
            value={formdata.email}
            onChange={handleOnchange}
          />
          {errors?.email && <p className="text-rose-600">{errors.email}</p>}
          <label htmlFor="Password" className="my-4">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="border border-gray-600 p-2 rounded-md"
            placeholder="Password"
            required
            value={formdata.password}
            onChange={handleOnchange}
          />
          {errors?.password && (
            <p className="text-rose-600">{errors.password}</p>
          )}
          <button
            type="submit"
            className="bg-rose-500 p-2 cursor-pointer rounded-md my-4 text-white"
          >
            Signup
          </button>
          <div className="flex items-center justify-center mb-2">
            <span>Already have an account? </span>
            <Link to="/login" className="text-red-500 ml-1">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
