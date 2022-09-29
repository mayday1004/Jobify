import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAppConsumer } from '../context/appContext';

const ProtectRoute = ({ children }) => {
  const { user, token, logoutUser } = useAppConsumer();
  if (token && token !== Cookies.get('token')) {
    logoutUser();
  }

  if (!user) {
    return <Navigate to='/landing' />;
  } else {
    return children;
  }
};

export default ProtectRoute;
