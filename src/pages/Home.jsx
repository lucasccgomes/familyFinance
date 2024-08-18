// src/pages/Home.js
import { getAuth, signOut } from 'firebase/auth';
import ResumoFinan from '../components/ResumoFinan/ResumoFinan';

const Home = () => {
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('Deslogado com sucesso!');
      // Aqui você pode redirecionar o usuário para a página de login, por exemplo
    }).catch((error) => {
      console.error('Erro ao deslogar: ', error);
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl">Bem-vindo à Home!</h1>
        <button 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded" 
          onClick={handleLogout}>
          Deslogar
        </button>
        <ResumoFinan/>
      </div>
    </div>
  );
};

export default Home;
