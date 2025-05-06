import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="col-lg-6">
      <div className="card shadow-lg border-0 rounded-lg mt-5">
        <div className="card-header"><h3 className="text-center font-weight-light my-4">Không tìm thấy trang</h3></div>
        <div className="card-body">
          <div className="text-center mt-4">
            <h1 className="display-1">404</h1>
            <p className="lead">Không tìm thấy trang</p>
            <p>Không thể tìm thấy trang được yêu cầu.</p>
            <Link to="/">
              <i className="fas fa-arrow-left me-1"></i>
              Quay lại Bảng điều khiển
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404; 