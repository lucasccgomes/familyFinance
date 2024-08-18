import { useEffect, useState } from 'react';
import { db } from '../../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../hook/useAuth';
import { format } from 'date-fns';

const UltimoRelatorio = () => {
  const [relatorio, setRelatorio] = useState(null);
  const { user } = useAuth();
  const currentYear = format(new Date(), 'yyyy');

  useEffect(() => {
    if (!user) return;

    const fetchLatestRelatorio = async () => {
      const relatorioRef = doc(db, 'users', user.uid, 'relatorio', currentYear);
      const relatorioSnap = await getDoc(relatorioRef);

      if (relatorioSnap.exists()) {
        const data = relatorioSnap.data();
        const meses = Object.keys(data).sort(); // Ordenar meses
        const ultimoMes = meses[meses.length - 1]; // Último mês
        setRelatorio(data[ultimoMes]);
      }
    };

    fetchLatestRelatorio();
  }, [user, currentYear]);

  if (!relatorio) {
    return (
      <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">Último Relatório Financeiro</h2>
        <p>Nenhum relatório disponível para o ano atual.</p>
      </div>
    );
  }

  const {
    data,
    rendasFixa,
    rendasExtra,
    despesasFixa,
    despesasExtra,
    totalDespesas,
    totalRenda,
    faltandoParaCobrirDespesas,
  } = relatorio;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Último Relatório Financeiro</h2>
      <div className="mb-2">
        <span className="font-semibold">Data do Relatório:</span>
        <span className="ml-2">{new Date(data.seconds * 1000).toLocaleDateString('pt-BR')}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Total de Rendas:</span>
        <span className="ml-2">{totalRenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Total de Despesas:</span>
        <span className="ml-2">{totalDespesas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Rendas Fixas</h3>
        <ul className="space-y-2">
          {rendasFixa && Object.entries(rendasFixa).map(([key, renda]) => (
            <li key={key}>
              <strong>{renda.titulo}:</strong> R$ {renda.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Rendas Extras</h3>
        <ul className="space-y-2">
          {rendasExtra && Object.entries(rendasExtra).map(([key, renda]) => (
            <li key={key}>
              <strong>{renda.titulo}:</strong> R$ {renda.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Despesas Fixas</h3>
        <ul className="space-y-2">
          {despesasFixa && Object.entries(despesasFixa).map(([key, despesa]) => (
            <li key={key}>
              <strong>{despesa.titulo}:</strong> R$ {despesa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Despesas Extras</h3>
        <ul className="space-y-2">
          {despesasExtra && Object.entries(despesasExtra).map(([key, despesa]) => (
            <li key={key}>
              <strong>{despesa.titulo}:</strong> R$ {despesa.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </li>
          ))}
        </ul>
      </div>

      <div className={`mt-4 text-xl font-bold ${faltandoParaCobrirDespesas > 0 ? 'text-red-500' : 'text-green-500'}`}>
        <span>Saldo:</span>
        <span className="ml-2">{(totalRenda - totalDespesas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
    </div>
  );
};

export default UltimoRelatorio;
