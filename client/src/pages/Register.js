import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, FormRow, Alert } from '../components';
import { useAppConsumer } from '../context/appContext';
import Wrapper from '../assets/wrappers/RegisterPage';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const Register = () => {
  const [values, setValues] = useState(initialState);
  const { isLoading, showAlert, displayAlert, setupUser, user } = useAppConsumer();
  const navigate = useNavigate();

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    //按下submit的情況:
    // 1)沒填表單，報錯
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }

    const currentUser = { name, email, password };
    // 2)填了Login的表單
    if (isMember) {
      setupUser({ currentUser, endPoint: 'login', alertText: 'Login Success! Redirectiong...' });
      // 3)填了Register的表單
    } else {
      setupUser({ currentUser, endPoint: 'register', alertText: 'User Created! Redirectiong...' });
    }
  };

  const guestUserLogin = () => {
    setupUser({
      currentUser: {
        email: 'guest@example.com',
        password: 'guest1234',
      },
      endPoint: 'login',
      alertText: 'Login Success! Redirectiong...',
    });
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}
        {/* name field */}
        {!values.isMember && (
          <FormRow type='text' name='name' value={values.name} handleChange={handleChange} labelText='name' />
        )}
        {/* email field */}
        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange}
          labelText='email'
        />
        {/* password field */}
        <FormRow
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange}
          labelText='password'
        />
        <button type='submit' className='btn btn-block' disabled={isLoading}>
          submit
        </button>

        <button
          type='button'
          className='btn btn-block btn-hipster'
          disabled={isLoading}
          onClick={guestUserLogin}
        >
          {isLoading ? 'loading...' : 'demo account'}
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}

          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
