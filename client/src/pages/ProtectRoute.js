import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAppConsumer } from '../context/appContext';

const ProtectRoute = ({ children }) => {
  const { user, token, logoutUser } = useAppConsumer();
  const cookie = Cookies.get('token');
  if ((!cookie && token) || (cookie && token !== cookie)) {
    logoutUser();
  }

  if (!user) {
    return <Navigate to='/landing' />;
  } else {
    return children;
  }
};

export default ProtectRoute;
