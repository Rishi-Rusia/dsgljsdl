import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function PollHistory() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    async function fetchPolls() {
      try {
        const res = await axios.get(`https://intervue-poll-rishi.onrender.com/api/history`);
        console.log("POLL HISTORY RESPONSE FROM SERVER:",res);
        let newPolls = [];
        res.data.forEach((poll) => {
          if (poll !== null) {
            newPolls.push(poll);
          }
        });
        setPolls([...newPolls.reverse()] || []);
      } catch (err) {
        console.error("Failed to fetch poll history", err);
      }
    }

    fetchPolls();
  }, []);

  const calculatePercentages = (votes) => {
    const totalVotes = Object.values(votes).reduce((sum, val) => sum + val, 0) || 1;
    return Object.entries(votes).map(([option, count], idx) => ({
      id: idx + 1,
      text: option,
      percentage: Math.round((count / totalVotes) * 100),
    }));
  };

  return (
    <>
      <Navbar fixed />
      <div className="max-w-2xl mt-20 mx-auto my-10 px-4 space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-6"
        >
          Poll History
        </motion.h1>

        {polls.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-600"
          >
            No past polls available.
          </motion.p>
        ) : (
          polls.map((poll, pollIndex) => {
            const options = calculatePercentages(poll.votes);
            return (
              <motion.div
                key={pollIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: pollIndex * 0.1 }}
                className="border rounded-xl p-4 space-y-4 shadow-sm"
              >
                <h2 className="text-lg text-blue-800 font-medium">{poll.questionText}</h2>
                {options.map((option) => (
                  <div key={option.id} className="relative bg-gray-100 rounded-sm overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 bottom-0 bg-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${option.percentage}%` }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="relative flex items-center justify-between px-4 py-2 z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 text-xs font-semibold text-center flex items-center justify-center">
                          {option.id}
                        </div>
                        <span className="text-sm font-medium">{option.text}</span>
                      </div>
                      <span className="text-sm font-semibold">{option.percentage}%</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}
