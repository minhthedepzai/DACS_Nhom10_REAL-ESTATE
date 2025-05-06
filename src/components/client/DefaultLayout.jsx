import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const DefaultLayout = ({ children }) => {
  return (
    <div className="default-layout">
      <Navbar />
      <main className="content">
        <div className="container-fluid px-4 py-4">
        {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout; 