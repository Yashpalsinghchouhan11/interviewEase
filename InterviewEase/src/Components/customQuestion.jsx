import { useState } from "react"

export function CustomQuestion({disable, setComponent, component, removeIndex, setDisable}) {

    const [questions, setQuestions] = useState([])
    const handleremove = () =>{
        component.splice(removeIndex,1)
        setComponent(component)
        setDisable(prev=>prev-1)  
        console.log(questions);
    }
    

    const handleChange = (e)=>{
        const question = e.target.value;
        setQuestions([...questions, question])
    }
    
  return (
    <>
      <div className="w-full flex justify-center mt-8">
        <input
          type="text"
          className="w-2/4 px-2 py-2 border-2 border-slate-400 shadow-md rounded-md"
          placeholder={`Question - ${removeIndex + 1}`}
          onChange={handleChange}
        />
          <button hidden={disable == 1 ? true : false} onClick={handleremove}  className="text-sm shadow-xl px-4 py-2 mx-2 bg-slate-300 rounded-md disabled:bg-slate-200 disabled:cursor-not-allowed">
            Remove
          </button>
      </div>
    </> 
  );
}
