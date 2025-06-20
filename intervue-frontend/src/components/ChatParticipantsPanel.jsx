
// import React, { useState, useEffect, useRef } from 'react';
// import socket from '../js/socket';
// import axios from 'axios';


// const ChatParticipantsPanel = () => {
//   const [activeTab, setActiveTab] = useState('chat');
//   const [participants, setParticipants] = useState([]);

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   const sessionName = sessionStorage.getItem('studentName') || 'Teacher';
//   const bottomRef = useRef(null);

//   useEffect(() => {
//       axios.get('http://localhost:5000/chat-history')
//   .then((res) => {
//     const history = res.data;
//     if (history.length === 0) {
//       setMessages([{ user: 'System', text: 'Ask your doubts here', id: 'system' }]);
//     } else {
//       const formatted = history.map((msg, idx) => ({
//         user: msg.name || 'Unknown',
//         text: msg.msg || '',
//         id: Date.now() + idx + Math.random(),
//       }));
//       setMessages(formatted);
//     }
//   }).catch((err) => {
//         console.error('Failed to fetch chat history:', err);
//       });

//     // Live incoming messages
//     const handleChatMessage = ({ name, msg }) => {
//       setMessages((prev) => [
//         ...prev,
//         {
//           user: name,
//           text: msg,
//           id: Date.now() + Math.random(),
//         },
//       ]);
//     };

//     axios.get('http://localhost:5000/students').then((res)=>{setParticipants(res.data)}).catch((err) => {
//         console.error('Failed to fetch students:', err);
//       });;

//     socket.on('participantList', (names) => {
//     setParticipants(names);
//   });


//     socket.on('chatMessage', handleChatMessage);

//     return () => {
//       socket.off('chatMessage', handleChatMessage);
//     };
//   }, [sessionName]);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     if (bottomRef.current) {
//       bottomRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//  const kickOut = (name) => {
//   socket.emit('kickStudentByName', name);  // 🚀 Send kick request to backend
//   setParticipants(participants.filter((p) => p !== name)); // Optional: update local state
// };


//   const handleSendMessage = () => {
//     if (!input.trim()) return;

//     socket.emit('chatMessage', input.trim());
//     setInput('');
//   };

//   const handleEnter = (e) => {
//     if (e.key === 'Enter') handleSendMessage();
//   };

//   return (
//     <div className="mb-3.5 md:mr-1 w-[90vw] max-w-sm sm:w-96 max-h-[80vh] bg-gray-50 shadow-xl rounded-lg flex flex-col overflow-hidden border border-gray-300">
//       {/* Tabs */}
//       <div className="flex border-b border-gray-300 bg-white">
//         {['chat', 'participants'].map((tab) => (
//           <div
//             key={tab}
//             className={`w-1/2 text-center py-2 cursor-pointer font-semibold transition-colors duration-150 ${
//               activeTab === tab
//                 ? 'text-black border-b-2 border-purple-500'
//                 : 'text-gray-500 hover:text-black'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </div>
//         ))}
//       </div>

//       {activeTab === 'chat' ? (
//         <>
//           <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-72 bg-white">
//             {messages.map((msg, idx) => {
//               const isSelf = msg.user === sessionName;
//               const isSystem = msg.user === 'System';

//               return (
//                 <div
//                   key={msg.id || idx}
//                   className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div>
//                     <div
//                       className={`px-4 py-2 rounded-lg text-white max-w-xs break-words relative ${
//                         isSystem
//                           ? 'bg-gray-400 text-center'
//                           : isSelf
//                           ? 'bg-purple-600'
//                           : 'bg-gray-800'
//                       }`}
//                     >
//                       <p>{msg.text}</p>
//                       {!isSystem && (idx === 0 || messages[idx - 1].user !== msg.user) && (
//                         <span
//                           className={`block text-[10px] text-gray-300 mt-1 ${
//                             isSelf ? 'text-right' : 'text-left'
//                           }`}
//                         >
//                           {msg.user}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={bottomRef} />
//           </div>

