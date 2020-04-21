import axios from 'axios';


const fakeAuth = {
  isAuthenticated: false,
  authenticate() {

    axios.post('http://localhost:8000/users/auth/', { username: 'aaa', password: 'bbb' })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    })

    /*
    return new Promise((resolve) => {
      setTimeout(() => {
        fakeAuth.isAuthenticated = true;
        resolve(true);
      }, 1000);
    });
    */
  },
  signout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        fakeAuth.isAuthenticated = false;
        resolve(true);
      }, 1000);
    });
  },
};

export default fakeAuth;
