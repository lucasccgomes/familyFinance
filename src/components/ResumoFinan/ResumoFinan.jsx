import { useEffect, useState } from 'react';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../hook/useAuth';
import { format } from 'date-fns';

const ResumoFinanceiro = () => {
  const [rendaTotal, setRendaTotal] = useState(0);
  const [despesaTotal, setDespesaTotal] = useState(0);
  const { user } = useAuth();
  const formattedDate = format(new Date(), 'MM-yy');
  const currentYear = format(new Date(), 'yyyy');

  useEffect(() => {
    const fetchAndCalculateFinance = async () => {
      if (!user) return;

      const rendaTypes = ['rendaFixa', 'rendaExtra'];
      const despesaTypes = ['despesaFixa', 'despesaExtra'];

      let totalRenda = 0;
      let totalDespesa = 0;
      let rendasFixa = {};
      let rendasExtra = {};
      let despesasFixa = {};
      let despesasExtra = {};

      // Fetch Rendas
      for (const type of rendaTypes) {
        const rendaRef = type === 'rendaFixa'
          ? doc(db, 'users', user.uid, 'rendas', 'rendaFixa')
          : doc(db, 'users', user.uid, 'rendas', type, currentYear, formattedDate);

        const rendaSnap = await getDoc(rendaRef);

        if (rendaSnap.exists()) {
          const rendas = rendaSnap.data();
          Object.keys(rendas).forEach((key) => {
            totalRenda += rendas[key].valor || 0;
            if (type === 'rendaFixa') {
              rendasFixa[key] = rendas[key];
            } else {
              rendasExtra[key] = rendas[key];
            }
          });
        }
      }

      // Fetch Despesas
      for (const type of despesaTypes) {
        const despesaRef = type === 'despesaFixa'
          ? doc(db, 'users', user.uid, 'despesas', 'despesaFixa')
          : doc(db, 'users', user.uid, 'despesas', type, currentYear, formattedDate);

        const despesaSnap = await getDoc(despesaRef);

        if (despesaSnap.exists()) {
          const despesas = despesaSnap.data();
          Object.keys(despesas).forEach((key) => {
            totalDespesa += despesas[key].valor || 0;
            if (type === 'despesaFixa') {
              despesasFixa[key] = despesas[key];
            } else {
              despesasExtra[key] = despesas[key];
            }
          });
        }
      }

      setRendaTotal(totalRenda);
      setDespesaTotal(totalDespesa);

      const saldo = totalRenda - totalDespesa;

      // Save to Firestore
      const relatorioRef = doc(db, 'users', user.uid, 'relatorio', currentYear);
      await setDoc(relatorioRef, {
        [formattedDate]: {
          data: new Date(),
          rendasFixa,
          rendasExtra,
          despesasFixa,
          despesasExtra,
          totalDespesas: totalDespesa,
          totalRenda: totalRenda,
          faltandoParaCobrirDespesas: saldo < 0 ? Math.abs(saldo) : 0,
          sobrandoDeRendas: saldo > 0 ? saldo : 0,
        },
      }, { merge: true });
    };

    fetchAndCalculateFinance();
  }, [user, formattedDate, currentYear]);

  const saldo = rendaTotal - despesaTotal;
  const saldoNegativo = saldo < 0;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Resumo Financeiro de {formattedDate}</h2>
      
      <div className="mb-2">
        <span className="font-semibold">Total de Rendas:</span>
        <span className="ml-2">{rendaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      
      <div className="mb-2">
        <span className="font-semibold">Total de Despesas:</span>
        <span className="ml-2">{despesaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      
      <div className={`mt-4 text-xl font-bold ${saldoNegativo ? 'text-red-500' : 'text-green-500'}`}>
        <span>Saldo:</span>
        <span className="ml-2">{saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      
      {saldoNegativo && (
        <div className="mt-2 text-red-500">
          <span>Falta para cobrir despesas:</span>
          <span className="ml-2">{(-saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
      )}
    </div>
  );
};

export default ResumoFinanceiro;
