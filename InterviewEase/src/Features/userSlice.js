import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "./toastSlice";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";
import {SetErrors} from "./errorSlice"

const initialState = {
  user: null,
  loading: false,
  audiofileUrls: '',
};

// Utility function to check if token is valid
function isTokenValid(token) {
  if (!token) return false;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Time in seconds
    return decodedToken.exp > currentTime; // Token is valid if expiry time is in the future
  } catch (error) {
    return false;
  }
}

// Signup API call
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

// Signup thunk
export const signupAsync = createAsyncThunk(
  "user/signup",
  async (formData, thunkAPI) => {
    try {
      const response = await signup(formData);
      if (response.status === 200) {
        thunkAPI.dispatch(
          showToast({ message: "SignUp successful!", status: "success" })
        );
        Cookies.set("access_token", response.data.access_token, {
          expires: 1 / 24,
          sameSite: "Lax",
        });
        thunkAPI.dispatch(logIn({}));
      }
    } catch (error) {
      if (error.response?.status === 400) {
        thunkAPI.dispatch(SetErrors({ email: error.response.data.error }));
      }
      thunkAPI.dispatch(
        showToast({ message: "Something went wrong!", status: "error" })
      );
    }
  }
);

// Login API call
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

// Login thunk
export const loginAsync = createAsyncThunk(
  "user/login",
  async (formData, thunkAPI) => {
    try {
      const response = await login(formData);
      if (response.status === 200) {
        thunkAPI.dispatch(
          showToast({ message: "Login successful!", status: "success" })
        );
        Cookies.set("access_token", response.data.access_token, {
          expires: 1 / 24,
          sameSite: "Lax",
        });
        thunkAPI.dispatch(logIn({}));
      }
    } catch (error) {
      if (error.response?.status === 404) {
        thunkAPI.dispatch(SetErrors({ email: error.response.data.error }));
      } else if (error.response?.status === 401) {
        thunkAPI.dispatch(SetErrors({ password: error.response.data.error }));
      }
      thunkAPI.dispatch(
        showToast({ message: "Something went wrong!", status: "error" })
      );
    }
  }
);

// // Greeting API call
// const Greeting = () => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get("http://127.0.0.1:8000/media/Greeting.mp3", { responseType: "blob" })
//       .then((response) => {
//         resolve(response);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// // Greeting thunk
// export const GreetingAsync = createAsyncThunk(
//   "user/greeting",
//   async (_, thunkAPI) => {
//     try {
//       const response = await Greeting();
//       if (response.status === 200) {
//         const blob = response.data;
//         const url = URL.createObjectURL(blob);
//         thunkAPI.dispatch(setFileUrl(url));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action) => {
      const token = Cookies.get("access_token");
      state.user = token && isTokenValid(token) ? jwtDecode(token) : null;
    },
    logOut: (state) => {
      state.user = null;
      Cookies.remove("access_token");
    },
    setAudioFileUrls: (state, action) => {
      state.audiofileUrls = action.payload;
    },
  },
});

export const { logIn, logOut, setAudioFileUrls } = userSlice.actions;

export const isAuthenticated = (state) =>
  isTokenValid(Cookies.get("access_token"));
export const user = (state) => state.user.user;
export const fileUrls = (state) => state.user.audiofileUrls;

export default userSlice.reducer;
