import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/**
 * @param {Object} props
 * @param {boolean} [props.fixed] - Optional. If true, makes the navbar fixed to the top.
 */
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
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight italic">
          <span className="font-serif text-white">Intervue</span> <span className="text-purple-200">Poll</span>
        </Link>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Items */}
        <div className={`md:flex space-x-6 ${isOpen ? 'block mt-4' : 'hidden'} md:mt-0 md:space-x-6`}>
          <Link to="/teacher" className="block mt-2 md:mt-0 hover:text-purple-200">Teacher</Link>
          <Link to="/student" className="block mt-2 md:mt-0 hover:text-purple-200">Student</Link>
          <Link to="/History" className="block mt-2 md:mt-0 hover:text-purple-200">History</Link>
        </div>
      </div>
    </nav>
  );
}
