import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export const PageContainer = ({ children, title = 'DraftDash' }) => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} />
        <main className="content-body animate-fade-in">{children}</main>
      </div>
    </div>
  );
};

export default PageContainer;
