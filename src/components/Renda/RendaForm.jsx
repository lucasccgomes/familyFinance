import React, { useState } from 'react';
import { db } from '../../services/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../hook/useAuth';
import { format, subMonths, addMonths } from 'date-fns';
import Dropdown from '../Dropdown/Dropdown';
import Button from '../Button/Button'; 
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const RendaForm = () => {
  const [selectedRenda, setSelectedRenda] = useState('Renda Fixa');
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedButton, setSelectedButton] = useState('current'); 
  const [repeating, setRepeating] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    const userId = user.uid;
    const rendaType = selectedRenda === 'Renda Fixa' ? 'rendaFixa' : format(selectedDate, 'MM-yy');

    const rendaRef = selectedRenda === 'Renda Fixa'
      ? doc(db, 'users', userId, 'rendas', 'rendaFixa')
      : doc(db, 'users', userId, 'rendas', 'rendaExtra', format(selectedDate, 'yyyy'), rendaType);

    await setDoc(rendaRef, {
      [titulo]: {
        titulo,
        valor: parseFloat(valor),
        data: selectedDate,
        repeating,
        userId: userId,
      },
    }, { merge: true });

    setTitulo('');
    setValor('');
    setRepeating(false); // Reseta o estado de repetir mensalmente
  };

  const handlePreviousMonth = () => {
    setSelectedDate(subMonths(new Date(), 1));
    setSelectedButton('previous');
  };

  const handleCurrentMonth = () => {
    setSelectedDate(new Date());
    setSelectedButton('current');
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(new Date(), 1));
    setSelectedButton('next');
  };

  const toggleRepeating = () => {
    setRepeating(!repeating);
  };

  const formattedCurrentMonth = format(new Date(), 'MM/yy');
  const formattedSelectedDate = format(selectedDate, 'MM/yy');
  const previousMonth = format(subMonths(new Date(), 1), 'MM/yy');
  const nextMonth = format(addMonths(new Date(), 1), 'MM/yy');

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <Dropdown
        options={['Renda Fixa', 'Renda Extra']}
        label="Tipo de Renda"
        selected={selectedRenda}
        onSelectedChange={setSelectedRenda}
      />

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Valor R$</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="mt-4 flex justify-between">
        <Button 
          onClick={handlePreviousMonth}
          className={`${selectedButton === 'previous' ? 'bg-blue-700' : ''}`}
        >
          {previousMonth}
        </Button>
        <Button 
          onClick={handleCurrentMonth}
          className={`${selectedButton === 'current' ? 'bg-blue-700' : ''}`}
        >
          {formattedCurrentMonth}
        </Button>
        <Button 
          onClick={handleNextMonth}
          className={`${selectedButton === 'next' ? 'bg-blue-700' : ''}`}
        >
          {nextMonth}
        </Button>
      </div>

      <div className="mt-4 flex items-center">
        <label className="block text-sm font-medium text-gray-700 mr-2">Repete Mensalmente?</label>
        <Button onClick={toggleRepeating} className="flex items-center">
          {repeating ? <FaToggleOn size={24} className="text-green-500" /> : <FaToggleOff size={24} className="text-gray-500" />}
        </Button>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={handleSave} className="bg-blue-500">
          Salvar
        </Button>
        <Button onClick={() => {
            setTitulo('');
            setValor('');
            setRepeating(false);
          }} className="bg-gray-300">
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default RendaForm;
