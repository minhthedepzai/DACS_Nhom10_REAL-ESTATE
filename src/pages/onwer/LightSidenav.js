import React from 'react';
import { Link } from 'react-router-dom';

const LightSidenav = () => {
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Thanh bên sáng</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/">Bảng điều khiển</Link>
        </li>
        <li className="breadcrumb-item active">Thanh bên sáng</li>
      </ol>
      <div className="card mb-4">
        <div className="card-body">
          Trang này là một ví dụ về việc sử dụng tùy chọn thanh bên sáng. Bằng cách thêm lớp
          <code>.sb-sidenav-light</code>
          vào lớp
          <code>.sb-sidenav</code>
          , thanh bên sẽ có một bảng màu sáng. Lớp
          <code>.sb-sidenav-dark</code>
          cũng có sẵn cho tùy chọn tối hơn.
        </div>
      </div>
    </div>
  );
};

export default LightSidenav; 