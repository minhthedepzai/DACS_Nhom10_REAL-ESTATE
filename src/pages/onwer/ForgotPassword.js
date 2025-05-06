import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="col-lg-5">
      <div className="card shadow-lg border-0 rounded-lg mt-5">
        <div className="card-header"><h3 className="text-center font-weight-light my-4">Khôi phục mật khẩu</h3></div>
        <div className="card-body">
          <div className="small mb-3 text-muted">Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.</div>
          <form>
            <div className="form-floating mb-3">
              <input className="form-control" id="inputEmail" type="email" placeholder="name@example.com" />
              <label htmlFor="inputEmail">Địa chỉ email</label>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
              <Link className="small" to="/dang-nhap">Quay lại đăng nhập</Link>
              <button className="btn btn-primary" type="button">Đặt lại mật khẩu</button>
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

export default ForgotPassword; 