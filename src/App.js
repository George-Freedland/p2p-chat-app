import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('ws://localhost:3000');

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      // setMessages([...messages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <div>
      <h1>World's Best P2P Chat App</h1>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type a message...'
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
}

export default App;
