import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    questions : null,
    Answers:[''],
    disable: 1,
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

export const questionSlice = createSlice({
    name:'question',
    initialState,
    reducers:{
        setQuestion: (state, action)=>{
            console.log(action.payload)
            state.questions = action.payload
            
        },
        setAnswers: (state, action)=>{
            state.Answers = action.payload
            
        },
        setDisable: (state, action)=>{
            state.disable = action.payload
            
        },
    }
})

export const {setQuestion, setAnswers, setDisable} = questionSlice.actions
export const question = (state) => state.question.questions
export const Answers = (state)=>state.question.Answers
export const disable = (state)=>state.question.disable

export default questionSlice.reducer;