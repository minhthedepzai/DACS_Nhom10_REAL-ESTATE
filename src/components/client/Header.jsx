import React from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';
import './css/Header.css';

const Header = () => {
  return (
    <div className="header-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="header-content animate__animated animate__fadeInLeft">
              <h1 className="header-title">
                <span className="text-dark">Tìm </span>
                <span className="text-primary">NGÔI NHÀ HOÀN HẢO</span>
                <br />
                <span className="text-dark">SỐNG BÊN GIA ĐÌNH</span>
                <br />
                <span className="text-dark">THÂN YÊU</span>
              </h1>
              <p className="header-description mt-4">
                Dịch vụ quản lý tận tâm – vì sự an tâm và thành công bền vững của khách hàng.
              </p>
              <Link to="/bat-dong-san" className="btn btn-primary btn-lg mt-4">
                Bắt đầu nào!
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="header-image animate__animated animate__fadeInRight">
              <img src="/img/dreamhouse.jpg" alt="Luxury apartment" className="img-fluid rounded-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
