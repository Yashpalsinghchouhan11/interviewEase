import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { showToast } from "./toastSlice";

const initialState = {
    index:0,
    currentQuestion:null,
    totalQuestions:null,
    questionId:null
}

// export const getQuestions = (interview_id, formData) =>{  
//     const token = Cookies.get("access_token");
//     return new Promise((resolve, reject)=>{
//         axios.get(`http://127.0.0.1:8000/login/getquestions/${interview_id}`,formData,{
//             headers:{
//                 "Authorization": `Bearer ${token}`,
//                 "Content-type": "Application/json"
//             }
//         })
//         .then((response)=>(
//             resolve(response)
//         ))
//         .then((error)=>(
//             reject(error)
//         ))
//     })
// }
export const getQuestions = (interview_id, index) => {
    const token = Cookies.get("access_token");

    return new Promise((resolve, reject) => {
        axios
            .get(`http://127.0.0.1:8000/login/getquestions/${interview_id}`, {
                params: { index }, // Pass index as a query parameter
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json", // Correct spelling of 'Content-Type'
                },
            })
            .then((response) => {
                resolve(response.data); // Return only the response data
            })
            .catch((error) => {
                reject(error.response?.data || { message: "Unknown error occurred" });
            });
    });
};

export const asyncGetQuestions = createAsyncThunk(
    'getQuestions',
    async ({ interviewId, index }, thunkAPI) => {
        try {
            // Await the API response
            const response = await getQuestions(interviewId, index);
            if (response.status === 200) {
                // Dispatch actions to update the state
                thunkAPI.dispatch(setIndex(response.index));
                thunkAPI.dispatch(setQuestions(response.question));
                thunkAPI.dispatch(setTotalQuestion(response.total_questions));
                thunkAPI.dispatch(setQuestionId(response.questionId))
            } 
        } catch (error) {
            console.error("Error fetching questions:", error);
            // Optionally dispatch an error toast
            thunkAPI.dispatch(showToast({ message: "Failed to fetch questions", type: "error" }));
        }
    }
);


const getQuestionsSlice = createSlice({
    name:'getQuestions',
    initialState,
    reducers:{
        setQuestions: (state, action)=>{
            state.currentQuestion = action.payload
        },
        setIndex: (state, action)=>{
            state.index = action.payload
        },
        setTotalQuestion: (state, action)=>{
            state.totalQuestions = action.payload
        },
        setQuestionId: (state, action) =>{
            state.questionId = action.payload
        }
    }
})

export const {setQuestions, setIndex, setTotalQuestion, setQuestionId} = getQuestionsSlice.actions
export const questions = (state) => state.getQuestions.currentQuestion
export const index = (state) => state.getQuestions.index
export const totalQuestions = (state) => state.getQuestions.totalQuestions
export const questionId = (state) => state.getQuestions.questionId


export default getQuestionsSlice.reducer;