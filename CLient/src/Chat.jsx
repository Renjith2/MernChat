import React from 'react'

export default function Chat() {
  return (
    <div className='flex h-screen'>
        <div className='w-1/3 bg-white'>
            Contacts
        </div>
       <div className='w-2/3 bg-blue-200 flex flex-col'>
          <div className='flex-grow p-2 '>Message with the Selected Person</div>
          <div className='flex'>
            <input type="text" placeholder='Type your message here!!!' className='flex-grow mb-2 p-2 ml-2 rounded-sm'/>
          
            <button className='bg-blue-500 text-white p-2 ml-2 rounded'>Send</button>

          </div>
        </div>
        </div>

    
  )
}

