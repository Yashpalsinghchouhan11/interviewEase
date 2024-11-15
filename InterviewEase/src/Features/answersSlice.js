import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  AudioAnswerfile: null,
  TextAnswer: null,
};

const setAnswer = (a) => {
  return new Promise((resolve, reject) => {
    axios
      .post("", a)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};

export const setAnswerAsync = createAsyncThunk(
  "setAnswer",
  async (formData, thunkAPI) => {
    console.log(formData);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log(data); // Note: Files won't show correctly, only text fields
  }
);

const answerSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    setAudioAnswer: (state, action) => {
      state.AudioAnswerfile = action.payload;
    },
    setTextAnswer: (state, action) => {
      state.TextAnswer = action.payload;
    },
  },
});

// export const {} = actions.reducers;

export default answerSlice.reducer;
