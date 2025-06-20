// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import axios from 'axios';
// import InterviewPoll from '../components/interviewPoll';
// import TeacherResult from '../components/TeacherResult';
// import Navbar from '../components/Navbar';

// const socket = io("http://localhost:5000");

// export default function Teacher() {
//   const [options, setOptions] = useState(['', '']);
//   const [correctOption, setCorrectOption] = useState(null);
//   const [questionText, setQuestionText] = useState('');
//   const [duration, setDuration] = useState(20);
//   const [questionSubmitted, setQuestionSubmitted] = useState(false);
//   const [askQuestion, setAskQuestion] = useState(true); // first question can be asked

//   useEffect(() => {
//     socket.on("pollEnd", () => {
//       console.log("The Poll has ended");
//       setAskQuestion(true);
//     });

//     return () => {
//       socket.off("pollEnd");
//     };
//   }, []);

//   const handleOptionChange = (index, value) => {
//     const updatedOptions = [...options];
//     updatedOptions[index] = value;
//     setOptions(updatedOptions);
//   };

//   const addOption = () => {
//     if (options.length < 4) {
//       setOptions(prev => [...prev, '']);
//     }
//   };

//   const removeOption = (index) => {
//     const updatedOptions = options.filter((_, i) => i !== index);
//     setOptions(updatedOptions);

//     if (correctOption === index) {
//       setCorrectOption(null);
//     } else if (correctOption > index) {
//       setCorrectOption(correctOption - 1);
//     }
//   };

//   const isFormValid =
//     questionText.trim() !== '' &&
//     options.every(opt => opt.trim() !== '') &&
//     correctOption !== null;

//   async function handleAskQuestion(e) {
//     if (!askQuestion) {
//       alert("Please wait for the current poll to end.");
//       return;
//     }

//     try {
//       const res = await axios.post("http://localhost:5000/poll", {
//         questionText,
//         options,
//         correctOption,
//         duration
//       });

//       console.log(res);

//       if (res.data.success) {
//         setQuestionSubmitted(true);
//         setAskQuestion(false); // lock until poll ends
//         setOptions(['', '']);
//         setCorrectOption(null);
//         setQuestionText('');
//       }

//     } catch (error) {
//       alert("Failed to ask question");
//       console.error(error);
//     }
//   }

//   return (
//     <>
//       <Navbar />
//       <div className='mt-6 lg:mx-20 sm:m-10 w-full max-w-3xl px-4 sm:px-6'>
//         {!questionSubmitted ? (
//           <>
//             {/* QUESTION FORM UI */}
//             <div className='flex flex-col gap-3 mb-5'>
//               <InterviewPoll />
//               <h1 className='text-4xl'>Let's <b>Get Started</b></h1>
//               <p className='opacity-65'>
//                 Ask a question and see how your students respond in real-time.
//               </p>
//             </div>

//             <div className='flex flex-col gap-3 mb-5'>
//               <div className='flex justify-between'>
//                 <h3 className="text-xl font-extrabold">Enter your question</h3>
//                 <div className="relative inline-block w-32">
//                   <select
//                     onChange={(e) => setDuration(parseInt(e.target.value))}
//                     className="appearance-none w-full px-4 py-2 pr-8 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-purple-600"
//                   >
//                     <option value={20}>20s</option>
//                      <option value={30}>30s</option>
//                     <option value={60}>60s</option>
//                     <option value={90}>90s</option>
//                     <option value={120}>120s</option>
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-600">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               <textarea
//                 className='w-full min-h-[100px] border-2 border-purple-500 focus:outline-none focus:ring-0 resize-none rounded-md p-3 box-border'
//                 placeholder='Type your question here...'
//                 value={questionText}
//                 onChange={(e) => setQuestionText(e.target.value)}
//               ></textarea>
//             </div>

//             <div className="w-full max-w-2xl bg-white p-4 rounded shadow">
//               {options.map((opt, idx) => (
//                 <div key={idx} className="flex items-center mb-3">
//                   <input
//                     className="w-full p-2 border rounded mr-3"
//                     placeholder={`Option ${idx + 1}`}
//                     value={opt}
//                     onChange={(e) => handleOptionChange(idx, e.target.value)}
//                   />
//                   <label className="flex items-center space-x-1 text-sm text-gray-700 mr-3">
//                     <input
//                       type="radio"
//                       name="correctOption"
//                       checked={correctOption === idx}
//                       onChange={() => setCorrectOption(idx)}
//                     />
//                     <span>Correct</span>
//                   </label>
//                   {options.length > 2 && (
//                     <button
//                       className="text-red-600 text-sm hover:underline"
//                       onClick={() => removeOption(idx)}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className='flex flex-wrap gap-4 mt-4'>
//               <button
//                 className={`bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 cursor-pointer ${options.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 onClick={addOption}
//                 disabled={options.length >= 4}
//               >
//                 + Add more option
//               </button>
//               <button
//                 onClick={handleAskQuestion}
//                 className={`bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 cursor-pointer ${!isFormValid || !askQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 disabled={!isFormValid || !askQuestion}
//               >
//                 Ask Question
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <h2 className='text-2xl font-semibold mb-4'>Live Poll Results</h2>
//             <TeacherResult />

