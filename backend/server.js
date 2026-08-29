const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const pool = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Socket.io Setup for Real-time Direct Chat
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message, roomId } = data;
    try {
      if (senderId && receiverId) {
        await pool.query(
          'INSERT INTO messages (sender_id, receiver_id, message_text) VALUES ($1, $2, $3)',
          [senderId, receiverId, message]
        );
      }
      io.to(roomId).emit('receive_message', data);
    } catch (err) {
      console.error('Chat Error:', err.message);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`RAAHI Server running on port ${PORT}`));
