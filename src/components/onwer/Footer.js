import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 bg-light mt-auto">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-between small">
          <div className="text-muted">Bản quyền &copy; Trang web của bạn 2023</div>
          <div>
            <a href="#!">Chính sách bảo mật</a>
            &middot;
            <a href="#!">Điều khoản &amp; Điều kiện</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 