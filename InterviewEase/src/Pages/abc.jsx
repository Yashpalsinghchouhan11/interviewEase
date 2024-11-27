import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetAnswer } from "../Features/answersSlice";
import { interviewId } from "../Features/questionSlice";
// import { AudioUrl, TextAnswer, questionText } from "../Features/answersSlice";

function AudioRecorder() {
  const dispatch = useDispatch();

  // // Select interview ID and Redux state data
  const interview_id = useSelector(interviewId);
  // const audioUrl = useSelector(AudioUrl);
  // const textAnswer = useSelector(TextAnswer);
  // const question = useSelector(questionText);

  // // Fetch data when the component is mounted
  useEffect(() => {
    if (interview_id) {
      dispatch(asyncGetAnswer(interview_id));
    }
  }, [dispatch, interview_id]);
  return ;
  // return (
  //   <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
  //     <h2 className="text-2xl font-semibold mb-4">Interview Answer</h2>

  //     {/* Display Question */}
  //     <div className="mb-4">
  //       <h3 className="text-lg font-semibold text-gray-700">Question:</h3>
  //       <p className="text-gray-600">{question || "Fetching question..."}</p>
  //     </div>

  //     {/* Display Text Answer */}
  //     <div className="mb-4">
  //       <h3 className="text-lg font-semibold text-gray-700">Text Answer:</h3>
  //       <p className="text-gray-600">{textAnswer || "Fetching text answer..."}</p>
  //     </div>

  //     {/* Audio Player */}
  //     <div>
  //       <h3 className="text-lg font-semibold text-gray-700">Audio Answer:</h3>
  //       {audioUrl ? (
  //         <audio controls className="w-full mt-2">
  //           <source src={audioUrl} type="audio/mp3" />
  //           Your browser does not support the audio element.
  //         </audio>
  //       ) : (
  //         <p className="text-gray-600">Fetching audio...</p>
  //       )}
  //     </div>

  //     {/* Retry Button */}
  //     <button
  //       onClick={() => dispatch(asyncGetAnswer(interview_id))}
  //       className="mt-6 px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded"
  //     >
  //       Refresh Answer
  //     </button>
  //   </div>
  // );
}

export default AudioRecorder;
