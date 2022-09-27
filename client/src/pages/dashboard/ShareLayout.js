import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Wrapper from '../../assets/wrappers/SharedLayout';

const ShareLayout = () => {
  return (
    <Wrapper>
      <nav>
        <Link to='all-jobs'>all jobs</Link>
        <Link to='add-job'>all jobs</Link>
      </nav>
      {/* 如果沒有放<Outlet /> 在這裡的話，/all-jobs & /add-job都會出現SharedLayout的畫面 */}
      <Outlet />
    </Wrapper>
  );
};

export default ShareLayout;
