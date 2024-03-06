import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import LoginScreen from './LoginScreen';
import CreateTournament from './CreateTournament';
import CreateTeams from './CreateTeams';
import ViewGroups from './ViewGroups';
import ViewTournaments from './ViewTournaments';

const App: React.FC = () => {
  const isAuthenticated = localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/tournaments" element={isAuthenticated ? <ViewTournaments/> : <Navigate to="/login" />} />
        <Route path="/tournaments/create" element={isAuthenticated ? <CreateTournament/> : <Navigate to="/login" />} />
        <Route path="/tournaments/:id" element={isAuthenticated ? <CreateTeams/> : <Navigate to="/login" />} />
        <Route path="/tournaments/:id/groups" element={isAuthenticated ? <ViewGroups/> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
