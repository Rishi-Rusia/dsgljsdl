import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import socket from '../js/socket';
import Navbar from './Navbar';



export default function TeacherResult() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [stopWaiting,setStopWaiting] = useState(false);

  useEffect(() => {
    socket.on('newPoll', (data) => {
      console.log('TEACHER RESULT DATA BEING RECEIVED:', data);
      setQuestion(data.questionText);
      const totalVotes = Object.values(data.votes).reduce((sum, count) => sum + count, 0);
      const resultData = data.options.map((option) => {
        const count = data.votes[option] || 0;
        const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
        return { option, count, percent };
      });
      setOptions(resultData);
      setShowResults(false);
    });

    socket.on('newVotePoll', (data) => {
      console.log('Teacher Result, New Vote Poll data:', data);
      setQuestion(data.questionText);
      const totalVotes = Object.values(data.votes).reduce((sum, count) => sum + count, 0);
      const resultData = data.options.map((option) => {
        const count = data.votes[option] || 0;
        const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
        return { option, count, percent };
      });
      setOptions(resultData);
      setShowResults(true);
    });

    // 🔥 When poll ends, show results
    socket.on('pollEnd', () => {
      console.log('Poll has ended');
      setShowResults(true);
      setStopWaiting(true);
    });

    return () => {
      socket.off('newPoll');
      socket.off('newVotePoll');
      socket.off('pollResults');
      socket.off('pollEnd');
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 rounded-lg bg-white border">
      {question ? (
        <>
          <h2 className="text-md font-medium text-gray-800 mb-4">{question}</h2>
          <div className="space-y-2">
            {options.map((option, id) => (
              <div
                key={id}
                className="relative rounded-lg border border-gray-200 bg-gray-100 overflow-hidden"
              >
                {showResults && (
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${option.percent}%` }}
                    transition={{ duration: 0.8 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3 p-3 text-gray-800">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold bg-gray-300 text-gray-700">
                    {id + 1}
                  </div>
                  <span className="text-black text-sm font-medium flex-1">
                    {option.option}
                  </span>
                  {showResults && (
                    <span className="text-black text-sm font-semibold">
                      {option.percent}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 mt-2">
          {stopWaiting===false?(<><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center text-gray-500 font-medium">
            Waiting for someone to send a response
          </div></>):<div className="text-center text-gray-500 font-medium">
            Nobody Responded. Please ask a new question.
          </div>}
          
        </div>
      )}
    </div>
  );
}




// import React from 'react'

// export default function TeacherResult() {
//   return (
//     <div>TeacherResult</div>
//   )
// }
