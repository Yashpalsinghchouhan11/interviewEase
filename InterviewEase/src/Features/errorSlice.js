import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    error : {}
}

const errorSlice = createSlice({
    name:'error',
    initialState,
    reducers:{
        SetErrors:(state, action)=>{
            state.error = action.payload
        }
    }
})

export const {SetErrors} = errorSlice.actions

export const Newerrors = (state) => state.error.error

export default errorSlice.reducer;