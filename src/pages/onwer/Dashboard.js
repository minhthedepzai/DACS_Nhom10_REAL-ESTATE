import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const areaChartRef = useRef(null);
  const barChartRef = useRef(null);
  
  useEffect(() => {
    // Biểu đồ vùng
    if (areaChartRef.current) {
      const ctx = areaChartRef.current.getContext('2d');
      
      const myAreaChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [
            'Th 3 1', 'Th 3 2', 'Th 3 3', 'Th 3 4', 'Th 3 5', 'Th 3 6', 'Th 3 7', 'Th 3 8', 'Th 3 9', 'Th 3 10', 'Th 3 11', 'Th 3 12', 'Th 3 13'
          ],
          datasets: [{
            label: 'Phiên',
            lineTension: 0.3,
            backgroundColor: 'rgba(2,117,216,0.2)',
            borderColor: 'rgba(2,117,216,1)',
            pointRadius: 5,
            pointBackgroundColor: 'rgba(2,117,216,1)',
            pointBorderColor: 'rgba(255,255,255,0.8)',
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(2,117,216,1)',
            pointHitRadius: 50,
            pointBorderWidth: 2,
            data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
          }],
        },
        options: {
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              ticks: {
                min: 0,
                max: 40000,
                maxTicksLimit: 5
              },
              grid: {
                color: 'rgba(0, 0, 0, .125)',
              }
            },
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      
      return () => {
        myAreaChart.destroy();
      };
    }
  }, []);
  
  useEffect(() => {
    // Biểu đồ cột
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      
      const myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
          datasets: [{
            label: 'Doanh thu',
            backgroundColor: 'rgba(2,117,216,1)',
            borderColor: 'rgba(2,117,216,1)',
            data: [4215, 5312, 6251, 7841, 9821, 14984],
          }],
        },
        options: {
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              ticks: {
                min: 0,
                max: 15000,
                maxTicksLimit: 5
              },
              grid: {
                color: 'rgba(0, 0, 0, .125)',
              }
            },
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      
      return () => {
        myBarChart.destroy();
      };
    }
  }, []);

  // Tải Bootstrap JS cho dropdowns và các component khác
  useEffect(() => {
    // Kiểm tra xem Bootstrap JS đã được tải chưa
    if (typeof window.bootstrap === 'undefined') {
      // Nếu chưa tải, tải động
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <div style={{ 
      margin: '-56px -1rem 0 -225px', 
      padding: '56px 0 0 225px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{ padding: '0.5rem' }}>
        <div className="row g-2">
          <div className="col-xl-3 col-md-6 px-1">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">Thẻ chính</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="#">
                  Xem chi tiết
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 px-1">
            <div className="card bg-warning text-white h-100">
              <div className="card-body">Thẻ cảnh báo</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="#">
                  Xem chi tiết
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 px-1">
            <div className="card bg-success text-white h-100">
              <div className="card-body">Thẻ thành công</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="#">
                  Xem chi tiết
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 px-1">
            <div className="card bg-danger text-white h-100">
              <div className="card-body">Thẻ nguy hiểm</div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="#">
                  Xem chi tiết
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-xl-6 px-1">
            <div className="card">
              <div className="card-header">
                <i className="fas fa-chart-area me-1"></i>
                Ví dụ biểu đồ vùng
              </div>
              <div className="card-body">
                <canvas id="myAreaChart" width="100%" height="40" ref={areaChartRef}></canvas>
              </div>
            </div>
          </div>
          <div className="col-xl-6 px-1">
            <div className="card">
              <div className="card-header">
                <i className="fas fa-chart-bar me-1"></i>
                Ví dụ biểu đồ cột
              </div>
              <div className="card-body">
                <canvas id="myBarChart" width="100%" height="40" ref={barChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12 px-1">
            <div className="card">
              <div className="card-header">
                <i className="fas fa-table me-1"></i>
                Ví dụ bảng dữ liệu
              </div>
              <div className="card-body">
                <table id="datatablesSimple" className="table table-striped">
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Vị trí</th>
                      <th>Văn phòng</th>
                      <th>Tuổi</th>
                      <th>Ngày bắt đầu</th>
                      <th>Lương</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>Tên</th>
                      <th>Vị trí</th>
                      <th>Văn phòng</th>
                      <th>Tuổi</th>
                      <th>Ngày bắt đầu</th>
                      <th>Lương</th>
                    </tr>
                  </tfoot>
                  <tbody>
                    <tr>
                      <td>Tiger Nixon</td>
                      <td>Kiến trúc sư hệ thống</td>
                      <td>Edinburgh</td>
                      <td>61</td>
                      <td>2011/04/25</td>
                      <td>$320,800</td>
                    </tr>
                    <tr>
                      <td>Garrett Winters</td>
                      <td>Kế toán</td>
                      <td>Tokyo</td>
                      <td>63</td>
                      <td>2011/07/25</td>
                      <td>$170,750</td>
                    </tr>
                    <tr>
                      <td>Ashton Cox</td>
                      <td>Junior Technical Author</td>
                      <td>San Francisco</td>
                      <td>66</td>
                      <td>2009/01/12</td>
                      <td>$86,000</td>
                    </tr>
                    <tr>
                      <td>Cedric Kelly</td>
                      <td>Senior Javascript Developer</td>
                      <td>Edinburgh</td>
                      <td>22</td>
                      <td>2012/03/29</td>
                      <td>$433,060</td>
                    </tr>
                    <tr>
                      <td>Airi Satou</td>
                      <td>Accountant</td>
                      <td>Tokyo</td>
                      <td>33</td>
                      <td>2008/11/28</td>
                      <td>$162,700</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 