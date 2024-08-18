import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  user: PropTypes.object, // Definindo que 'user' deve ser um objeto
  children: PropTypes.node.isRequired, // 'children' é obrigatório e pode ser qualquer nó React
};

export default ProtectedRoute;
