import React from 'react';
import Navbar from './Navbar';
import './css/Contact.css';

const Contact = () => {
  return (
    <div className="container-xxl bg-white p-0">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="main-content">
        <div className="container-fluid header bg-white p-0">
          <div className="row g-0 align-items-center">
            <div className="col-md-12 p-5 mt-lg-5">
              <h1 className="display-5 animated fadeIn mb-4 text-center">Liên Hệ Với Chúng Tôi</h1>
              <p className="animated fadeIn mb-4 pb-2 text-center">Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất</p>
            </div>
          </div>
        </div>

        <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="contact-item rounded h-100">
                  <div className="d-flex justify-content-center">
                    <div className="contact-icon">
                      <i className="bi bi-geo-alt text-primary"></i>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-3">Địa Chỉ</h5>
                    <p>123 Đường ABC, Quận 1, TP.HCM</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="contact-item rounded h-100">
                  <div className="d-flex justify-content-center">
                    <div className="contact-icon">
                      <i className="bi bi-telephone text-primary"></i>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-3">Điện Thoại</h5>
                    <p>+84 123 456 789</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="contact-item rounded h-100">
                  <div className="d-flex justify-content-center">
                    <div className="contact-icon">
                      <i className="bi bi-envelope text-primary"></i>
                    </div>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-3">Email</h5>
                    <p>info@example.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 mt-4">
              <div className="col-lg-6">
                <div className="contact-form rounded p-4">
                  <h4 className="mb-4">Gửi Tin Nhắn</h4>
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input type="text" className="form-control" placeholder="Họ và tên" />
                      </div>
                      <div className="col-md-6">
                        <input type="email" className="form-control" placeholder="Email" />
                      </div>
                      <div className="col-12">
                        <input type="text" className="form-control" placeholder="Tiêu đề" />
                      </div>
                      <div className="col-12">
                        <textarea className="form-control" rows="5" placeholder="Nội dung"></textarea>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100">Gửi Tin Nhắn</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="contact-map rounded h-100">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.269311477789!2d106.70042331531956!3d10.777201399227245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752d394aebcecf%3A0xaaac7e8ae50504d7!2zTHXGsOG7nW5nIEPhuqd1IEdp4bqleSwgUXVh4buHbiAxLCBUaOG7pyDEkOG7q2MsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1641234567890!5m2!1svi!2s"
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 