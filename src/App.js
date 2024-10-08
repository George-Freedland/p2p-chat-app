import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// const socket = io('ws://localhost:8000');
const socket = io('ws://192.168.86.28:8000');

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [color, setColor] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

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
    socket.on('online users', (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off('online users');
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0 && messages[0].isNew) {
      const timer = setTimeout(() => {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          // newMessages[0].isNew = false; // Potential other solution
          newMessages.forEach(message => message.isNew = false)
          return newMessages;
        });
      }, 150); // Length of fadeInScale css animation

      return () => clearTimeout(timer);
    }
  }, [messages]);

  useEffect(() => {
    const nameSet1 = ['Boring', 'Amazing', 'Wicked', 'Speedy', 'Happy', 'Sad', 'Hopeful', 'Dreamy', 'Savage', 'Laughing', 'Trippy', 'Lost', 'Funny', 'Flawless', 'Perfect', 'Stable', 'Active', 'Rich', 'Healthy', 'Groovy', 'Chill'];
    const nameSet2 = ['Lime', 'Teal', 'Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Fuchsia', 'Violet', 'Grey', 'Black', 'White'];
    const nameSet3 = ['Banana', 'Apple', 'Cherry', 'Laptop', 'Rabbit', 'Whale', 'Ocean', 'House', 'Robot', 'Phone', 'Gem', 'Marble', 'Speaker', 'Light', 'Bottle', 'Mouse', 'Rose', 'Flower', 'Corridor', 'Sun', 'Moon', 'Star', 'Car', 'Truck'];
    setUsername(nameSet1[Math.floor(Math.random() * nameSet1.length)] + nameSet2[Math.floor(Math.random() * nameSet2.length)] + nameSet3[Math.floor(Math.random() * nameSet3.length)])
    setColor(nameSet2[Math.floor(Math.random() * nameSet2.length)])
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', { message, username, color, formattedDate, formattedTime });
      setMessage('');
    }
  };

  // const currentDateTime = new Date();
  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>V1.0.0</div><div style={{ fontSize: '0.9rem' }}>{formattedDate} {formattedTime}</div><div>Online Users: {onlineUsers}</div>
      </div>
      <div className='container'>
        <h1>World Chat</h1>
        <h4>Hi<div style={{ color, marginLeft: '0.25rem' }}>{username}</div>!</h4>
        <form onSubmit={sendMessage}>
          <input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message...'
            maxLength={200}
            minLength={2}
          />
          <button type='submit'>Send</button>
        </form>
        <div className='chat-box'>
          {messages.map((msg, idx) => (
            <div 
              className={`chat-message ${msg.isNew ? 'fade-in-scale' : ''}`} 
              key={idx}
            >
              <div style={{display: 'inline'}}><div style={{ display: 'flex' }}><b style={{ color: msg.color }}>{msg.username}</b>: {msg.message}</div><div style={{ fontSize: '0.8rem', color: 'lightgrey', fontStyle: 'italic' }}>{msg.formattedDate}{' '}{msg.formattedTime}</div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
