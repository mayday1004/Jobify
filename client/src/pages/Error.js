import React from 'react';
import { Link } from 'react-router-dom';
import img from '../assets/images/not-found.svg';
import Wrapper from '../assets/wrappers/ErrorPage';

const Error = () => {
  return (
    <Wrapper className='full-page'>
      <div>
        <img src={img} alt='not found' />
        <h3>Ohh! Page Not Found 😭</h3>
        <p>
          The page you were looking for could not be found. It might have been removed, renamed, or did not
          exist in the first place.
        </p>
        <Link to='/'>back home</Link>
      </div>
    </Wrapper>
  );
};

export default Error;
