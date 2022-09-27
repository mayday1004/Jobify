import { DISPLAY_ALERT, CLEAR_ALERT, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR } from './action';

const reducer = (state, action) => {
  if (action.type === DISPLAY_ALERT) {
    return { ...state, showAlert: true, alertType: 'danger', alertText: 'Please provide all values!' };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: '',
      alertText: '',
    };
  }

  if (action.type === SETUP_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === SETUP_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: action.payload.alertText,
      user: action.payload.user.name,
      token: action.payload.token,
      userLocation: action.payload.user.location,
    };
  }
  if (action.type === SETUP_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.message,
    };
  }

  throw new Error(`no such action :${action.type}`);
};

export default reducer;
