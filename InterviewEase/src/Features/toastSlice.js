import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show : false,
    message: '',
    status: ''
}

 const toastSlice = createSlice({
    name:'toast',
    initialState,
    reducers:{
        showToast: (state, action) =>{
            state.show = true
            state.message = action.payload.message
            state.status = action.payload.status
        },
        hideToast: (state, action) =>{
            state.show = false
        }
    }
})

export const {showToast, hideToast} = toastSlice.actions;

export const toastShow = (state)=> state.toast.show
export const toastMessage = (state)=> state.toast.message
export const toastStatus = (state)=> state.toast.status

export default toastSlice.reducer;