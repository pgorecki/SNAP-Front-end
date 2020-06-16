import React, { useReducer, useEffect, createContext } from 'react';

const initialState = {
  user: null,
  isLoggedIn: false,
  theme: {
    appBarColor: '#0067B1',
    menuWidth: 10,
  },
};

function reducer(state, action) {
  console.log('reducer', state, action);
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.data,
        isLoggedIn: !!action.data,
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    default:
      console.warn(`Unknown action: ${action.type}`, action);
      return state;
  }
}

export const AppContext = createContext(initialState);

export default function AppStore({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  console.log('app state', state);

  useEffect(() => {
    console.log('initializing global store');
    try {
      const initialUser = JSON.parse(localStorage.getItem('user'));
      dispatch({ type: 'SET_USER', data: initialUser });
    } catch (err) {}
  }, []);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
}
