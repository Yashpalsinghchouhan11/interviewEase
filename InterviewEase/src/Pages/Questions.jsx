import Interviewer from "../assets/Interviewer1.png";
import { Link } from "react-router-dom";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MicIcon from "@mui/icons-material/Mic";
import { useSelector, useDispatch } from "react-redux";
import { asyncGetQuestions, question, setAnswers, interviewId } from "../Features/questionSlice";
import { useEffect, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { user, setAudioFileUrls, isAuthenticated } from "../Features/userSlice";
import { setAnswerAsync } from "../Features/answersSlice";

export default function Questions() {
  // All state for speech to text answers
  const [recordStart, setRecordStart] = useState(false);
  const [redo, setReDo] = useState(true);
  const [save, setSave] = useState(false);
  const [ans, setAns] = useState(true);
  const [transcriptText, setTranscriptText] = useState("");
  const [question_no, setQuestion_no] = useState(0);
  const [ques, setQues] = useState("");
  const [answer, setAnswer] = useState([]);

  // All states for Audio recording
  const [audioUrls, setAudioUrls] = useState(''); // Array for 5 recordings
  const [currentAnswer, setCurrentAnswer] = useState(0); // Current recording index (0-4)
  // const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  const dispatch = useDispatch();
  const Question = useSelector(question);
  const audioFile = 1;
  const synth = window.speechSynthesis;

  const currentQuestionRef = useRef(null);

  const User = useSelector(user);
  const isLogging = useSelector(isAuthenticated)
  useEffect(()=>{
    if (!isLogging){
      navigate('/login')
    }
  },[isAuthenticated])

  // Function to speak a greeting
  const speakIntro = () => {
    const greeting = `Hey ${User.username}, Let's practice an interview.`;
    const utterance = new SpeechSynthesisUtterance(greeting);
    let voices = synth.getVoices();
    const selectedVoice = voices.find(
      (voice) => voice.name === "Microsoft Zira - English (United States)"
    );
    utterance.voice = selectedVoice;
    synth.speak(utterance);
  };

  // Run the speakIntro function when the component mounts
  useEffect(() => {
    const timeout = setTimeout(() => {
      speakIntro();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Function to speak a question aloud
  const speakQuestion = (Q) => {
    const utterance = new SpeechSynthesisUtterance(Q);
    let voices = synth.getVoices();
    const selectedVoice = voices.find(
      (voice) => voice.name === "Microsoft Zira - English (United States)"
    );
    utterance.voice = selectedVoice;
    synth.speak(utterance);
  };

  // Load the first question and speak it aloud when questions are available
  useEffect(() => {
    if (Question && Question.length > 0) {
      setQues(Question[0]);
      currentQuestionRef.current = Question[0];
      const timeout = setTimeout(() => {
        speakQuestion(Question[0]);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [Question]);

  
  // Dispatch answers to Redux store when there is an update
  // useEffect(() => {
  //   if (answer.length > 0) {
  //     dispatch(setAnswers(answer));
  //   }
  // }, [answer]);
  
  // Handle advancing to the next question
  const handleNext = () => {
    if (question_no < Question.length - 1) {
      const nextQuestion = Question[question_no + 1];
      setQues(nextQuestion);
      currentQuestionRef.current = nextQuestion;
      const timeout = setTimeout(() => {
        speakQuestion(nextQuestion);
        setQuestion_no((prevQuestionNo) => prevQuestionNo + 1);
        setReDo(true);
        setAns(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  };
  
  // Speech recognition functions
  const {
    transcript,
    listening,
    resetTranscript,
    abortListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  
  // Start recording user response
  const record = async () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
      
      
      //Audio recording setup
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const newAudioUrl = URL.createObjectURL(audioBlob);
        
        // const updatedAudioUrls = [...audioUrls];
        // updatedAudioUrls[currentAnswer] = newAudioUrl;
        setAudioUrls(newAudioUrl);
      };
      
      mediaRecorderRef.current.start();
      setRecordStart(true);
      
      
    } else {
      console.log("Browser does not support speech recognition.");
    }
  };
  
  // Stop recording and save transcript
  const recordEnd = () => {
    SpeechRecognition.stopListening();
    mediaRecorderRef.current.stop();
    setTranscriptText(transcript);
    setRecordStart(false);
    setReDo(false);
    setSave(true);
    setAns(false);
  };


  // Save the current answer and reset the state for the next question
  const handleSave = () => {
    const ans = [...answer, { question: ques, answer: transcriptText }];
    const audioBlob = new Blob([audioUrls], { type: 'audio/webm' });
    const audioFile = new File([audioBlob], `recording-${currentAnswer + 1}.webm`, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audioFile', audioBlob, 'recording.webm');  // Include file name
    formData.append('speechText', transcriptText);
    // const answers = {'audioFile':audioBlob, 'speechText':transcriptText}
    dispatch(setAnswerAsync(formData))
    dispatch(setAnswers(ans))
    dispatch(setAudioFileUrls(audioUrls))
    setAnswer(ans);
    setSave(false);
    setReDo(true);
    setAns(false);
    resetTranscript();
  };
  
  // Redo Restart recording for redo functionality
  const recordStartAgain = () => {
    // const updatedAudioUrls = [...audioUrls];
    // updatedAudioUrls[currentAnswer] = null;
    setAudioUrls('');
    setTranscriptText("");
    resetTranscript();
    setReDo(true);
    setRecordStart(false);
    setSave(false);
    setAns(true);
  };

  // Repeat the current question aloud
  const SpeakQuestionAgain = () => {
    speakQuestion(currentQuestionRef.current);
  };

  const interview_id = useSelector(interviewId)
  useEffect(()=>{
    dispatch(asyncGetQuestions(interview_id))
  })

  // Render the component UI
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
                <VolumeUpIcon style={{ height: "1.5rem", width: "2rem" }} />
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
                Stop
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
                className={`${
                  !redo ? "" : "hidden"
                } flex bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 hover:shadow-lg ml-4 disabled:cursor-not-allowed disabled:bg-rose-400`}
                onClick={recordStartAgain}
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
            {question_no === Question.length - 1 ? (
              <Link
                className={`flex bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 hover:shadow-lg ml-4 cursor-pointer disabled:cursor-not-allowed`}
                to="/category/domain/start/reviewanswer"
              >
                Review Answers
              </Link>
            ) : (
              <Link
                to={`/category/domain/start?question=${question_no + 1}`}
                className={`flex bg-rose-500 py-2 px-4 m-2 text-center rounded-md text-slate-200 hover:shadow-lg ml-4 cursor-pointer`}
                onClick={handleNext}
              >
                Next
              </Link>
            )}
          </div>
        </>
      ) : (
        <h1 className="text-red-500 text-4xl text-center">Loading...</h1>
      )}
    </div>
  );
}
