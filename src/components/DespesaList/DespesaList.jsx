import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConfig';
import { collection, onSnapshot, doc, updateDoc, deleteField } from 'firebase/firestore';
import { useAuth } from '../../hook/useAuth';
import { MdDeleteForever } from "react-icons/md";

const DespesaList = () => {
  const [despesaFixa, setDespesaFixa] = useState([]);
  const [despesaExtra, setDespesaExtra] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const userId = user.uid;

    console.log("User ID:", userId);

    // Escuta em tempo real para o documento de despesas fixas
    const despesaFixaRef = doc(db, 'users', userId, 'despesas', 'despesaFixa');
    console.log("Despesa Fixa Ref:", despesaFixaRef.path);

    const unsubscribeFixa = onSnapshot(despesaFixaRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("Despesa Fixa Data:", docSnap.data());
        setDespesaFixa(Object.entries(docSnap.data()));
      } else {
        console.log("Nenhuma despesa fixa encontrada.");
        setDespesaFixa([]);
      }
    });

    // Escuta em tempo real para todas as despesas extras organizadas por ano e mês
    const despesaExtraCollectionRef = collection(db, 'users', userId, 'despesas', 'despesaExtra');

    const unsubscribeExtra = onSnapshot(despesaExtraCollectionRef, (yearSnapshot) => {
      let allExpenses = [];
      yearSnapshot.forEach((yearDoc) => {
        const year = yearDoc.id; // Ano
        const yearRef = collection(db, 'users', userId, 'despesas', 'despesaExtra', year);

        onSnapshot(yearRef, (monthSnapshot) => {
          monthSnapshot.forEach((monthDoc) => {
            const month = monthDoc.id; // Mês
            const monthRef = doc(db, 'users', userId, 'despesas', 'despesaExtra', year, month);

            // Aqui você pode acessar as despesas dentro do mês
            onSnapshot(monthRef, (expenseSnap) => {
              const expensesData = expenseSnap.data();
              Object.entries(expensesData).forEach(([key, value]) => {
                allExpenses.push({ id: key, ...value, year, month });
              });
              setDespesaExtra(allExpenses);
            });
          });
        });
      });
    });

    return () => {
      unsubscribeFixa();
      unsubscribeExtra();
    };
  }, [user]);

  const handleDelete = async (year, month, key) => {
    if (!user) return;

    const userId = user.uid;
    const despesaRef = doc(db, 'users', userId, 'despesas', 'despesaExtra', year, month);
    console.log("Deleting Despesa Ref:", despesaRef.path, "Key:", key);

    try {
      await updateDoc(despesaRef, {
        [key]: deleteField(),
      });
      console.log("Deleted successfully");
    } catch (error) {
      console.error("Erro ao excluir a despesa: ", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Despesas Cadastradas</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Despesa Fixa</h3>
        {despesaFixa.length > 0 ? (
          <ul className="space-y-2">
            {despesaFixa.map(([key, despesa]) => (
              <li key={key} className="p-2 border border-gray-300 rounded-md flex justify-between items-center">
                <span>
                  <strong>{despesa.titulo}</strong>: R$ {despesa.valor.toFixed(2)}
                </span>
                <button onClick={() => handleDelete(null, null, key)} className="text-red-500">
                  <MdDeleteForever size={24} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma despesa fixa cadastrada.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Despesa Extra</h3>
        {despesaExtra.length > 0 ? (
          <ul className="space-y-2">
            {despesaExtra.map((despesa) => (
              <li key={despesa.id} className="p-2 border border-gray-300 rounded-md flex justify-between items-center">
                <span>
                  <strong>{despesa.titulo}</strong>: R$ {despesa.valor.toFixed(2)} - {new Date(despesa.data.seconds * 1000).toLocaleDateString('pt-BR')}
                </span>
                <button onClick={() => handleDelete(despesa.year, despesa.month, despesa.id)} className="text-red-500">
                  <MdDeleteForever size={24} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma despesa extra cadastrada.</p>
        )}
      </div>
    </div>
  );
};

export default DespesaList;
