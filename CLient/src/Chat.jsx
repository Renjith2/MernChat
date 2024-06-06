


// import React, { useEffect, useState } from 'react';
// import Avatar from './Avatar';

// export default function Chat() {
//     const [ws, setWs] = useState(null);
//     const [onlinePeople, setOnlinePeople] = useState({});

//     function ShowOnlinePeople(peopleArray) {
//         const people = {};
//         peopleArray.forEach(({ userId, username }) => {
//             people[userId] = username;
//         });
//         setOnlinePeople(people);
//     }

//     function handleMessage(e) {
//         const messageData = JSON.parse(e.data);
//         if ('online' in messageData) {
//             ShowOnlinePeople(messageData.online);
//         }
//     }

//     useEffect(() => {
//         const ws = new WebSocket('ws://localhost:4000');
//         setWs(ws);

//         ws.addEventListener('open', () => {
//             console.log('WebSocket connection established');
//         });

//         ws.addEventListener('message', handleMessage);

//         ws.addEventListener('close', (event) => {
//             console.log('WebSocket connection closed:', event);
//         });

//         ws.addEventListener('error', (error) => {
//             console.error('WebSocket error:', error);
//         });

//         // Clean up the WebSocket connection when the component unmounts
//         return () => {
//             ws.removeEventListener('message', handleMessage);
//             ws.close();
//         };
//     }, []);

//     debugger;

//     return (
//         <div className='flex h-screen'>
//             <div className='w-1/3 bg-white'>
//                 <div>Mern Chat</div>
//                 <div>
//                     {Object.keys(onlinePeople).map(userId => (
//                         <div key={userId} className='flex cursor-pointer items-center'>
//                             <Avatar username={onlinePeople[userId]} userId={userId} />
//                             <span className='text-gray-800 ml-2 mb-4 flex items-center h-full'>{onlinePeople[userId]}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <div className='w-2/3 bg-blue-200 flex flex-col'>
//                 <div className='flex-grow p-2'>
//                     Message with the Selected Person
//                 </div>
//                 <div className='flex p-2'>
//                     <input type="text" placeholder='Type your message here!!!' className='flex-grow p-2 border border-gray-300 rounded' />
//                     <button className='bg-blue-500 text-white p-2 ml-2 rounded'>Send</button>
//                 </div>
//             </div>
//         </div>
//     );
// }





import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});

    function ShowOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function handleMessage(e) {
        const messageData = JSON.parse(e.data);
        if ('online' in messageData) {
            ShowOnlinePeople(messageData.online);
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

    debugger;

    return (
        <div className='flex h-screen'>
            <div className='w-1/3 bg-white'>
                <div>Mern Chat</div>
                <div>
                    {Object.keys(onlinePeople).map(userId => (
                        <div key={userId} className='flex cursor-pointer items-center h-12'>
                            <Avatar username={onlinePeople[userId]} userId={userId} />
                            <span className='text-gray-800 ml-2 flex items-center h-full'>{onlinePeople[userId]}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-2/3 bg-blue-200 flex flex-col'>
                <div className='flex-grow p-2'>
                    Message with the Selected Person
                </div>
                <div className='flex p-2'>
                    <input type="text" placeholder='Type your message here!!!' className='flex-grow p-2 border border-gray-300 rounded' />
                    <button className='bg-blue-500 text-white p-2 ml-2 rounded'>Send</button>
                </div>
            </div>
        </div>
    );
}
