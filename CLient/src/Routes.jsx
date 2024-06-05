


import { useContext } from 'react';
import Register from './RegisterAndLoginForm';
import { UserContext } from './UserContext';

export default function Routes() {
  const { username, id } = useContext(UserContext);

  if (username) {
     return 'loggedin!!!'+ username; 
     // Render something meaningful
  }

  return (
    <Register />
  );
}
