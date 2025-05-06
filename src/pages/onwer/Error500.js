import React from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => {
  return (
    <div className="col-lg-6">
      <div className="card shadow-lg border-0 rounded-lg mt-5">
        <div className="card-header"><h3 className="text-center font-weight-light my-4">Lỗi máy chủ</h3></div>
        <div className="card-body">
          <div className="text-center mt-4">
            <h1 className="display-1">500</h1>
            <p className="lead">Lỗi máy chủ nội bộ</p>
            <p>Đã xảy ra lỗi trên máy chủ của chúng tôi.</p>
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

export default Error500; 