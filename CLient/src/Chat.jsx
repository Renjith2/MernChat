


import React, { useEffect, useState } from 'react';

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople , SetonlinePeople]=useState({})
    
    function ShowOnlinePeople(peopleArray){
        debugger
     const people={};
     peopleArray.forEach(({userId,username})=>{
        people[userId]=username;
     })
     
     SetonlinePeople(people)
    }

    function handleMessage(e) {
       const messageData=JSON.parse(e.data)
       if('online' in messageData){
      ShowOnlinePeople(messageData.online)
       }
    }

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

        // Clean up the WebSocket connection when the component unmounts
        return () => {
            ws.removeEventListener('message', handleMessage);
            ws.close();
        };
    }, []);

    return (
        <div className='flex h-screen'>
            
            <div className='w-1/3 bg-white'>
            <div>Mern Chat</div>
            <div>
                {
            Object.keys(onlinePeople).map(userid=>(
                <div className='flex'>{onlinePeople[userid]}</div>
            ))
            }
            </div>
            </div>
            <div className='w-2/3 bg-blue-200 flex flex-col'>
                <div className='flex-grow p-2'>
                    Message with the Selected Person
                </div>
                <div className='flex p-2'>
                    <input type="text" placeholder='Type your message here!!!' className='flex-grow p-2 border border-gray-300 rounded'/>
                    <button className='bg-blue-500 text-white p-2 ml-2 rounded'>Send</button>
                </div>
            </div>
        </div>
    );
}
