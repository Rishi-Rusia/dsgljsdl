// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// });

// app.use(cors());
// app.use(express.json());

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and setup Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // allows current origin
    methods: ['GET', 'POST']
  }
});


app.use(cors());
app.use(express.json());

// 👉 Serve Vite frontend static files
const distPath = path.join(__dirname, '../intervue-frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  console.warn('⚠️ Vite dist folder not found! Did you run `npm run build` in frontend?');
}

// 👇 Handle SPA routing fallback for Vite



let currentPoll = null;
let pollHistory = [
  {
    questionText: 'What is the output of 2 + "2" in JavaScript?',
    options: ['"4"', '"22"', 'NaN', 'Error'],
    votes: { '"4"': 3, '"22"': 10, 'NaN': 2, 'Error': 1 },
    correctOption: 1,
    startTime: Date.now() - 360000,
    duration: 30
  },
  {
    questionText: 'Which HTTP method is used to update data?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    votes: { 'GET': 1, 'POST': 2, 'PUT': 12, 'DELETE': 1 },
    correctOption: 2,
    startTime: Date.now() - 300000,
    duration: 30
  },
  {
    questionText: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Control Style Sheet'],
    votes: { 'Computer Style Sheets': 0, 'Cascading Style Sheets': 14, 'Creative Style System': 1, 'Control Style Sheet': 1 },
    correctOption: 1,
    startTime: Date.now() - 240000,
    duration: 30
  },
  {
    questionText: 'React is mainly used for?',
    options: ['Data Science', 'Mobile App Development', 'UI Development', 'Database Design'],
    votes: { 'Data Science': 1, 'Mobile App Development': 3, 'UI Development': 11, 'Database Design': 1 },
    correctOption: 2,
    startTime: Date.now() - 180000,
    duration: 30
  },
  {
    questionText: 'Which one is a JavaScript framework?',
    options: ['Laravel', 'React', 'Django', 'Flask'],
    votes: { 'Laravel': 0, 'React': 13, 'Django': 1, 'Flask': 1 },
    correctOption: 1,
    startTime: Date.now() - 120000,
    duration: 30
  }
];
let votes = {};         // { option: count }
let students = {};      // { socketId: name }
let chatMessages = [
  { name: 'Teacher', msg: 'Good morning everyone! We’ll start in 2 minutes.' },
  { name: 'Ananya', msg: 'Morning ma’am!' },
  { name: 'Rohan', msg: 'Hi everyone!' },
  { name: 'Priya', msg: 'Can we get the poll link here?' },
  { name: 'Teacher', msg: 'It’ll appear on your screen directly.' },
  { name: 'Karthik', msg: 'Ready for the quiz 🔥' },
  { name: 'Sneha', msg: 'Same here!' },
  { name: 'Teacher', msg: 'Starting the first question now.' },
  { name: 'Ananya', msg: 'Done. That was easy.' },
  { name: 'Priya', msg: 'I wasn’t sure about option B 😬' },
  { name: 'Rohan', msg: 'Same. I chose D by mistake.' },
  { name: 'Teacher', msg: 'Let’s see the results...' },
  { name: 'Karthik', msg: 'Oh wow, most picked B!' },
  { name: 'Teacher', msg: 'Yes, and B was correct 😊' },
  { name: 'Sneha', msg: 'Phew, got it right then.' },
  { name: 'Teacher', msg: 'Next question coming up.' },
  { name: 'Ananya', msg: 'This one’s a bit tricky.' },
  { name: 'Priya', msg: 'Guesswork 😅' },
  { name: 'Rohan', msg: 'Haha same' },
  { name: 'Teacher', msg: 'Great! That’s all for today’s quiz.' }
]; // In-memory chat storage
let pollTimer = null;
let tickInterval = null;




// 🔁 Broadcast current list of participants
function broadcastParticipants() {
  const names = Object.values(students);
  io.emit('participantList', names);
}

// 🔍 Get socket ID from name
function getSocketIdByName(name) {
  return Object.keys(students).find(socketId => students[socketId] === name);
}

