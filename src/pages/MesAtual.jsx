// src/pages/Home.js
import RelatorioAtual from "../components/RelatorioAtual/RelatorioAtual";

const MesAtual = () => {

  return (
    <div className="pt-20 items-center h-screen">
      <div className="text-center flex flex-row justify-center sm:justify-between sm:items-center px-4">
        <div className='hidden sm:flex'>
       <RelatorioAtual/>
        </div>
      </div>
    </div>
  );
};

export default MesAtual;
