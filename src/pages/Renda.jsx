// src/pages/Home.js
import React from 'react';
import RendaForm from '../components/Renda/RendaForm';

const Renda = () => { 

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <RendaForm/>
      </div>
    </div>
  );
};

export default Renda;
