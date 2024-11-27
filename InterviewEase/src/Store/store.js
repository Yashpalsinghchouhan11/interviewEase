import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "../Features/userSlice";
import toastSlice from "../Features/toastSlice";
import questionSlice from "../Features/questionSlice";
import errorSlice from "../Features/errorSlice"
import answerSlice from "../Features/answersSlice"
import getQuestionsSlice from "../Features/getQuestions"


// Individual persist configurations for each slice
const userPersistConfig = {
    key: 'user',
    storage: storage,
    blacklist: [], // Specify which part of user state you don't want to persist
};

const toastPersistConfig = {
    key: 'toast',
    storage: storage,
    // You can add a blacklist or whitelist if needed
};

const questionPersistConfig = {
    key: 'question',
    storage: storage,
    // You can add a blacklist or whitelist if needed
};

const errorPersistConfig = {
    key: 'error',
    storage: storage,
    // You can add a blacklist or whitelist if needed
};

// Create individual persisted reducers
const persistedUserReducer = persistReducer(userPersistConfig, userSlice);
// const persistedToastReducer = persistReducer(toastPersistConfig, toastSlice);
const persistedQuestionReducer = persistReducer(questionPersistConfig, questionSlice);
// const persistedErrorReducer = persistReducer(errorPersistConfig, errorSlice);

// Combine the persisted reducers
const rootReducer = combineReducers({
    user: persistedUserReducer,
    toast: toastSlice,
    question: persistedQuestionReducer,
    error:errorSlice,
    answer: answerSlice,
    getQuestions:getQuestionsSlice,
});


// Wrap the rootReducer with persistReducer
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['toast','error','getQuestions'], // Do not persist the entire toast slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with persistedReducer and apply thunk middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
});

// Create a persistor for the store
const persistor = persistStore(store);

// Export both the store and persistor
export { store, persistor };