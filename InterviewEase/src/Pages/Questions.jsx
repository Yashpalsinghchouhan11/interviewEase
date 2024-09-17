import Interviewer from "../assets/Interviewer1.png";
import { Link, useSearchParams } from "react-router-dom";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MicIcon from "@mui/icons-material/Mic";
import { useSelector, useDispatch } from "react-redux";
import { asyncQuestions, question, setAnswers } from "../Features/questionSlice";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Questions() {

  const [recordStart, setRecordStart] = useState(false);
  const [redo, setReDo] = useState(true);
  const [save, setSave] = useState(false);
  const [ans, setAns] = useState(true)
  const [transcriptText, setTranscriptText] = useState('');
  const [question_no, setQuestion_no] = useState(0);
  const [ques, setQues] = useState('');
  const [answer, setAnswer] = useState([])

  const dispatch = useDispatch();
  const Question = useSelector(question);
  const audioFile = 1
  const synth = window.speechSynthesis;

  const speakIntro = () => {
    const greeting = `Hey Yashpal, Let's practice an interview.`;
    const utterance = new SpeechSynthesisUtterance(greeting);
    let voices = synth.getVoices();
    const selectedVoice = voices.find(
      (voice) => voice.name === "Microsoft Zira - English (United States)"
    );
    utterance.voice = selectedVoice;
    synth.speak(utterance);
  };

  useEffect(() => {
    setTimeout(() => {
      speakIntro();
    }, 1000);
  }, []);

  const speakQuestion = (Q) => {
    const greeting = Q;
    const utterance = new SpeechSynthesisUtterance(greeting);
    let voices = synth.getVoices();
    const selectedVoice = voices.find(
      (voice) => voice.name === "Microsoft Zira - English (United States)"
    );
    utterance.voice = selectedVoice;
    synth.speak(utterance);
  };

  const [searchParams] = useSearchParams();
  const domain = searchParams.get('domain');

  // useEffect(() => {
  //   dispatch(asyncQuestions(domain));
  // }, [dispatch, domain]);

  useEffect(() => {
    if (Question && Question.length > 0) {
      setQues(Question[0]);
      setTimeout(() => {
        speakQuestion(Question[0]);
      }, 2000);
    }
  }, [Question]);
  

  const handleSave = () => {
    resetTranscript()
    const ans = [...answer,{'question':ques, 'answer':transcriptText}]
    setAnswer(ans)
    setSave(false);
    setReDo(true)
    setAns(false)
  };


  useEffect(() => {
    if (answer.length > 0) {  // Make sure to only dispatch if there's something to dispatch
      dispatch(setAnswers(answer));
      console.log(transcriptText);
      
    }
  }, [answer]);

  const handleNext = () => {
    console.log(question_no)
    setTimeout(() => {
      if (question_no < Question.length) {
        const nextQuestion = Question[question_no + 1];
        setQues(nextQuestion);
        speakQuestion(nextQuestion);
        setQuestion_no((prevQuestionNo) => prevQuestionNo + 1);
        setReDo(true)
        setAns(true)
      }
    }, 1000);
  };

  const {
    transcript,
    listening,
    resetTranscript,
    abortListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const record = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
      setRecordStart(true);
    } else {
      console.log("Browser does not support speech recognition.");
    }
  };

  //Pending Task 
  const recordEnd = async() => {
    SpeechRecognition.stopListening();
    console.log(typeof(transcript));
    setTranscriptText(transcript);
    setRecordStart(false);
    setReDo(false);
    setSave(true);
    setAns(false)
  };

  const recordStartAgain = () => {
    setTranscriptText('');
    resetTranscript();
    setReDo(true);
    setRecordStart(false);
    setSave(false)
    setAns(true)
  };

  const SpeakQuestionAgain = () => {
    speakQuestion(Question[question_no])
  };

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col justify-center items-center ">
      {Question && Question.length > 0 ? (
        <>
          <img
            src={Interviewer}
            alt=""
            className="max-w-sm bg-white max-md:max-w-40 max-md:mt-8"
          />
          <div className="flex flex-col items-center mb-8 rounded-lg">
            <audio src="" controls autoPlay hidden>
              <source src={audioFile} type="audio/mpeg" />
            </audio>
            <h1 className="text-md font-semibold text-zinc-700 mt-4">
              Question - {question_no + 1}
              <span onClick={SpeakQuestionAgain}>
                <VolumeUpIcon style={{ height: '1.5rem', width: '2rem' }} />
              </span>
            </h1>
            <p className="text-lg text-zinc-700 my-4 px-16 shadow-md hover:shadow-xl">
              {/* Show question or a loading message */}
              {ques ? ques : ""}
            </p>
          </div>
          <div className="flex justify-between">
            {recordStart ? (
              <button
                className="flex bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 hover:shadow-lg ml-4"
                onClick={recordEnd}
              >
                stop
              </button>
            ) : (
              <button
                className="flex bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 hover:shadow-lg mr-4 disabled:cursor-not-allowed disabled:bg-rose-400"
                onClick={record}
                disabled={ans ? false : true}
              >
                Answer
                <span className="float-end">
                  <MicIcon />
                </span>
              </button>
            )}
            {!redo && (
              <button
                className={`${ !redo ? '':'hidden'} flex bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 hover:shadow-lg ml-4 disabled:cursor-not-allowed disabled:bg-rose-400`}
                onClick={recordStartAgain}
                // disabled={!redo ? false : true}
              >
                Redo
              </button>
            )}
            <button
              className={`flex bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 hover:shadow-lg ml-4 cursor-pointer disabled:cursor-not-allowed disabled:bg-rose-400`}
              onClick={handleSave}
              disabled={save ? false : true}
            >
              Save
            </button>
            {
              question_no == Question.length-1 ?(
                <Link
              className={`flex bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 hover:shadow-lg ml-4 cursor-pointer disabled:cursor-not-allowed`}
              to="/category/domain/start/reviewanswer"
            >
              Review Answers
            </Link>
              ):(
                <button
              className={`flex bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 hover:shadow-lg ml-4 cursor-pointer`}
              onClick={handleNext}
            >
              Next
            </button>
              )
            }
          </div>
        </>
      ) : (
        <h1 className="text-red-500 text-4xl text-center">Loading...</h1>
      )}
    </div>
  );
}
