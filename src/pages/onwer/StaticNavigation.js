import React from 'react';
import { Link } from 'react-router-dom';

const StaticNavigation = () => {
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Giao diện tĩnh</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/">Bảng điều khiển</Link>
        </li>
        <li className="breadcrumb-item active">Giao diện tĩnh</li>
      </ol>
      <div className="card mb-4">
        <div className="card-body">
          <p className="mb-0">
            Trang này là một ví dụ về việc sử dụng giao diện tĩnh. Bằng cách xóa lớp
            <code>.sb-nav-fixed</code>
            khỏi
            <code>body</code>, thanh điều hướng trên cùng và thanh điều hướng bên sẽ trở thành tĩnh khi cuộn. Cuộn xuống trang này để xem ví dụ.
          </p>
        </div>
      </div>
      <div style={{ height: '100vh' }}></div>
      <div className="card mb-4">
        <div className="card-body">Khi cuộn, thanh điều hướng vẫn ở đầu trang. Đây là kết thúc của bản demo giao diện tĩnh.</div>
      </div>
    </div>
  );
};

export default StaticNavigation; 