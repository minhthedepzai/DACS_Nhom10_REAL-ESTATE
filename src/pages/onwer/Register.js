import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="col-lg-7">
      <div className="card shadow-lg border-0 rounded-lg mt-5">
        <div className="card-header"><h3 className="text-center font-weight-light my-4">Tạo tài khoản</h3></div>
        <div className="card-body">
          <form>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-floating mb-3 mb-md-0">
                  <input className="form-control" id="inputFirstName" type="text" placeholder="Nhập họ của bạn" />
                  <label htmlFor="inputFirstName">Họ</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input className="form-control" id="inputLastName" type="text" placeholder="Nhập tên của bạn" />
                  <label htmlFor="inputLastName">Tên</label>
                </div>
              </div>
            </div>
            <div className="form-floating mb-3">
              <input className="form-control" id="inputEmail" type="email" placeholder="name@example.com" />
              <label htmlFor="inputEmail">Địa chỉ email</label>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-floating mb-3 mb-md-0">
                  <input className="form-control" id="inputPassword" type="password" placeholder="Tạo mật khẩu" />
                  <label htmlFor="inputPassword">Mật khẩu</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3 mb-md-0">
                  <input className="form-control" id="inputPasswordConfirm" type="password" placeholder="Xác nhận mật khẩu" />
                  <label htmlFor="inputPasswordConfirm">Xác nhận mật khẩu</label>
                </div>
              </div>
            </div>
            <div className="mt-4 mb-0">
              <div className="d-grid"><button className="btn btn-primary btn-block" type="button">Tạo tài khoản</button></div>
            </div>
          </form>
        </div>
        <div className="card-footer text-center py-3">
          <div className="small"><Link to="/dang-nhap">Đã có tài khoản? Đăng nhập ngay</Link></div>
        </div>
      </div>
    </div>
  );
};

export default Register; 