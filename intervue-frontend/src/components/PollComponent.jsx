import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import socket from '../js/socket';


export default function PollComponent({ ...props }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentOption, setCurrentOption] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [timeLeft, setTimeLeft] = useState(props.duration);
  
useEffect(() => {

  socket.on('tick', (time) => {
    if(time>=0){
      setTimeLeft(time);
    }
    else{
      setSubmitted(true);
    }
    
  });

  return () => {
    socket.off('tick');
  };
}, []);

  useEffect(() => {
    if (props.question !== currentQuestion) {
      setSelected(null);
      setSubmitted(false);
      setCurrentOption('');
      setCurrentQuestion(props.question);
      setTimeLeft(props.duration);
    }
  }, [props.question, currentQuestion]);

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
      socket.emit('vote', currentOption);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 rounded-lg bg-white border">
      <p>Time Left : <span className='text-red-600'>{timeLeft}</span> </p>
      <h2 className="text-md font-medium text-gray-800 mb-4"> <p style={{fontWeight:900}} className='text-black font-extrabold'>QUESTION:</p> {props.question}</h2>
      <div className="space-y-2">
        {props.options.map((option, idx) => {
  const id = idx + 1;
  const isCorrect = idx === props.correctOption;

  return (
    <div
      key={id}
      className={`relative rounded-lg border
        ${selected === id ? 'border-purple-600' : 'border-gray-200'}
        ${submitted && isCorrect ? 'border-green-600 border-2' : ''}
        bg-gray-100 overflow-hidden`}
    >
      {submitted && (
        <motion.div
          className="absolute top-0 left-0 h-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${option.percent}%` }}
          transition={{ duration: 0.8 }}
        />
      )}

      <label
        className={`relative z-10 flex items-center gap-3 p-3 cursor-pointer ${
          submitted ? 'text-white' : 'text-gray-800'
        }`}
        onClick={() => {
          if (!submitted) {
            setSelected(id);
            setCurrentOption(option.option);
          }
        }}
      >
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
            ${selected === id || submitted ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'}
          `}
        >
          {id}
        </div>
        <span className="text-black text-sm font-medium flex-1">
          {option.option}
        </span>

        {submitted && (
          <span className="text-black text-sm font-semibold flex items-center gap-1">
            {option.percent}%
            {isCorrect && (
              <span className="ml-2 text-green-500 font-bold">✅</span>
            )}
          </span>
        )}
      </label>
    </div>
  );
})}

      </div>

      {!submitted && (
        <button
          className="mt-6 w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition"
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}

      {submitted && selected && (<div className="mt-6 text-center font-bold text-lime-500">
          Vote Submitted
        </div>)}

        {submitted && !selected && (<div className="mt-6 text-center font-bold text-red-500">
          You ran out of time.
        </div>)}

      {submitted && (
        <div className="mt-6 text-center text-gray-500 font-medium">
          Wait for the teacher to ask a new question.
        </div>
      )}
    </div>
  );
}
