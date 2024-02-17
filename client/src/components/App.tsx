import React from 'react';
import Home from './Home';
import LoginScreen from './LoginScreen';

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem('authToken');

  return (
    <div>
      {isAuthenticated ? <Home /> : <LoginScreen />}
    </div>
  );
};

export default App;