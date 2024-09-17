import { useSelector } from "react-redux";
import { Answers } from "../Features/questionSlice";
export function ReviewAnswer() {
    const answers = useSelector(Answers)
  return (
    <main className="flex flex-col items-center">
        <h1 className="text-2xl mt-16 mb-2 font-bold">Answers</h1>
      {answers.map((answer,index)=>(
        <div className="w-3/4 bg-slate-200 mt-8 p-8 text-xl shadow-md rounded-md" key={index}>
            <h1 className=" mb-4 text-md"><span className="font-bold">Question:</span> {answer['question']}</h1>
        <span className="font-bold">Your-Answer: </span> {answer['answer']}
      </div>
      ))}
    </main>
  );
}
