import React from 'react';
import Navbar from './Navbar';
import './css/Services.css';

const Services = () => {
  return (
    <div className="container-xxl bg-white p-0">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="main-content">
        <div className="container-fluid header bg-white p-0">
          <div className="row g-0 align-items-center">
            <div className="col-md-12 p-5 mt-lg-5">
              <h1 className="display-5 animated fadeIn mb-4 text-center">Dịch Vụ Của Chúng Tôi</h1>
              <p className="animated fadeIn mb-4 pb-2 text-center">Chúng tôi cung cấp các dịch vụ bất động sản chuyên nghiệp và uy tín</p>
            </div>
          </div>
        </div>

        <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="service-item rounded h-100">
                  <div className="d-flex justify-content-center">
                    <div className="service-icon">
                      <i className="bi bi-house-door text-primary"></i>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-3">Mua Bán Bất Động Sản</h5>
                    <p>Dịch vụ mua bán bất động sản chuyên nghiệp, uy tín và minh bạch</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="service-item rounded h-100">
                  <div className="d-flex justify-content-center">
                    <div className="service-icon">
                      <i className="bi bi-key text-primary"></i>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-3">Cho Thuê Bất Động Sản</h5>
                    <p>Dịch vụ cho thuê bất động sản với nhiều lựa chọn đa dạng</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="service-item rounded h-100">
                  <div className="d-flex justify-content-center">
                    <div className="service-icon">
                      <i className="bi bi-tools text-primary"></i>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-3">Tư Vấn Bất Động Sản</h5>
                    <p>Dịch vụ tư vấn chuyên sâu về đầu tư bất động sản</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 