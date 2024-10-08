// src/pages/Home.js
import RendaForm from '../components/Renda/RendaForm';
import RendaList from '../components/RendaList/RendaList';

const Renda = () => {

  return (
    <div className="pt-20 items-center h-screen">
      <div className="text-center flex flex-row justify-center sm:justify-between sm:items-center px-4">
        <div className='hidden sm:flex'>
          <RendaForm />
        </div>
        <div>
          <RendaList />
        </div>
      </div>
    </div>
  );
};

export default Renda;
