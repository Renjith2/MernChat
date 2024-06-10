



import React, { useContext, useEffect, useState } from 'react';
import Avatar from './Avatar';
import Logo from './Logo';
import { UserContext } from './UserContext';

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { username, id } = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);

    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function handleMessage(e) {
        const messageData = JSON.parse(e.data);
        if (messageData.type === 'history') {
            setMessages(messageData.messages);
        } else if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        } else {
            console.log("Received message:", messageData);
            setMessages(prevMessages => [...prevMessages, messageData]);
        }
    }

    const onlinePeopleExclOurUser = { ...onlinePeople };
    delete onlinePeopleExclOurUser[id];

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);

        ws.addEventListener('open', () => {
            console.log('WebSocket connection established');
        });

        ws.addEventListener('message', handleMessage);

        ws.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event);
        });

        ws.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return () => {
            ws.removeEventListener('message', handleMessage);
            ws.close();
        };
    }, []);

    function sendMessage(ev) {
        ev.preventDefault();
        const message = {
            recipient: selectedUserId,
            text: newMessageText,
        };
        ws.send(JSON.stringify(message));
        setNewMessageText('');
        setMessages(prev => [...prev, { sender: id, text: newMessageText, recipient: selectedUserId }]);
    }

    return (
        <div className='flex h-screen'>
            <div className='w-1/3 bg-white'>
                <Logo />
                <div>
                    {Object.keys(onlinePeopleExclOurUser).map(userId => (
                        <div 
                            onClick={() => setSelectedUserId(userId)} 
                            key={userId} 
                            className={'flex cursor-pointer items-center h-12 ' + (userId === selectedUserId ? 'bg-blue-50' : '')}>
                            <Avatar username={onlinePeople[userId]} userId={userId} />
                            <span className='text-gray-800 ml-2 flex items-center h-full'>{onlinePeople[userId]}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-2/3 bg-blue-200 flex flex-col'>
                <div className='flex-grow p-2 overflow-y-auto'>
                    {!selectedUserId && (
                        <div>No Selected Person</div>
                    )}
                    {!!selectedUserId && (
                        <div>
                            {messages
                                .filter(m => m.recipient === selectedUserId || m.sender === selectedUserId)
                                .map((msg, index) => (
                                    <div 
                                        key={index} 
                                        className={`p-2 my-2 rounded-lg max-w-md ${msg.sender === id ? 'bg-green-200 self-start' : 'bg-white self-end'} ${msg.sender === id ? 'mr-auto' : 'ml-auto'}`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                {!!selectedUserId && (
                    <form className='flex p-2' onSubmit={sendMessage}>
                        <input 
                            type="text" 
                            value={newMessageText} 
                            onChange={ev => setNewMessageText(ev.target.value)} 
                            placeholder='Type your message here!!!' 
                            className='flex-grow p-2 border border-gray-300 rounded' 
                        />
                        <button type='submit' className='bg-blue-500 text-white p-2 ml-2 rounded'>Send</button>
                    </form>
                )}
            </div>
        </div>
    );
}
