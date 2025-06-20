import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ fixed = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const navClasses = `
    ${fixed ? 'fixed top-0 left-0 w-full z-50' : ''}
    bg-gradient-to-r from-purple-600 to-purple-700 
    text-white shadow-md
  `;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-tight italic">
          <span className="font-serif text-white">Intervue</span>{' '}
          <span className="text-purple-200">Poll</span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/teacher" className="hover:text-purple-200">
            Teacher
          </Link>
          <Link to="/student" className="hover:text-purple-200">
            Student
          </Link>
          <Link to="/History" className="hover:text-purple-200">
            History
          </Link>
        </div>
      </div>

      {/* Mobile Slide-In Menu with Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-full z-50 bg-gradient-to-b from-purple-800 via-purple-700 to-purple-600 backdrop-blur-md shadow-2xl flex flex-col p-6 space-y-4"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-purple-200 hover:text-white transition duration-300"
                >
                  <X size={28} />
                </button>
              </div>

              <nav className="flex flex-col space-y-4 mt-2 text-lg font-medium">
                <Link
                  to="/teacher"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-purple-200 border-b border-purple-500 pb-2"
                >
                  👩‍🏫 Teacher
                </Link>
                <Link
                  to="/student"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-purple-200 border-b border-purple-500 pb-2"
                >
                  🎓 Student
                </Link>
                <Link
                  to="/History"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-purple-200 pb-2"
                >
                  🕘 History
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
