import { useEffect, useState } from "react";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Layout from "./Components/Layout.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./Pages/Signup.jsx";
import Category from "./Pages/Categories.jsx";
import StartInterview from "./Pages/StartInterview.jsx";
import { useSelector } from "react-redux";
import Questions from "./Pages/Questions.jsx";
import { ReviewAnswer } from "./Pages/Review.jsx";
import { CustomizeQuestionList } from "./Pages/customizeques.jsx";
import AuthWatcher from "./Components/authWatcher.jsx";
import AudioRecorder from "./Pages/abc.jsx";

function App() {

  return (
    <BrowserRouter>
    <AuthWatcher />
      <Routes>
        <Route
          path=""
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/category"
          element={
            <Layout>
              <Category />
            </Layout>
          }
        />
        <Route
          path={`/category/domain`}
          element={
            <Layout>
              <StartInterview />
            </Layout>
          }
        />
        <Route
          path="/category/domain/start"
          element={
            <Layout>
              <Questions />
            </Layout>
          }
        />
        <Route
        path="/category/domain/start/reviewanswer"
        element={<Layout>
          <ReviewAnswer/>
        </Layout>}
        />
        <Route
        path="/category/domain/start/reviewanswer/test"
        element={<Layout>
          <AudioRecorder/>
        </Layout>}
        />
        <Route
        path="/category/domain/custom-question"
        element={<Layout>
          <CustomizeQuestionList/>
        </Layout>}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/category" element={<Category />} /> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
