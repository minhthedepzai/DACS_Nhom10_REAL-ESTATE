import React from 'react';

const Search = () => {
  return (
    <div className="container-fluid bg-primary mb-5 wow fadeIn" data-wow-delay="0.1s" style={{ padding: '35px' }}>
      <div className="container">
        <div className="row g-2">
          <div className="col-md-10">
            <div className="row g-2">
              <div className="col-md-4">
                <select className="form-select border-0 py-3 animate-input">
                  <option>Loại Bất Động Sản</option>
                  <option value="1">Chung cư</option>
                  <option value="2">Biệt thự</option>
                  <option value="3">Nhà phố</option>
                  <option value="4">Văn phòng</option>
                  <option value="5">Đất nền</option>
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select border-0 py-3 animate-input">
                  <option>Khu Vực</option>
                  <option value="1">Quận 1</option>
                  <option value="2">Quận 2</option>
                  <option value="3">Quận 3</option>
                  <option value="4">Quận 7</option>
                  <option value="5">Quận Bình Thạnh</option>
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select border-0 py-3 animate-input">
                  <option>Giá Tiền</option>
                  <option value="1">Dưới 1 tỷ</option>
                  <option value="2">1 - 2 tỷ</option>
                  <option value="3">2 - 3 tỷ</option>
                  <option value="4">3 - 5 tỷ</option>
                  <option value="5">Trên 5 tỷ</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <button className="btn btn-dark border-0 w-100 py-3 animate-input">Tìm Kiếm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;