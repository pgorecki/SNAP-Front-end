import axios from 'axios';
import { useState } from 'react';

function useAuth() {
  // const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  async function authenticate(username, password) {
    setLoading(true);
    setErrors(null);
    let user = null;
    try {
      const url = process.env.REACT_APP_BACKEND_URL;
      const result = await axios.post(`${url}/users/auth/`, {
        username,
        password,
      });
      console.log(result);
      user = {
        ...result.data,
        name: 'Logman',
      };
    } catch (e) {
      setErrors(e.response.data);
    }
    setLoading(false);
    return user;
  }

  return [/*user, */ loading, errors, authenticate];
}

export default useAuth;
