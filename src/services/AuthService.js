const fakeAuth = {
  isAuthenticated: true,
  authenticate() {
    return new Promise((resolve) => {
      setTimeout(() => {
        fakeAuth.isAuthenticated = true;
        resolve(true);
      }, 1000);
    });
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
