import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Wrapper from '../../assets/wrappers/SharedLayout';
import { Navbar, SmallSidebar, BigSidebar } from '../../components';
import { useAppConsumer } from '../../context/appContext';

const ShareLayout = () => {
  const { user } = useAppConsumer();
  return (
    <Wrapper>
      <main className='dashboard'>
        <SmallSidebar />
        <BigSidebar />
        <div>
          <Navbar />
          <div className='dashboard-page'>
            {/* 如果沒有放<Outlet /> 在這裡的話，/all-jobs & /add-job只會出現stats的畫面 */}
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default ShareLayout;