//             <button
//   className="mt-6 w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition flex items-center justify-center gap-2"
//   onClick={() => {
//     setOptions(['', '']);
//     setCorrectOption(null);
//     setQuestionText('');
//     setQuestionSubmitted(false);
//   }}
//   disabled={!askQuestion}
// >
//   {askQuestion ? (
//     "Ask Another Question"
//   ) : (
//     <>
//       <svg
//         className="animate-spin h-5 w-5 text-white"
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//       >
//         <circle
//           className="opacity-25"
//           cx="12"
//           cy="12"
//           r="10"
//           stroke="currentColor"
//           strokeWidth="4"
//         ></circle>
//         <path
//           className="opacity-75"
//           fill="currentColor"
//           d="M4 12a8 8 0 018-8v8z"
//         ></path>
//       </svg>
//       Please wait till the poll ends
//     </>
//   )}
// </button>

//           </>
//         )}
//       </div>
//     </>
//   );
// }


import React, { useEffect, useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import axios from 'axios';
import InterviewPoll from '../components/InterviewPoll';
import TeacherResult from '../components/TeacherResult';
import Navbar from '../components/Navbar';
import ChatParticipantsPanel from '../components/ChatParticipantsPanel'; // adjust path if needed
import square from "../assets/square.png"

const socket = io();


export default function Teacher() {
  const [options, setOptions] = useState(['', '']);
  const [correctOption, setCorrectOption] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [duration, setDuration] = useState(20);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [askQuestion, setAskQuestion] = useState(true);
  const [showChat, setShowChat] = useState(false);


  useEffect(() => {
    console.log("Teacher component mounted, registering pollEnd");
    socket.on('pollEnd', () => {
      console.log("Teacher says the Poll has ended");
      setAskQuestion(true);
    });

    return () => {
      socket.off("pollEnd");
    };
  }, []);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions(prev => [...prev, '']);
    }
  };

  const removeOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);

    if (correctOption === index) {
      setCorrectOption(null);
    } else if (correctOption > index) {
      setCorrectOption(correctOption - 1);
    }
  };

  const isFormValid =
    questionText.trim() !== '' &&
    options.every(opt => opt.trim() !== '') &&
    correctOption !== null;

  async function handleAskQuestion() {
    if (!askQuestion) {
      alert("Please wait for the current poll to end.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/poll`, {
  questionText,
  options,
  duration,
  correctOption,
});

      if (res.data.success) {
        setQuestionSubmitted(true);
        setAskQuestion(false);
        setOptions(['', '']);
        setCorrectOption(null);
        setQuestionText('');
      }
    } catch (error) {
      alert(" ask question");
      console.error(error);
    }
  }

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mt-6 lg:mx-20 sm:m-10 w-full max-w-3xl px-4 sm:px-6'
      >
        {!questionSubmitted ? (
          <>
            <div className='flex flex-col gap-3 mb-5'>
              <InterviewPoll />
              <h1 className='text-4xl'>Let's <b>Get Started</b></h1>
              <p className='opacity-65'>
                Ask a question and see how your students respond in real-time.
              </p>
            </div>

            <div className='flex flex-col gap-3 mb-5'>
              <div className='flex justify-between'>
                <h3 className="text-xl font-extrabold">Enter your question</h3>
                <div className="relative inline-block w-32">
                  <select
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="appearance-none w-full px-4 py-2 pr-8 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-purple-600"
                  >
                    <option value={20}>20s</option>
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                    <option value={90}>90s</option>
                    <option value={120}>120s</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <textarea
                className='w-full min-h-[100px] border-2 border-purple-500 focus:outline-none focus:ring-0 resize-none rounded-md p-3 box-border'
                placeholder='Type your question here...'
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              ></textarea>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-2xl bg-white p-4 rounded shadow"
            >
              {options.map((opt, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center mb-3"
                >
                  <input
                    className="w-full p-2 border rounded mr-3"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                  />
                  <label className="flex items-center space-x-1 text-sm text-gray-700 mr-3">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOption === idx}
                      onChange={() => setCorrectOption(idx)}
                    />
                    <span>Correct</span>
                  </label>
                  {options.length > 2 && (
                    <button
                      className="text-red-600 text-sm hover:underline"
                      onClick={() => removeOption(idx)}
                    >
                      Remove
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>

            <div className='flex flex-wrap gap-4 mt-4'>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className={`bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 cursor-pointer ${options.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={addOption}
                disabled={options.length >= 4}
              >
                + Add more option
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAskQuestion}
                className={`bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 cursor-pointer ${!isFormValid || !askQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isFormValid || !askQuestion}
              >
                Ask Question
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='text-2xl font-semibold mb-4'
            >
              Live Poll Results
            </motion.h2>
            <TeacherResult />

            <motion.button
              whileTap={{ scale: 0.96 }}
              className="mt-6 w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition flex items-center justify-center gap-2"
              onClick={() => {
                setOptions(['', '']);
                setCorrectOption(null);
                setQuestionText('');
                setQuestionSubmitted(false);
              }}
              disabled={!askQuestion}
            >
              {askQuestion ? (
                "Ask Another Question"
              ) : (
                <>
                  <motion.svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </motion.svg>
                  Please wait till the poll ends
                </>
              )}
            </motion.button>
          </>
        )}
      </motion.div>

      {/* Floating Chat Button + Popup Panel */}
{/* Floating Chat Button + Popup Panel */}
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


    </>
  );
}