//           {/* Input */}
//           <div className="flex items-center border-t border-gray-300 px-4 py-2 bg-gray-50">
//             <input
//               type="text"
//               className="flex-1 border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//               placeholder="Type a message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleEnter}
//             />
//             <button
//               onClick={handleSendMessage}
//               className="ml-2 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
//             >
//               Send
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="p-4 flex-1 overflow-y-auto max-h-96 bg-white">
//           <div className="flex justify-between font-semibold text-gray-700 mb-2 text-sm">
//             <span>Name</span>
//             <span>Action</span>
//           </div>
//           <ul>
//             {participants.map((name) => (
//               <li
//                 key={name}
//                 className="flex justify-between items-center py-2 border-b border-gray-200"
//               >
//                 <span className="font-medium text-gray-800">{name}</span>
//                 <button
//                   onClick={() => kickOut(name)}
//                   className="text-blue-600 hover:underline"
//                 >
//                   Kick out
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatParticipantsPanel;

import React, { useState, useEffect, useRef } from 'react';
import socket from '../js/socket';
import axios from 'axios';

const ChatParticipantsPanel = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const [sessionName] = useState(sessionStorage.getItem('studentName') || 'Teacher');
  const bottomRef = useRef(null);

  useEffect(() => {
    axios.get(`https://intervue-poll-rishi.onrender.com/api/chat-history`)
      .then((res) => {
        console.log("CHAT HISTORY RESPONSE:",res);
        const history = res.data;
        if (history.length === 0) {
          setMessages([{ user: 'System', text: 'Ask your doubts here', id: 'system' }]);
        } else {
          const formatted = history.map((msg, idx) => ({
            user: msg.name || 'Unknown',
            text: msg.msg || '',
            id: Date.now() + idx + Math.random(),
          }));
          setMessages(formatted);
          console.log(messages);
        }
      }).catch((err) => {
        console.error('Failed to fetch chat history:', err);
      });

    axios.get(`https://intervue-poll-rishi.onrender.com/api/students`)
      .then((res) => setParticipants(res.data))
      .catch((err) => console.error('Failed to fetch students:', err));

    const handleChatMessage = ({ name, msg }) => {
      setMessages((prev) => [
        ...prev,
        {
          user: name,
          text: msg,
          id: Date.now() + Math.random(),
        },
      ]);
    };

    socket.on('participantList', (names) => {
      setParticipants(names);
    });

    socket.on('chatMessage', handleChatMessage);

    return () => {
      socket.off('chatMessage', handleChatMessage);
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const kickOut = (name) => {
    socket.emit('kickStudentByName', name);
    setParticipants(participants.filter((p) => p !== name));
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    let currentName= sessionStorage.getItem("studentName");
    socket.emit('chatMessage',{name:currentName, message:input.trim()});
    setInput('');
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="mb-3.5 md:mr-1 w-[90vw] max-w-sm sm:w-96 max-h-[80vh] bg-gray-50 shadow-xl rounded-lg flex flex-col overflow-hidden border border-gray-300">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 bg-white">
        {['chat', 'participants'].map((tab) => (
          <div
            key={tab}
            className={`w-1/2 text-center py-2 cursor-pointer font-semibold transition-colors duration-150 ${
              activeTab === tab
                ? 'text-black border-b-2 border-purple-500'
                : 'text-gray-500 hover:text-black'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      {activeTab === 'chat' ? (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-72 bg-white">
            {messages.map((msg, idx) => {
              const isSystem = msg.user === 'System';
              const isSelf = msg.user === sessionName;

              return (
                <div
                  key={msg.id || idx}
                  className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  <div>
                    <div
                      className={`px-4 py-2 rounded-lg text-white max-w-xs break-words relative ${
                        isSystem
                          ? 'bg-gray-400 text-center'
                          : isSelf
                          ? 'bg-purple-600'
                          : 'bg-gray-800'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {!isSystem && (idx === 0 || messages[idx - 1].user !== msg.user) && (
                        <span
                          className={`block text-[10px] text-gray-300 mt-1 ${
                            isSelf ? 'text-right' : 'text-left'
                          }`}
                        >
                          {msg.user}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center border-t border-gray-300 px-4 py-2 bg-gray-50">
            <input
              type="text"
              className="flex-1 border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="p-4 flex-1 overflow-y-auto max-h-96 bg-white">
          <div className="flex justify-between font-semibold text-gray-700 mb-2 text-sm">
            <span>Name</span>
            <span>Action</span>
          </div>
          <ul>
            {participants.map((name) => (
              <li
                key={name}
                className="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span className="font-medium text-gray-800">{name}</span>
                <button
                  onClick={() => kickOut(name)}
                  className="text-blue-600 hover:underline"
                >
                  Kick out
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatParticipantsPanel;
