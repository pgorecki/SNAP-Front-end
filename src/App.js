import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import logo from './logo.svg';
import AppStore from './AppStore';
import AppRouter from './AppRouter';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AppStore>
      <AppRouter />
      <ToastContainer />
    </AppStore>
  );
}

export default App;
