// src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Renda from './pages/Renda';
import Despesa from './pages/Despesa';
import MesAtual from './pages/MesAtual';
import Navbar from './components/NavBar/NavBar';
import ProtectedRoute from './router/ProtectedRoute';
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {user && <Navbar currentUser={user} />}
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/home" /> : <Login />} 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/rendas" 
          element={
            <ProtectedRoute user={user}>
              <Renda />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/despesas" 
          element={
            <ProtectedRoute user={user}>
              <Despesa />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mesatual" 
          element={
            <ProtectedRoute user={user}>
              <MesAtual />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
