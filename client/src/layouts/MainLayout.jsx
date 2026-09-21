import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

/**
 * MainLayout Component (client/src/layouts/MainLayout.jsx)
 * 
 * Standard layout structure wrapping all authenticated pages:
 * - Sidebar on the left
 * - Navbar on the top
 * - Dynamic page content rendered in the center via React Router `<Outlet />`
 */
const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
