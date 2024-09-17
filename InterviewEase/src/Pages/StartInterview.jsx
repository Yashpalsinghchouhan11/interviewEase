import React from "react";
import image from "../assets/gettingstart.jpeg";
import InfoIcon from '@mui/icons-material/Info';
import {Link} from 'react-router-dom'
import { useSearchParams } from "react-router-dom";
import {useDispatch} from "react-redux"
import { asyncQuestions } from "../Features/questionSlice";

export default function StartInterview() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams();
  const domain = searchParams.get('domain');
  
  const getQuestions = () =>{
    dispatch(asyncQuestions(domain));
  }

  return (
    <div className="h-screen bg-white flex justify-center items-center ">
      <div className="flex flex-col  bg-slate-100 items-center shadow-md py-4 rounded-lg hover:shadow-xl">
        <div className=" p-4">
          <img src={image} alt="" className="max-h-48 max-w-80" />
        </div>
        <h1 className="text-md font-semibold text-zinc-700 mt-4">
          Answer all the interview questions
        </h1>
        <p className="text-md text-zinc-700 my-4">
          When you are done, review your answers
        </p>

        <Link to={`/category/domain/start?domain=${domain}`} onClick={getQuestions} className="bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 w-3/4 hover:shadow-lg">
          Start
        </Link>
        <Link to="/category/domain/custom-question" className="bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 w-3/4 hover:shadow-lg">
          Customize questions
        </Link>
      </div>
    </div>
  );
}
