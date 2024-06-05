


import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);  
    const { setUsername: SetLoggedInUsername, Setid } = useContext(UserContext);
    const [isLoginorRegister, SetisLoginorRegister] = useState('register');

    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLoginorRegister === 'register' ? 'register' : 'login';
        try {
            setError(null);  
            const { data } = await axios.post(url, { username, password });
            console.log(data);  
            SetLoggedInUsername(username);
            Setid(data.id);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    }

    return (
        <div className='bg-blue-50 h-screen flex items-center'>
            <form className='w-64 mx-auto mb-12' onSubmit={handleSubmit}>
                <input 
                    type='text' 
                    placeholder='username' 
                    className='block w-full rounded-sm p-2 mb-2'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type='password' 
                    placeholder='password' 
                    className='block w-full rounded-sm p-2 mb-2'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='bg-blue-500 text-white w-full block rounded-sm p-2'>
                    {isLoginorRegister === 'register' ? 'Register' : 'Login'}
                </button>
                <div className='text-center mt-2'>
                    {isLoginorRegister === 'register' && (
                        <div>
                            Already a Member?
                            <button onClick={() => SetisLoginorRegister('login')}>
                                Login Here
                            </button>
                        </div>
                    )}
                    {isLoginorRegister === 'login' && (
                        <div>
                            Don't have an account?
                            <button onClick={() => SetisLoginorRegister('register')}>
                                Register
                            </button>
                        </div>
                    )}
                </div>
                {error && <div className="text-red-500 mt-2">{error}</div>}
            </form>
        </div>
    );
}
