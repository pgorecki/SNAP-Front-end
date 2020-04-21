import axios from 'axios';
import { useState } from 'react';

function useAuth() {
  // const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function authenticate(username, password) {
    setLoading(true);
    setErrorMessage(null);
    let user = null;
    try {
      const result = await axios.post('http://localhost:8000/users/auth/', {
        username,
        password,
      });
      console.log(result);
      user = {
        ...result.data,
        name: 'Logman',
      }
    } catch (e) {
      setErrorMessage(e.response.data.non_field_errors[0]);
    }
    setLoading(false);
    return user;
  }

  return [/*user, */loading, errorMessage, authenticate];
}

export default useAuth;
