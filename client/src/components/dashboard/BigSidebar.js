import React from 'react';
import Wrapper from '../../assets/wrappers/BigSidebar';
import NavLinks from '../NavLinks';
import Logo from '../Logo';
import { useAppConsumer } from '../../context/appContext';

const BigSidebar = () => {
  const { showSidebar } = useAppConsumer();
  return (
    <Wrapper>
      <div className={showSidebar ? 'sidebar-container ' : 'sidebar-container show-sidebar'}>
        <div className='content'>
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
