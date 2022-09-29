import React, { useReducer, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import reducer from './reducer';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
} from './action';

// const token = localStorage.getItem('token');
// const user = localStorage.getItem('user');
const token = Cookies.get('token');
const user = Cookies.get('user');

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  showSidebar: false,
};
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: '/api/v1',
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
  });
  //axios提供的中間件，想要送出請求前做什麼就用interceptors.request
  authFetch.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      // console.log(error.response)
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error.response);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      });
    }, 1500);
  };

  const addUserToCookie = ({ user, token }) => {
    // localStorage.setItem('user', JSON.stringify(user));
    // localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 1 });
    Cookies.set('user', JSON.stringify(user), {
      expires: 1,
    });
  };

  const removeUserFromCookie = () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    Cookies.remove('token', { path: '' });
    Cookies.remove('user', { path: '' });
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await authFetch.post(`/auth/${endPoint}`, currentUser);
      const { user, token } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, alertText },
      });
      addUserToCookie({ user, token });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { message: error.data.message },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };
  const logoutUser = async () => {
    dispatch({ type: LOGOUT_USER });
    await authFetch.get('/auth/logout');
    removeUserFromCookie();
  };

  const updateUser = async currentUser => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, token } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token },
      });
      addUserToCookie({ user, token });
    } catch (error) {
      if (error.status !== 401) {
        //如果是401錯誤會被axios攔截器處理
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { message: error.data.message },
        });
      }
    }
    clearAlert();
  };

  return (
    <AppContext.Provider value={{ ...state, displayAlert, setupUser, toggleSidebar, logoutUser, updateUser }}>
      {children}
    </AppContext.Provider>
  );
};

// make sure use
const useAppConsumer = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppConsumer };
