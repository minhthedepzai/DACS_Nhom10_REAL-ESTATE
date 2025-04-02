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
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h1 className="display-5 mb-3">Liên Hệ Với Chúng Tôi</h1>
              <p className="text-muted">Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất</p>
            </div>

            <div className="row g-4">
              {/* Contact Info */}
              <div className="col-lg-4">
                <div className="bg-light rounded p-4">
                  <h5 className="mb-4">Thông Tin Liên Hệ</h5>
                  <div className="d-flex mb-3">
                    <div className="flex-shrink-0 btn-square bg-primary rounded-circle">
                      <i className="bi bi-geo-alt-fill text-white"></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="text-primary">Địa Chỉ</h6>
                      <p className="mb-0">123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <div className="flex-shrink-0 btn-square bg-primary rounded-circle">
                      <i className="bi bi-telephone-fill text-white"></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="text-primary">Điện Thoại</h6>
                      <p className="mb-0">+84 123 456 789</p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="flex-shrink-0 btn-square bg-primary rounded-circle">
                      <i className="bi bi-envelope-fill text-white"></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="text-primary">Email</h6>
                      <p className="mb-0">info@makaan.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-lg-8">
                <div className="bg-light rounded p-4">
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
                        <button className="btn btn-primary w-100 py-3">Gửi Tin Nhắn</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="row mt-5">
              <div className="col-12">
                <div className="bg-light rounded p-4">
                  <iframe 
                    className="w-100" 
                    style={{ height: '450px' }}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.269311477489!2d106.70042331531956!3d10.777201399258051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752d39c3d5c0c5%3A0x1c0c5c5c5c5c5c5c!2zMTIzIMSQxrDGoW5nIEFCQywgUXVh4buHbiAxLCBUUC5IQ00!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s"
                    title="Map"
                  ></iframe>
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