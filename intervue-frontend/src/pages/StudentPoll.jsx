// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5000');

// const StudentPoll = () => {
//   const [question, setQuestion] = useState(null);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [hasSubmitted, setHasSubmitted] = useState(false);
//   const [timer, setTimer] = useState(60);
//   const [results, setResults] = useState(null);
//   const [view, setView] = useState('waiting');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const name = sessionStorage.getItem('studentName');
//     if (!name) {
//       navigate('/student'); // Redirect if name not set
//       return;
//     }

//     socket.on('newPoll', (data) => {
//       console.log("This is the poll data:",data);
//       setQuestion(data);
//       setSelectedIndex(null);
//       setHasSubmitted(false);
//       setResults(null);
//       setView('question');
//       setTimer(data.duration || 60);
//     });

//     socket.on('pollResults', (data) => {
//       setResults(data);
//       setView('result');
//     });

//     return () => {
//       socket.off('newPoll');
//       socket.off('pollResults');
//     };
//   }, [navigate]);

//   useEffect(() => {
//     let interval;
//     if (view === 'question') {
//       interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [view]);

//   useEffect(() => {
//   socket.on('pollEnd', () => {
//     setView('waiting');
//     setQuestion(null);
//     setSelectedIndex(null);
//     setHasSubmitted(false);
//     setResults(null);
//   });

//   return () => {
//     socket.off('pollEnd');
//   };
// }, []);


//   const handleAnswerSubmit = () => {
//     if (selectedIndex !== null) {
//       socket.emit('vote', selectedIndex);
//       setHasSubmitted(true);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-white px-4">
//       <div className="max-w-xl w-full text-center">
//         {view === 'waiting' && (
//           <>
//             <button className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
//               ✨ Interview Poll
//             </button>
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//             <p className="text-lg font-semibold">Wait for the teacher to ask questions..</p>
//           </>
//         )}

//         {view === 'question' && question && (
//           <div className="text-left">
//             <div className="flex justify-between items-center mb-2">
//               <h2 className="text-xl font-semibold">Question</h2>
//               <div className="flex items-center text-red-500 font-semibold">
//                 <span className="mr-1">⏱</span> {`00:${timer < 10 ? '0' : ''}${timer}`}
//               </div>
//             </div>
//             <div className="bg-gray-800 text-white p-4 rounded mb-4">
//               {question.text}
//             </div>
//             <div className="space-y-2 mb-6">
//               {question.options.map((option, index) => (
//                 <div
//                   key={index}
//                   onClick={() => !hasSubmitted && setSelectedIndex(index)}
//                   className={`p-3 rounded border cursor-pointer transition ${
//                     selectedIndex === index
//                       ? 'bg-indigo-100 border-indigo-600'
//                       : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
//                   } ${hasSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   {option}
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={handleAnswerSubmit}
//               disabled={selectedIndex === null || hasSubmitted}
//               className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold disabled:bg-gray-400"
//             >
//               {hasSubmitted ? 'Submitted' : 'Submit Answer'}
//             </button>
//           </div>
//         )}

//         {view === 'result' && results && (
//           <div className="text-left">
//             <div className="flex justify-between items-center mb-2">
//               <h2 className="text-xl font-semibold">Results</h2>
//             </div>
//             <div className="bg-gray-800 text-white p-4 rounded mb-4">
//               {question?.text}
//             </div>
//             <div className="space-y-2 mb-6">
//               {results.map((r, idx) => (
//                 <div key={idx} className="border rounded">
//                   <div className="flex justify-between items-center p-2">
//                     <span>{r.option}</span>
//                     <span>{r.percent}%</span>
//                   </div>
//                   <div
//                     className="h-2 bg-indigo-500 rounded-b"
//                     style={{ width: `${r.percent}%` }}
//                   ></div>
//                 </div>
//               ))}
//             </div>
//             <p className="text-center text-gray-600">Wait for the teacher to ask a new question..</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentPoll;


import React, { useEffect, useState } from 'react'
import PollComponent from '../components/PollComponent'
import { useNavigate } from 'react-router-dom';
import socket from '../js/socket';
import Navbar from '../components/Navbar';
import { AnimatePresence,motion} from 'framer-motion';
import square from "../assets/square.png"
import ChatParticipantsPanel from '../components/ChatParticipantsPanel';


export default function StudentPoll() {
  const [waiting, setWaiting] = useState(true);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(null);
  const [duration, setDuration] = useState(0);
  const [showChat,setShowChat]=useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = sessionStorage.getItem('studentName');
    if (!name) {
      navigate('/student'); // Redirect if name not set
      return;
    }

    socket.on('newPoll', (data) => {
      console.log("This is the poll data:", data);
      setWaiting(false);
      setQuestion(data.questionText);
      
      setCorrectOption(data.correctOption);
      setDuration(data.duration);

       const totalVotes = Object.values(data.votes).reduce((sum, count) => sum + count, 0);

      const percentageResults = data.options.map((option) => {
      const count = data.votes[option] || 0;
      const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

    return {
     option,
    count,
    percent
  };
  
 
});

setOptions(percentageResults);

    });

    socket.on('newVotePoll', (data) => {
      console.log("This is the poll data AFTER VOTING:", data);
      setQuestion(data.questionText);
      
      setCorrectOption(data.correctOption);
      setDuration(data.duration);

      const totalVotes = Object.values(data.votes).reduce((sum, count) => sum + count, 0);

      const percentageResults = data.options.map((option) => {
      const count = data.votes[option] || 0;
      const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

    return {
     option,
    count,
    percent
  };

 
});

setOptions(percentageResults);

 console.log("Percentage Results:",percentageResults);

    });

    socket.on('pollResults', (data) => {

    });

    socket.on('kicked', (name) => {
      let checknName=sessionStorage.getItem('studentName');
      if(checknName===name){
        
  sessionStorage.removeItem('studentName');
  navigate('/kicked');
      }
      else{
        return;
      }
});


    return () => {
      socket.off('newPoll');
      socket.off('pollResults');
      socket.off('kicked');
    };
  }, [navigate]);

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex justify-center items-center min-h-112 bg-white px-4">
        <div className="max-w-xl w-full text-center">
          {waiting && (
            <>
              <button className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
                ✨ Interview Poll
              </button>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Wait for the teacher to ask the next question...</p>
            </>
          )}

          {!waiting && (
            <PollComponent question={question} options={options} correctOption={correctOption} duration={duration}></PollComponent>
            // <PollComponent></PollComponent>
          )}


        </div>
      </div>

      <div className="fixed bottom-0 md:bottom-6 right-6 z-50 w-20 h-20 flex items-end justify-end">
  <div className="relative">
    <AnimatePresence>
      {showChat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-14 right-0"
        >
          <ChatParticipantsPanel />
        </motion.div>
      )}
    </AnimatePresence>

    <motion.button
      whileTap={{ rotate: 90, scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => setShowChat(!showChat)}
      className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg focus:outline-none transition cursor-pointer"
      aria-label="Toggle Chat"
    >
      <motion.img
        src={square}
        alt=""
        animate={{ rotate: showChat ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="w-6 h-6"
      />
    </motion.button>
  </div>
</div>


    </div>
  )
}
