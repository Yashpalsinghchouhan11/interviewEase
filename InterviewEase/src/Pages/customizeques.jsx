

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {asyncSetQuestions, domain} from "../Features/questionSlice"

export function CustomizeQuestionList() {
  const [disable, setDisable] = useState(1);
  const [component, setComponent] = useState([0]);
  const [questions, setQuestions] = useState([""]);
  const [question_no, setQuestions_no] = useState(1);
  const dispatch = useDispatch();
  const Domain = useSelector(domain)

  const addMoreQuestion = () => {
    setDisable((prev) => prev + 1);
    setComponent([...component, disable]);
    setQuestions([...questions, ""]);
  };

  const handleremove = (index) => {
    const newComponent = component.filter((_, i) => i !== index);
    const newQuestions = questions.filter((_, i) => i !== index);
    setComponent(newComponent);
    setQuestions(newQuestions);
    setDisable((prev) => prev - 1);
  };

  const handleChange = (e, index) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? e.target.value : q
    );
    setQuestions(updatedQuestions);
  };

  const submit = () => {
    const transformedQuestions = questions.map(question => ({ question_text: question }));
    const formData = {
      "domain": Domain,
      "questions": transformedQuestions
    }

    dispatch(asyncSetQuestions(formData));
  };

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <h1 className="text-2xl font-bold">Custom Questions</h1>
      {component.map((comp, index) => (
        <div className="w-full flex justify-center mt-8" key={index}>
          <input
            type="text"
            className="w-2/4 px-2 py-2 border-2 border-slate-400 shadow-md rounded-md"
            placeholder={`Question - ${index + 1}`}
            onChange={(e) => handleChange(e, index)}
            name={`question-${index + 1}`}
            value={questions[index]}
          />
          <button
            hidden={disable === 1}
            onClick={() => handleremove(index)}
            className="text-sm shadow-xl px-4 py-2 mx-2 bg-slate-300 rounded-md disabled:bg-slate-200 disabled:cursor-not-allowed"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        hidden={component.length >= 5}
        onClick={addMoreQuestion}
        className="text-sm shadow-xl px-4 py-2 mt-4 bg-slate-300 rounded-md disabled:text-slate-200 disabled:cursor-not-allowed"
      >
        Add more question field
      </button>
      <Link
        to={`/category/domain/start?question=${question_no}`}
        hidden={questions[0] == "" ? true : false}
        className="text-sm shadow-xl px-4 py-2 mt-4 bg-slate-300 rounded-md disabled:text-slate-200 disabled:cursor-not-allowed"
        onClick={submit}
      >
        Submit
      </Link>
    </div>
  );
}
