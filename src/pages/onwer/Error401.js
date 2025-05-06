import React from 'react';
import { Link } from 'react-router-dom';

const Error401 = () => {
  return (
    <div className="col-lg-6">
      <div className="card shadow-lg border-0 rounded-lg mt-5">
        <div className="card-header"><h3 className="text-center font-weight-light my-4">Không được phép</h3></div>
        <div className="card-body">
          <div className="text-center mt-4">
            <h1 className="display-1">401</h1>
            <p className="lead">Không được phép</p>
            <p>Quyền truy cập vào tài nguyên này bị từ chối.</p>
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

export default Error401; 