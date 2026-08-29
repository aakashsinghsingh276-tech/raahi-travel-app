import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Send } from 'lucide-react';

const BACKEND_URL = 'https://raahi-backend.onrender.com';
const socket = io.connect(BACKEND_URL);

export default function DirectChat({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.emit('join_room', 'raahi_global');
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off('receive_message');
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    const msgData = {
      senderId: user?.id || 0,
      senderName: user?.username || 'Guest RAAHI',
      message: text,
      roomId: 'raahi_global'
    };
    socket.emit('send_message', msgData);
    setText('');
  };

  return (
    <div className="flex flex-col h-[75vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-3 bg-slate-800/80 border-b border-slate-700 text-xs font-bold text-teal-400">
        RAAHI Global Travelers Chat
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] p-2.5 rounded-xl text-xs ${
              m.senderName === user?.username ? 'bg-teal-600 ml-auto text-white' : 'bg-slate-800 text-slate-200'
            }`}
          >
            <p className="font-semibold text-[10px] opacity-75 mb-0.5">@{m.senderName}</p>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs focus:outline-none"
        />
        <button onClick={sendMessage} className="bg-teal-500 text-slate-950 p-2 rounded-xl font-bold">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
