import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/onwer/Navbar';
import Sidebar from '../../components/onwer/Sidebar';
import Footer from '../../components/onwer/Footer';

const MainLayout = ({ children }) => {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('sb-nav-fixed');
    return () => {
      document.body.classList.remove('sb-nav-fixed');
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarToggled(!sidebarToggled);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div style={{ display: 'flex', flex: 1, marginTop: '56px' }}>
        <Sidebar toggled={sidebarToggled} currentPath={location.pathname} />
        <div style={{ flex: 1, marginLeft: '225px', padding: 0, backgroundColor: '#f8f9fa' }}>
          <main style={{ margin: 0, padding: 0 }}>{children}</main>
          <Footer />
        </div>
      </div>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }
        .sb-topnav {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          z-index: 1030;
          height: 56px;
        }
        #layoutSidenav_nav {
          position: fixed;
          top: 56px;
          left: 0;
          bottom: 0;
          width: 225px;
          z-index: 1000;
        }
        .sb-sidenav {
          padding-top: 0;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;