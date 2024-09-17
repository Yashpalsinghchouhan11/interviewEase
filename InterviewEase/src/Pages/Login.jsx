import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isLoggedIn, Newerrors, SetErrors } from "../Features/userSlice";
import { loginAsync } from "../Features/userSlice";

export default function Login() {
  const [formdata, setFormdata] = useState({
    email:'',
    password:''
  });
  // const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const errors = useSelector(Newerrors)
  const LoggedIn = useSelector(isLoggedIn)
  const dispatch = useDispatch()

  const handleOnchange = (e) =>{
    const {name, value} = e.target;
    setFormdata({...formdata, [name]:value})
  }

  const validate = () =>{
    const newErros = {}
    if (!formdata.email.trim()){
      newErros.email = 'Email is required!'
    }else if (!/\S+@\S+\.\S+/.test(formdata.email)){
      newErros.email = 'Email is invalid!'
    }
    if (!formdata.password.trim()){
      newErros.password = 'Password is required!'
    }else if (formdata.password.length <= 7){
      newErros.password = 'Invalid Password!'
    }
    return newErros;
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    const ValidFormdata = validate();
    if (Object.keys(ValidFormdata).length > 0){
      dispatch(SetErrors(ValidFormdata))
    }else{
      dispatch(loginAsync(formdata))
      console.log(LoggedIn)
      if (LoggedIn){
        setFormdata({
          email:'',
          password:''
        })
        dispatch(SetErrors())
        navigate('/')
      }
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className=" max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h3 className="gradient-text text-center mt-2 text-xl font-bold">
          InterviewEase
        </h3>
        <h1 className="text-center m-2 text-2xl font-bold">Welcome back!</h1>

        <form action="" onSubmit={handleSubmit} className="flex flex-col my-4">
          <label htmlFor="Email" className="my-4">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="border border-gray-600 p-2 rounded-md"
            placeholder="Enter your email address"
            required
            value={formdata.email}
            onChange={handleOnchange}
          />
          {errors && <p className="text-rose-600">{errors.email}</p>}
          <label htmlFor="Password" className="my-4">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="border border-gray-600 p-2 rounded-md"
            placeholder="Enter your password"
            value={formdata.password}
            required
            onChange={handleOnchange}
          />
          {errors && <p className="text-rose-600">{errors.password}</p>}
          <button  className="bg-rose-500 p-2 cursor-pointer rounded-md my-4 text-white">
            Login
          </button>
          <div className="flex items-center justify-center mb-2">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-red-500 ml-1">
              Signup
            </Link>
          </div>
          <Link to="" className="text-center text-red-500">
            Forget your password?
          </Link>
        </form>
      </div>
    </div>
  );
}
