// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import Navbar from '../components/Navbar';

// const socket = io('http://localhost:5000');

// const StudentLogin = () => {
//   const [name, setName] = useState('');
//   const navigate = useNavigate();

//   const handleNameSubmit = () => {
//     if (name.trim()) {
//       sessionStorage.setItem('studentName', name);
//       socket.emit('join', name);
//       navigate('/student/poll');
//     }
//   };

//   return (
//     <>
//     <Navbar></Navbar>
//     <div className="flex justify-center items-center min-h-112 bg-white px-4">
//       <div className="max-w-xl w-full text-center">
//         <button className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
//           ✨ Interview Poll
//         </button>
//         <h1 className="text-3xl font-bold mb-2">Let's <span className="text-indigo-600">Get Started</span></h1>
//         <p className="text-gray-600 mb-4">
//           Enter your name to join the poll.
//         </p>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Enter your Name"
//           className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
//         />
//         <button
//           onClick={handleNameSubmit}
//           className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold"
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//     </>
//   );
// };

// export default StudentLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../js/socket';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';



const StudentLogin = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleNameSubmit = () => {
    if (name.trim()) {
      sessionStorage.setItem('studentName', name);
      socket.emit('join', name);
      navigate('/student/poll');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-112 bg-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl w-full text-center"
        >
          <button className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
            ✨ Interview Poll
          </button>
          <form action="">
            <h1 className="text-3xl font-bold mb-2">
            Let's <span className="text-indigo-600">Get Started</span>
          </h1>
          <p className="text-gray-600 mb-4">
            Enter your name to join the poll.
          </p>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your Name"
            className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNameSubmit}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold"
            type='submit'
          >
            Continue
          </motion.button>
          </form>
          
        </motion.div>
      </div>
    </>
  );
};

export default StudentLogin;
