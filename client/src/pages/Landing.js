import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/LandingPage';
import { Logo } from '../components/index';
import { useAppConsumer } from '../context/appContext';
import main from '../assets/images/main.svg';
const Landing = () => {
  const { user } = useAppConsumer();

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        <div className='info'>
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo quasi totam commodi, ex reiciendis
            perferendis, temporibus qui omnis magnam aliquam voluptates, doloribus praesentium vel corporis
            molestiae vitae aut quidem tempore!
          </p>
          <Link to='/register' className='btn btn-hero'>
            Login/Register
          </Link>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  );
};

export default Landing;
