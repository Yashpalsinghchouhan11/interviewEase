import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { showToast } from "./toastSlice";

const initialState = {
    questions : null,
    Answers:[''],
    domain:null,
    interviewId: null
}

export const questions = (domain) =>{
    return new Promise((resolve, reject)=>{
        
        axios.get(`http://127.0.0.1:8000/login/media/get_questions/${domain}`)
        .then((response)=>{
            resolve(response)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

export const asyncQuestions = createAsyncThunk('getQuestion', async (domain,thunkAPI)=>{

    try {
        const response = await questions(domain);
        
        if (response.status == 200){
            const q = response.data.questions
            thunkAPI.dispatch(setQuestion(q))
        }
    } catch (error) {
        console.log(error)
    }
})

export const setQuestions = (formData) =>{
    return new Promise((resolve, reject)=>{
        const token = Cookies.get("access_token");
        axios.post(`http://127.0.0.1:8000/login/interview/create/`,formData,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
        })
        .then((response)=>{
            resolve(response)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

export const asyncSetQuestions = createAsyncThunk('setQuestion', async (formData,thunkAPI)=>{

    try {
        const response = await setQuestions(formData);
       
        if (response.data.status == 'success'){
            console.log(response.data)
            thunkAPI.dispatch(setInterviewId(response.data.interview_id))
        }
    } catch (error) {
        console.log(error)
        if (error.response.status == 401){
            thunkAPI.dispatch(showToast({ message: "invalid token or may be expire", status: "error" }))
        }
        if (response.data.status == 'error'){
            thunkAPI.dispatch(showToast({ message: response.data.message, status: "error" }))
        }
    }
})


export const getQuestions = (interview_id) =>{
    const token = Cookies.get("access_token");
    return new Promise((resolve, reject)=>{
        axios.get(`http://127.0.0.1:8000/login/getquestions/${interview_id}`,{
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-type": "Application/json"
            }
        })
        .then((response)=>(
            resolve(response)
        ))
        .then((error)=>(
            reject(error)
        ))
    })
}

export const asyncGetQuestions = createAsyncThunk('getQuestions', async (thunkAPI, interviewId)=>{

    try {
        const response = getQuestions(interviewId)
        if (response.status == 200){
            console.log(response)
        }
        
    } catch (error) {
        console.log(error)
    }
})



export const questionSlice = createSlice({
    name:'question',
    initialState,
    reducers:{
        setQuestion: (state, action)=>{
            state.questions = action.payload
            
        },
        setAnswers: (state, action)=>{
            state.Answers = action.payload
            
        },
        setDomain: (state, action)=>{
            state.domain = action.payload
        },
        setInterviewId: (state, action)=>{
            state.interviewId = action.payload
            
        },
    }
})

export const {setQuestion, setAnswers, setDomain, setInterviewId} = questionSlice.actions
export const question = (state) => state.question.questions
export const Answers = (state)=>state.question.Answers
export const domain = (state) =>state.question.domain
export const interviewId = (state) =>state.question.interviewId

export default questionSlice.reducer;