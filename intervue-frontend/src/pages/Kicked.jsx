import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Kicked() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-6"
    >
      <h1 className="text-5xl font-bold text-red-600 mb-4">You've been kicked.</h1>
      <p className="text-gray-700 text-lg mb-6">
        You were kicked from the session by the teacher.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg"
      >
        Return to Home
      </button>
    </motion.div>
  );
}
