import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetAnswer, answers } from "../Features/answersSlice";
import { interviewId } from "../Features/questionSlice";
import { isAuthenticated } from "../Features/userSlice";
import { useNavigate } from "react-router-dom";

export function ReviewAnswer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogging = useSelector(isAuthenticated);
  const interview_id = useSelector(interviewId);
  const answer = useSelector(answers);

  useEffect(() => {
    if (!isLogging) {
      navigate("/login");
    }
  }, [isLogging, navigate]);

  useEffect(() => {
    if (interview_id) {
      dispatch(asyncGetAnswer(interview_id));
    }
  }, [dispatch, interview_id]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-slate-200 p-6 mt-16">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-rose-500 mb-4">
          Review Interview Answer
        </h1>
        <p className="text-center text-rose-600 mb-2">
          Disclaimer: If your speech is not clear or loud enough, the
          speech-to-text may have inaccuracies.
        </p>
        <p className="text-center text-gray-600 mb-8">
          Review the questions and your responses to improve your preparation.
        </p>

        <div className="flex flex-col space-y-6">
          {answer.map((answer, index) => (
            <div
              key={answer.id}
              className="p-6 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Question {index + 1}:{" "}
                <span className="font-normal">{answer.question}</span>
              </h3>
              <p className="text-lg text-gray-700">
                <span className="font-bold">Your Answer:</span>{" "}
                {answer.answer_text}
              </p>
              <audio className="w-full mt-2" controls src={answer.audio_path} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-emerald-600 transition duration-300 mx-4">
            Download Analysis Report
          </button>
          <button className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300 mx-4">
            Retake Interview
          </button>
        </div>
      </div>
    </div>
  );
}