// 🧠 Helper for results
function countVotes() {
  const results = [];
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
  for (let option of currentPoll.options) {
    const count = votes[option] || 0;
    const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
    results.push({ option, percent });
  }
  return results;
}

// 🔧 REST APIs
app.get('/api/poll', (req, res) => res.json(currentPoll));
app.get('/api/history', (req, res) => {
  res.json(Array.isArray(pollHistory) ? pollHistory : []);
});
app.get('/api/results', (req, res) => {
  if (!currentPoll) return res.status(404).json({ error: 'No active poll' });
  res.json(countVotes());
});
app.get('/api/chat-history', (req, res) => {
  res.json(Array.isArray(chatMessages) ? chatMessages : []);
});


app.get('/api/students',(req,res)=>{
  const names = Object.values(students);
  res.json(names);
});

// 🗳️ Create new poll
app.post('/api/poll', (req, res) => {
  const { questionText, options, duration, correctOption } = req.body;

  if (!questionText || !options || options.length < 2 || correctOption === null) {
    return res.status(400).json({ error: 'Invalid poll data' });
  }

  if (currentPoll) pollHistory.push(currentPoll);

  votes = {};
  options.forEach(opt => { votes[opt] = 0; });

  currentPoll = {
    questionText,
    options,
    votes,
    duration,
    correctOption,
    startTime: Date.now()
  };

  io.emit('newPoll', currentPoll);

  let timeRemaining = duration;
  clearInterval(tickInterval);
  tickInterval = setInterval(() => {
    timeRemaining--;
    io.emit('tick', timeRemaining);

    if (timeRemaining < 0) {
      io.emit('pollEnd');
      console.log('Poll End Emitted');
      pollHistory.push(currentPoll);
      currentPoll = null;
      clearInterval(tickInterval);
    }
  }, 1000);

  clearTimeout(pollTimer);
  pollTimer = setTimeout(() => {
    if (!currentPoll) return;
    io.emit('pollResults', currentPoll.votes);
    setTimeout(() => { currentPoll = null; }, 30000);
  }, duration * 1000);

  res.json({ success: true });
});

// 🔌 Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join', (name) => {

    if(Object.values(students).includes(name)){
      return;
    }

    students[socket.id] = name;
    console.log(`Student ${name} joined with ID ${socket.id}`);
    broadcastParticipants(); // 🔁
  });

  socket.on('vote', (option) => {
    console.log("Vote function was hit");
    if (!currentPoll) return;
    votes[option] += 1;
    console.log("VOTES:",votes);
    console.log("CURRENTPOLL AFTER VOTING",currentPoll);
    io.emit('newVotePoll', { ...currentPoll, votes });
  });

  socket.on('chatMessage', (messageObject) => {
    console.log(messageObject);
    const name = messageObject.name || 'Teacher';
    let msg= messageObject.message;
    const messageData = { name,msg};
    chatMessages.push(messageData);
    io.emit('chatMessage', messageData);
  });

  socket.on('kickStudent', (studentSocketId) => {
    io.to(studentSocketId).emit('kicked');
    io.sockets.sockets.get(studentSocketId)?.disconnect();
  });

 socket.on('kickStudentByName', (name) => {
  console.log(name," was kicked!");
  const studentSocketId = getSocketIdByName(name);
  if (studentSocketId) {
    // ✅ 1. Notify the kicked user
    io.emit('kicked',name);

    // ✅ 2. Remove from student list immediately
    delete students[studentSocketId];
    broadcastParticipants();

    // ✅ 3. Disconnect socket
    io.sockets.sockets.get(studentSocketId)?.disconnect();
  }
});


  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    broadcastParticipants(); // 🔁
  });
});

// app.get('/{*any}', (req, res) => {
//   const indexPath = path.join(distPath, 'index.html');
//   if (fs.existsSync(indexPath)) {
//     res.sendFile(indexPath);
//   } else {
//     res.status(404).send('index.html not found');
//   }
// });

app.get('/{*any}', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).send('API route not found');
  res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
