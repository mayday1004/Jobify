import React, { useState } from 'react';
import { FormRow, Alert } from '../../components';
import { useAppConsumer } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } = useAppConsumer();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState(user?.location);

  const handleSubmit = e => {
    e.preventDefault();
    if (!name || !email) {
      // test and remove temporary
      displayAlert();
      return;
    }

    updateUser({ name, email, location, password });
    setPassword('');
  };
  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>profile </h3>
        {showAlert && <Alert />}

        {/* name */}
        <div className='form-center'>
          <FormRow type='text' name='name' value={name} handleChange={e => setName(e.target.value)} />
          <FormRow type='email' name='email' value={email} handleChange={e => setEmail(e.target.value)} />
          <FormRow
            labelText='password'
            type='password'
            name='password'
            value={password}
            handleChange={e => setPassword(e.target.value)}
          />

          <FormRow
            type='text'
            name='location'
            value={location}
            handleChange={e => setLocation(e.target.value)}
          />
          <button className='btn btn-block' type='submit' disabled={isLoading}>
            {isLoading ? 'Please Wait...' : 'save changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
