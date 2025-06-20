// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import socket from '../js/socket';


// const Student = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState(sessionStorage.getItem('studentName') || '');
//   const [view, setView] = useState(name ? 'waiting' : 'name');
//   const [question, setQuestion] = useState(null);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [timer, setTimer] = useState(60);
//   const [results, setResults] = useState(null);

//   useEffect(() => {
//     socket.on('newPoll', (data) => {
//       setQuestion(data);
//       setSelectedOption(null);
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
//   }, []);

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

//   const handleNameSubmit = () => {
//     if (name.trim()) {
//       sessionStorage.setItem('studentName', name);
//       socket.emit('join', name);
//       setView('waiting');
//     }
//   };

//   const handleAnswerSubmit = () => {
//     if (selectedOption !== null) {
//       const optionIndex = question.options.indexOf(selectedOption);
//       socket.emit('vote', optionIndex);
//       setView('waiting');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-white px-4">
//       <div className="max-w-xl w-full text-center">
//         {view === 'name' && (
//           <>
//             <button className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
//               ✨ Interview Poll
//             </button>
//             <h1 className="text-3xl font-bold mb-2">Let's <span className="text-indigo-600">Get Started</span></h1>
//             <p className="text-gray-600 mb-4">
//               If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
//             </p>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter your Name"
//               className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
//             />
//             <button
//               onClick={handleNameSubmit}
//               className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold"
//             >
//               Continue
//             </button>
//           </>
//         )}

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
//                   onClick={() => setSelectedOption(option)}
//                   className={`p-3 rounded border cursor-pointer transition ${
//                     selectedOption === option
//                       ? 'bg-indigo-100 border-indigo-600'
//                       : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
//                   }`}
//                 >
//                   {option}
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={handleAnswerSubmit}
//               disabled={selectedOption === null}
//               className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold disabled:bg-gray-400"
//             >
//               Submit
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

// export default Student;
