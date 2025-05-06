import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PostStatsDashboard = () => {
  const viewsChartRef = useRef(null);
  const interactionsChartRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filterType, setFilterType] = useState('week');

  // Dữ liệu mẫu
  const postStats = [
    { id: 1, title: 'Căn hộ cao cấp Quận 1', views: 1250, likes: 45, shares: 12, comments: 8, date: '2023-05-01' },
    { id: 2, title: 'Nhà phố Quận 2', views: 980, likes: 32, shares: 5, comments: 4, date: '2023-05-02' },
    { id: 3, title: 'Đất nền Quận 9', views: 2100, likes: 78, shares: 23, comments: 15, date: '2023-05-03' },
    { id: 4, title: 'Biệt thự Quận 7', views: 1750, likes: 65, shares: 18, comments: 10, date: '2023-05-04' },
    { id: 5, title: 'Căn hộ studio Quận 4', views: 890, likes: 28, shares: 7, comments: 3, date: '2023-05-05' },
  ];

  useEffect(() => {
    // Biểu đồ lượt xem
    if (viewsChartRef.current) {
      const ctx = viewsChartRef.current.getContext('2d');
      
      const viewsChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
          datasets: [{
            label: 'Lượt xem',
            lineTension: 0.3,
            backgroundColor: 'rgba(78, 115, 223, 0.05)',
            borderColor: 'rgba(78, 115, 223, 1)',
            pointRadius: 3,
            pointBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointBorderColor: 'rgba(78, 115, 223, 1)',
            pointHoverRadius: 3,
            pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [1250, 980, 2100, 1750, 890, 1430, 2100],
          }],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              ticks: {
                min: 0,
                max: 2500,
                maxTicksLimit: 5
              },
              grid: {
                color: 'rgb(234, 236, 244)'
              }
            },
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgb(255,255,255)',
              bodyColor: '#858796',
              titleMarginBottom: 10,
              titleColor: '#6e707e',
              borderColor: '#dddfeb',
              borderWidth: 1,
              padding: 15,
              displayColors: false,
              intersect: false,
              mode: 'index',
              caretPadding: 10,
            }
          }
        }
      });
      
      return () => {
        viewsChart.destroy();
      };
    }
  }, [filterType]);

  useEffect(() => {
    // Biểu đồ tương tác
    if (interactionsChartRef.current) {
      const ctx = interactionsChartRef.current.getContext('2d');
      
      const interactionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Thích', 'Chia sẻ', 'Bình luận', 'Lưu bài'],
          datasets: [{
            label: 'Tương tác',
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
            hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
            hoverBorderColor: 'rgba(234, 236, 244, 1)',
            data: [248, 65, 40, 120],
          }],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              ticks: {
                min: 0,
                max: 300,
                maxTicksLimit: 5
              },
              grid: {
                color: 'rgb(234, 236, 244)'
              }
            },
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgb(255,255,255)',
              bodyColor: '#858796',
              titleMarginBottom: 10,
              titleColor: '#6e707e',
              borderColor: '#dddfeb',
              borderWidth: 1,
              padding: 15,
              displayColors: false,
              intersect: false,
              mode: 'index',
              caretPadding: 10,
            }
          }
        }
      });
      
      return () => {
        interactionsChart.destroy();
      };
    }
  }, [filterType]);

  return (
    <div className="dashboard-container" style={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="container-fluid">
        
        {/* Header */}
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Thống Kê Bài Đăng</h1>
          <div className="d-flex">
            <div className="mr-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-control bg-white border-0 small"
              />
            </div>
            <div className="mr-2">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-control bg-white border-0 small"
              />
            </div>
            <select 
              className="form-control bg-white border-0 small"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="day">Theo ngày</option>
              <option value="week">Theo tuần</option>
              <option value="month">Theo tháng</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        <div className="row">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Tổng lượt xem</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">24,845</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-eye fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Tổng tương tác</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">473</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-thumbs-up fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Bài đăng mới</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">12</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Tỉ lệ tương tác</div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">1.9%</div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-percent fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Lượt xem bài đăng</h6>
                <div className="dropdown no-arrow">
                  <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" 
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                  </a>
                </div>
              </div>
              <div className="card-body" style={{ height: '320px' }}>
                <canvas ref={viewsChartRef}></canvas>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-lg-5">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Phân loại tương tác</h6>
              </div>
              <div className="card-body" style={{ height: '320px' }}>
                <canvas ref={interactionsChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Chi tiết bài đăng</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tiêu đề</th>
                    <th>Lượt xem</th>
                    <th>Thích</th>
                    <th>Chia sẻ</th>
                    <th>Bình luận</th>
                    <th>Ngày đăng</th>
                  </tr>
                </thead>
                <tbody>
                  {postStats.map(post => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.title}</td>
                      <td>{post.views}</td>
                      <td>{post.likes}</td>
                      <td>{post.shares}</td>
                      <td>{post.comments}</td>
                      <td>{post.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .dashboard-container {
          font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .card {
          border: 0;
          border-radius: 0.35rem;
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
        }
        .card-header {
          background-color: #f8f9fc;
          border-bottom: 1px solid #e3e6f0;
        }
        .table-responsive {
          display: block;
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .table {
          width: 100%;
          margin-bottom: 1rem;
          color: #858796;
        }
        .table th {
          border-top: 0;
          font-weight: 600;
          color: #4e73df;
        }
        .text-primary {
          color: #4e73df !important;
        }
        .border-left-primary {
          border-left: 0.25rem solid #4e73df !important;
        }
        .border-left-success {
          border-left: 0.25rem solid #1cc88a !important;
        }
        .border-left-info {
          border-left: 0.25rem solid #36b9cc !important;
        }
        .border-left-warning {
          border-left: 0.25rem solid #f6c23e !important;
        }
      `}</style>
    </div>
  );
};

export default PostStatsDashboard;