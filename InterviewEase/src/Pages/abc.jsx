import React, { useState, useRef, useEffect } from 'react';

function AudioRecorder() {
  const [audioUrls, setAudioUrls] = useState(Array(5).fill(null)); // Array for 5 recordings
  const [currentAnswer, setCurrentAnswer] = useState(0); // Current recording index (0-4)
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    // Load recordings from localStorage on component mount
    const savedRecordings = Array.from({ length: 5 }, (_, i) =>
      localStorage.getItem(`recording-${i + 1}`)
    );
    setAudioUrls(savedRecordings);
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const newAudioUrl = URL.createObjectURL(audioBlob);

      const updatedAudioUrls = [...audioUrls];
      updatedAudioUrls[currentAnswer] = newAudioUrl;
      setAudioUrls(updatedAudioUrls);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const redoRecording = () => {
    const updatedAudioUrls = [...audioUrls];
    updatedAudioUrls[currentAnswer] = null;
    setAudioUrls(updatedAudioUrls);
    localStorage.removeItem(`recording-${currentAnswer + 1}`);
  };

  const saveRecording = () => {
    const audioBlob = new Blob([audioUrls[currentAnswer]], { type: 'audio/webm' });
    const audioFile = new File([audioBlob], `recording-${currentAnswer + 1}.webm`, { type: 'audio/webm' });

    // Save audio in localStorage
    localStorage.setItem(`recording-${currentAnswer + 1}`, audioUrls[currentAnswer]);
    console.log(`Saved audio file for answer ${currentAnswer + 1}:`, audioFile);

    if (currentAnswer < 4) setCurrentAnswer(currentAnswer + 1); // Move to next answer if < 5
  };

  const handleNextAnswer = () => {
    if (currentAnswer < 4) setCurrentAnswer(currentAnswer + 1);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-semibold mb-4">Audio Recorder - Answer {currentAnswer + 1}/5</h1>

      {audioUrls[currentAnswer] && (
        <audio className="w-full mt-4" controls src={audioUrls[currentAnswer]} />
      )}

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`px-4 py-2 text-white rounded ${
            isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Answer
        </button>
        
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className={`px-4 py-2 text-white rounded ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Stop
        </button>

        <button
          onClick={redoRecording}
          disabled={!audioUrls[currentAnswer]}
          className={`px-4 py-2 text-white rounded ${
            audioUrls[currentAnswer] ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Redo
        </button>

        <button
          onClick={saveRecording}
          disabled={!audioUrls[currentAnswer]}
          className={`px-4 py-2 text-white rounded ${
            audioUrls[currentAnswer] ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Save
        </button>

        <button
          onClick={handleNextAnswer}
          disabled={currentAnswer >= 4}
          className="px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded"
        >
          Next
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Saved Recordings</h2>
        {audioUrls.map((url, index) => (
          url && (
            <div key={index} className="mb-2">
              <span>Answer {index + 1}:</span>
              <audio className="w-full mt-2" controls src={url} />
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default AudioRecorder;
