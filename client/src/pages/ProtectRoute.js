import { Navigate } from 'react-router-dom';
import { useAppConsumer } from '../context/appContext';

const ProtectRoute = ({ children }) => {
  const { user } = useAppConsumer();

  if (!user) {
    return <Navigate to='/landing' />;
  } else {
    return children;
  }
};

export default ProtectRoute;
