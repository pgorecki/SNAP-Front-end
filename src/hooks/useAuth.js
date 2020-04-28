import axios from 'axios';
import { useState } from 'react';

function useAuth() {
  // const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  async function authenticate(username, password) {
    setLoading(true);
    setErrors(null);
    const url = process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '');
    let result;
    let user;
    try {
      result = await axios.post(`${url}/users/auth/`, {
        username,
        password,
      });
    } catch (e) {
      setErrors(e.response.data);
      setLoading(false);
      return null;
    }

    const token = result.data.token;

    try {
      user = await axios.get(`${url}/users/me/`, {
        headers: {
          accept: 'application/json',
          Authorization: `Token ${token}`,
        },
      });
    } catch (e) {
      setErrors({
        non_field_errors: [
          'Failed to get user profile',
          e.response.data.detail,
        ],
      });
      setLoading(false);
    }

    return {
      ...user.data,
      token,
    };
  }

  return [/*user, */ loading, errors, authenticate];
}

export default useAuth;
