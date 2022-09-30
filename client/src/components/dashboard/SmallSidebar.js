import React from 'react';

import { FaTimes } from 'react-icons/fa';
import Wrapper from '../../assets/wrappers/SmallSidebar';
import NavLinks from './NavLinks';
import Logo from '../Logo';
import { useAppConsumer } from '../../context/appContext';

const SmallSidebar = () => {
  const { showSidebar, toggleSidebar } = useAppConsumer();
  return (
    <Wrapper>
      <div className={showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'}>
        <div className='content'>
          <button className='close-btn' onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          {/* 與大側邊欄共用 */}
          <NavLinks toggleSidebar={toggleSidebar} />
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSidebar;
