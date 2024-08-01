// src/pages/Login.js
import React from 'react';
import { auth, provider } from '../services/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      console.error("Erro ao fazer login: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button 
        className="bg-blue-500 text-white py-2 px-4 rounded" 
        onClick={signInWithGoogle}
      >
        Login com Google
      </button>
    </div>
  );
};

export default Login;
