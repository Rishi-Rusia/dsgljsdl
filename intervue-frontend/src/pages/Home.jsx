// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';

// const Home = () => {
//   const [role, setRole] = useState(null);
//   const navigate = useNavigate();
  
//   const handleContinue = () => {
//     if (role === 'student') navigate('/student');
//     else if (role === 'teacher') navigate('/teacher');
//   };

//   return (

//     <>
//     <Navbar></Navbar>
//     <div className="flex items-center justify-center min-h-117 bg-white px-4">
//       <div className="max-w-2xl w-full text-center">
//         <div className="mb-4">
//           <button className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium">
//             ✨ Interview Poll
//           </button>
//         </div>

//         <h1 className="text-3xl font-bold mb-2">
//           Welcome to the <span className="text-black">Live Polling System</span>
//         </h1>
//         <p className="text-gray-600 mb-8">
//           Please select the role that best describes you to begin using the live polling system
//         </p>

//         <div className="flex justify-center gap-4 mb-8">
//           <div
//             onClick={() => setRole('student')}
//             className={`cursor-pointer border rounded-lg p-6 w-64 text-left transition-all ${
//               role === 'student'
//                 ? 'border-indigo-600 shadow-md'
//                 : 'border-gray-300 hover:border-indigo-400'
//             }`}
//           >
//             <h2 className="text-lg font-semibold mb-2">I'm a Student</h2>
//             <p className="text-sm text-gray-500">
//               Lorem Ipsum is simply dummy text of the printing and typesetting industry
//             </p>
//           </div>

//           <div
//             onClick={() => setRole('teacher')}
//             className={`cursor-pointer border rounded-lg p-6 w-64 text-left transition-all ${
//               role === 'teacher'
//                 ? 'border-indigo-600 shadow-md'
//                 : 'border-gray-300 hover:border-indigo-400'
//             }`}
//           >
//             <h2 className="text-lg font-semibold mb-2">I'm a Teacher</h2>
//             <p className="text-sm text-gray-500">
//               Submit answers and view live poll results in real-time
//             </p>
//           </div>
//         </div>

//         <button
//           disabled={!role}
//           onClick={handleContinue}
//           className={`px-6 py-2 rounded-full text-white font-semibold transition-all ${
//             role ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
//           }`}
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//     </>
    
//   );
// };

// export default Home;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const Home = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (role === 'student') navigate('/student');
    else if (role === 'teacher') navigate('/teacher');
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-117 bg-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="mb-4">
            <button className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium">
              ✨ Interview Poll
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Welcome to the <span className="text-black">Live Polling System</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Please select the role that best describes you to begin using the live polling system
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={() => setRole('student')}
              className={`cursor-pointer border rounded-lg p-6 w-64 text-left transition-all ${
                role === 'student'
                  ? 'border-indigo-600 shadow-md'
                  : 'border-gray-300 hover:border-indigo-400'
              }`}
            >
              <h2 className="text-lg font-semibold mb-2">I'm a Student</h2>
              <p className="text-sm text-gray-500">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              onClick={() => setRole('teacher')}
              className={`cursor-pointer border rounded-lg p-6 w-64 text-left transition-all ${
                role === 'teacher'
                  ? 'border-indigo-600 shadow-md'
                  : 'border-gray-300 hover:border-indigo-400'
              }`}
            >
              <h2 className="text-lg font-semibold mb-2">I'm a Teacher</h2>
              <p className="text-sm text-gray-500">
                Submit answers and view live poll results in real-time
              </p>
            </motion.div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!role}
            onClick={handleContinue}
            className={`px-6 py-2 rounded-full text-white font-semibold transition-all ${
              role ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default Home;
