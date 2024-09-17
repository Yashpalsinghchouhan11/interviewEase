import React from "react";
import { configureStore, applyMiddleware } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk';
import userSlice from "../Features/userSlice";
import toastSlice from "../Features/toastSlice";
import questionSlice from "../Features/questionSlice";

const store = configureStore({
    reducer : {
        user: userSlice,
        toast: toastSlice,
        question:questionSlice,
        
    }
   
}, applyMiddleware(thunk));

export default store;