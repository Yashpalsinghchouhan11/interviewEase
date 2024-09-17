import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "./toastSlice";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'


const initialState = {
  loggedIn: false,
  user: {},
  loading: false,
  errors: {},
  fileUrl:null
};

const signup = (formData) => {
  return new Promise((resolve, reject) => {
    axios
      .post("http://127.0.0.1:8000/signup/", formData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const signupAsync = createAsyncThunk(
  "signup",
  async (formData, thunkAPI) => {
    try {
      const response = await signup(formData);
      if (response.status == 200) {
        thunkAPI.dispatch(
          showToast({ message: "SignUp successfull!", status: "success" })
        );
        thunkAPI.dispatch(signUp({}));
        Cookies.set("access_token", response.data.access_token, {
            expires:'7',
            sameSite:'Lax'
        });
        // localStorage.setItem("refresh_token", response.data.refresh_token);
      }
    } catch (error) {
      if (error.response.status == 400) {
        thunkAPI.dispatch(SetErrors({ 'email': error.response.data.error}));
      }
      thunkAPI.dispatch(
        showToast({ message: "Something went wrong!", status: "error" })
      );
    }
  }
);

const login = (formData) => {
  return new Promise((resolve, reject) => {
    axios
      .post("http://127.0.0.1:8000/login/", formData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const loginAsync = createAsyncThunk(
  "login",
  async (formData, thunkAPI) => {
    try {
      const response = await login(formData);
      if (response.status == 200) {
        thunkAPI.dispatch(
          showToast({ message: "Login Successfull !", status: "success" })
        );
        Cookies.set("access_token", response.data.access_token, {
          expires: 7,
          sameSite:'Lax'
        });
        // localStorage.setItem("access_token", response.data.access_token);
        // localStorage.setItem("refresh_token", response.data.refresh_token);
        thunkAPI.dispatch(logIn({}));
      }
    } catch (error) {
        console.log(error.response.data.error)
        console.log(error.response.status)
        if (error.response.status == 404) {
          thunkAPI.dispatch(SetErrors({ 'email': error.response.data.error }));
        }
        if (error.response.status == 401) {
          thunkAPI.dispatch(SetErrors({ 'password': error.response.data.error }));
        }
      thunkAPI.dispatch(
        showToast({ message: "Something wents wrong!", status: "error" })
      );
    }
  }
);

const Greeting = () =>{
  return new Promise((resolve, reject) =>{
    axios.get('http://127.0.0.1:8000/media/Greeting.mp3',{ responseType: 'blob' })
    .then((response)=>{
      resolve(response)
    })
    .catch((error)=>{
      reject(error)
    })
  })
}

export const GreetingAsync = createAsyncThunk("Greeting", async ( _, thunkAPI)=>{
  try {
    const response = await Greeting();
    if (response.status == 200){
      const blob = await response.data;
      const url = URL.createObjectURL(blob)
      console.log(url);
      thunkAPI.dispatch(setFileUrl(url))
    }
    
  } catch (error) {
    console.log(error)
  }
  
})

function isToken(token){
    if (!token) return false
    const decodeToken = jwtDecode(token)
    const currentTime = Date.now();
    return decodeToken < currentTime;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.loggedIn = Cookies.get('access_token') ? true : false
      state.user = action.payload;
    },
    signUp: (state, action) => {
        state.loggedIn = true
      state.user = action.payload;
    },
    logOut: (state, action) => {
      state.loggedIn = false;
      Cookies.remove("access_token");
    //   localStorage.removeItem('access_token')
    },
    SetErrors: (state, action) => {
      state.errors = action.payload;
    },
    setFileUrl: (state,action)=>{
      state.fileUrl = action.payload
    }
  },
});

export const { logIn, signUp, logOut, SetErrors, setFileUrl } = userSlice.actions;

export const isLoggedIn = (state) => state.user.loggedIn;
export const user = (state) => state.user.user;
export const Newerrors = (state) => state.user.errors;
export const fileUrl = (state) => state.user.fileUrl;

export const isTopken =  isToken;

export default userSlice.reducer;
