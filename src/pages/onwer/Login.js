import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="col-lg-5">
      <div className="card shadow-lg border-0 rounded-lg mt-5">
        <div className="card-header"><h3 className="text-center font-weight-light my-4">Đăng nhập</h3></div>
        <div className="card-body">
          <form>
            <div className="form-floating mb-3">
              <input className="form-control" id="inputEmail" type="email" placeholder="name@example.com" />
              <label htmlFor="inputEmail">Địa chỉ email</label>
            </div>
            <div className="form-floating mb-3">
              <input className="form-control" id="inputPassword" type="password" placeholder="Password" />
              <label htmlFor="inputPassword">Mật khẩu</label>
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" id="inputRememberPassword" type="checkbox" value="" />
              <label className="form-check-label" htmlFor="inputRememberPassword">Ghi nhớ mật khẩu</label>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
              <Link className="small" to="/quen-mat-khau">Quên mật khẩu?</Link>
              <button className="btn btn-primary" type="button">Đăng nhập</button>
            </div>
          </form>
        </div>
        <div className="card-footer text-center py-3">
          <div className="small"><Link to="/dang-ky">Chưa có tài khoản? Đăng ký ngay!</Link></div>
        </div>
      </div>
    </div>
  );
};

export default Login; 