// src/pages/Home.js
import DespesaList from '../components/DespesaList/DespesaList';
import DespForm from '../components/Despesas/DespForm';

const Despesa = () => {

  return (
    <div className="pt-20 items-center h-screen">
      <div className="text-center flex flex-row justify-center sm:justify-between sm:items-center px-4">
        <div className='hidden sm:flex'>
          <DespForm />
        </div>
        <div>
          <DespesaList />
        </div>
      </div>
    </div>
  );
};

export default Despesa;
