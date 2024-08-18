import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConfig';
import { doc, updateDoc, deleteField, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../hook/useAuth';
import { MdDeleteForever } from "react-icons/md";

const RendaList = () => {
  const [rendaFixa, setRendaFixa] = useState([]);
  const [rendaExtra, setRendaExtra] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const userId = user.uid;

    // Escuta em tempo real para o documento de rendas fixas
    const rendaFixaRef = doc(db, 'users', userId, 'rendas', 'rendaFixa');
    const unsubscribeFixa = onSnapshot(rendaFixaRef, (docSnap) => {
      if (docSnap.exists()) {
        setRendaFixa(Object.entries(docSnap.data())); // Use Object.entries para manter o título como chave
      } else {
        setRendaFixa([]);
      }
    });

    // Escuta em tempo real para o documento de rendas extras
    const rendaExtraRef = doc(db, 'users', userId, 'rendas', 'rendaExtra');
    const unsubscribeExtra = onSnapshot(rendaExtraRef, (docSnap) => {
      if (docSnap.exists()) {
        setRendaExtra(Object.entries(docSnap.data())); // Use Object.entries para manter o título como chave
      } else {
        setRendaExtra([]);
      }
    });

    // Limpa as escutas quando o componente é desmontado
    return () => {
      unsubscribeFixa();
      unsubscribeExtra();
    };
  }, [user]);

  const handleDelete = async (rendaType, key) => {
    if (!user) return;

    const userId = user.uid;
    const rendaRef = doc(db, 'users', userId, 'rendas', rendaType);

    try {
      await updateDoc(rendaRef, {
        [key]: deleteField(),
      });
    } catch (error) {
      console.error("Erro ao excluir a renda: ", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Rendas Cadastradas</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Renda Fixa</h3>
        {rendaFixa.length > 0 ? (
          <ul className="space-y-2">
            {rendaFixa.map(([key, renda]) => (
              <li key={key} className="p-2 border border-gray-300 rounded-md flex justify-between items-center">
                <span>
                  <strong>{renda.titulo}</strong>: R$ {renda.valor.toFixed(2)}
                </span>
                <button onClick={() => handleDelete('rendaFixa', key)} className="text-red-500">
                  <MdDeleteForever size={24} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma renda fixa cadastrada.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Renda Extra</h3>
        {rendaExtra.length > 0 ? (
          <ul className="space-y-2">
            {rendaExtra.map(([key, renda]) => (
              <li key={key} className="p-2 border border-gray-300 rounded-md flex justify-between items-center">
                <span>
                  <strong>{renda.titulo}</strong>: R$ {renda.valor.toFixed(2)} - {new Date(renda.data.seconds * 1000).toLocaleDateString('pt-BR')}
                </span>
                <button onClick={() => handleDelete('rendaExtra', key)} className="text-red-500">
                  <MdDeleteForever size={24} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma renda extra cadastrada.</p>
        )}
      </div>
    </div>
  );
};

export default RendaList;
