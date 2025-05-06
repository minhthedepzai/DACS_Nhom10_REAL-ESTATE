{showRegisterForm && (
  <div className="auth-image-container">
    <img src="/img/property-1.jpg" alt="Bất động sản" />
    <div className="auth-image-overlay">
      <div className="auth-image-quote">Tìm ngôi nhà mơ ước của bạn cùng Makaan</div>
      <div className="auth-image-text">Chúng tôi cung cấp dịch vụ môi giới bất động sản hàng đầu, với đội ngũ chuyên viên giàu kinh nghiệm sẽ giúp bạn tìm được ngôi nhà lý tưởng.</div>
      <button className="auth-image-explore">Khám phá ngay</button>
    </div>
  </div>
)}

{!showRegisterForm && (
  <div className="auth-image-container">
    <img src="/img/property-2.jpg" alt="Bất động sản" />
    <div className="auth-image-overlay">
      <div className="auth-image-quote">Đăng nhập để quản lý tài sản của bạn</div>
      <div className="auth-image-text">Theo dõi các bất động sản yêu thích và nhận thông báo khi có cập nhật mới về giá cả hoặc chính sách.</div>
      <button className="auth-image-explore">Xem danh sách BĐS</button>
    </div>
  </div>
)} 