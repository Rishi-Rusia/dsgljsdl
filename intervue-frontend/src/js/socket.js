// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: false, // Optional: so you can control when it connects
});

export default socket;
