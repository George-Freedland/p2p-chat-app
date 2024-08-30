import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('ws://localhost:8000');

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => {
        return [{...msg, isNew: true}, ...prevMessages];
      });
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0 && messages[0].isNew) {
      const timer = setTimeout(() => {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          // newMessages[0].isNew = false;
          newMessages.forEach(message => message.isNew = false)
          return newMessages;
        });
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  useEffect(() => {
    const nameSet1 = ['Boring', 'Amazing', 'Wicked', 'Speedy', 'Happy', 'Sad', 'Hopeful', 'Dreamy', 'Savage', 'Laughing', 'Trippy', 'Lost', 'Funny', 'Flawless'];
    const nameSet2 = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet', 'Grey', 'Black', 'White'];
    const nameSet3 = ['Banana', 'Apple', 'Cherry', 'Laptop', 'Rabbit', 'Whale', 'Ocean', 'House', 'Robot', 'Phone', 'Gem', 'Marble', 'Speaker', 'Light', 'Bottle', 'Mouse'];
    setUsername(nameSet1[Math.floor(Math.random() * nameSet1.length)] + nameSet2[Math.floor(Math.random() * nameSet2.length)] + nameSet3[Math.floor(Math.random() * nameSet3.length)])
    setColor(nameSet2[Math.floor(Math.random() * nameSet2.length)])
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', { message, username, color });
      setMessage('');
    }
  };

  return (
    <div className='container'>
      <h1>World Chat</h1>
      <h4>Hi<div style={{ color, marginLeft: '0.25rem' }}>{username}</div>!</h4>
      <form onSubmit={sendMessage}>
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type a message...'
          maxLength={200}
        />
        <button type='submit'>Send</button>
      </form>
      <div className='chat-box'>
        {messages.map((msg, idx) => (
          <div 
            className={`chat-message ${msg.isNew ? 'fade-in-scale' : ''}`} 
            key={idx}
          >
            <div style={{ color: msg.color }}>{msg.username}</div>: {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
