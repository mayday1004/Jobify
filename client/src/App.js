import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing, Register, Error, ProtectRoute } from './pages';
import { AddJob, AllJobs, Profile, Stats, ShareLayout } from './pages/dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectRoute>
              <ShareLayout />
            </ProtectRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/landing' element={<Landing />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
