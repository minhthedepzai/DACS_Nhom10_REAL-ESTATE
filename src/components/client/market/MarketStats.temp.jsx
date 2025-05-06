import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FaChartBar, FaChartPie, FaChartLine, FaMapMarkerAlt, FaBuilding, FaHome, FaRegBuilding } from 'react-icons/fa';
import BackToTop from '../BackToTop';
import './MarketStats.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const MarketStats = ({ initialTab = 'price' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [priceChartData, setPriceChartData] = useState({
    labels: [],
    datasets: []
  });
  const [distributionData, setDistributionData] = useState({
    labels: [],
    datasets: []
  });
  const [trendData, setTrendData] = useState({
    labels: [],
    datasets: []
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Giá bất động sản theo khu vực',
        font: {
          family: "'Roboto', sans-serif",
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        },
        color: '#00B98E'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2c3e50',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
        cornerRadius: 8,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.toLocaleString('vi-VN')} tr/m²`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN');
          },
          font: {
            family: "'Roboto', sans-serif",
          }
        },
        title: {
          display: true,
          text: 'Giá (triệu VNĐ/m²)',
          font: {
            family: "'Roboto', sans-serif",
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Khu vực',
          font: {
            family: "'Roboto', sans-serif",
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            family: "'Roboto', sans-serif",
          }
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    barThickness: 30,
    borderRadius: 6,
    maxBarThickness: 35
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Phân bố loại bất động sản',
        font: {
          family: "'Roboto', sans-serif",
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        },
        color: '#00B98E'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2c3e50',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
        cornerRadius: 8,
        boxPadding: 5,
        usePointStyle: true
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeOutCirc'
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Xu hướng giá theo thời gian',
        font: {
          family: "'Roboto', sans-serif",
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        },
        color: '#00B98E'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2c3e50',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
        cornerRadius: 8,
        boxPadding: 5,
        usePointStyle: true
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN') + '%';
          },
          font: {
            family: "'Roboto', sans-serif",
          }
        },
        title: {
          display: true,
          text: 'Tỷ lệ thay đổi (%)',
          font: {
            family: "'Roboto', sans-serif",
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            family: "'Roboto', sans-serif",
          }
        },
        grid: {
          display: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 5,
        hoverRadius: 7
      }
    },
    animation: {
      duration: 2000
    }
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        // Normally we would fetch data from an API
        // For now, we'll use sample data
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample data for average prices by district in HCMC
        const priceSampleData = {
          labels: ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 7', 'Thủ Đức', 'Quận 10', 'Bình Thạnh', 'Tân Bình'],
          datasets: [
            {
              label: 'Căn hộ',
              data: [85, 56, 72, 45, 38, 65, 48, 42],
              backgroundColor: 'rgba(0, 185, 142, 0.8)',
              borderColor: 'rgba(0, 185, 142, 1)',
              borderWidth: 1
            },
            {
              label: 'Nhà phố',
              data: [120, 95, 105, 75, 65, 90, 80, 70],
              backgroundColor: 'rgba(52, 152, 219, 0.8)',
              borderColor: 'rgba(52, 152, 219, 1)',
              borderWidth: 1
            }
          ]
        };
        
        // Distribution data (pie chart)
        const distributionSampleData = {
          labels: ['Căn hộ', 'Nhà phố', 'Biệt thự', 'Đất nền', 'Văn phòng'],
          datasets: [
            {
              data: [35, 25, 15, 20, 5],
              backgroundColor: [
                'rgba(0, 185, 142, 0.8)',
                'rgba(52, 152, 219, 0.8)',
                'rgba(155, 89, 182, 0.8)',
                'rgba(230, 126, 34, 0.8)',
                'rgba(46, 204, 113, 0.8)'
              ],
              borderColor: [
                'rgba(0, 185, 142, 1)',
                'rgba(52, 152, 219, 1)',
                'rgba(155, 89, 182, 1)',
                'rgba(230, 126, 34, 1)',
                'rgba(46, 204, 113, 1)'
              ],
              borderWidth: 1
            }
          ]
        };
        
        // Trend data (line chart)
        const trendSampleData = {
          labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
          datasets: [
            {
              label: 'Căn hộ',
              data: [0, 1.2, 1.8, 2.5, 3.1, 4.2],
              borderColor: 'rgba(0, 185, 142, 1)',
              backgroundColor: 'rgba(0, 185, 142, 0.2)',
              fill: true,
              pointBackgroundColor: 'rgba(0, 185, 142, 1)'
            },
            {
              label: 'Nhà phố',
              data: [0, 0.8, 1.3, 2.0, 2.7, 3.5],
              borderColor: 'rgba(52, 152, 219, 1)',
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              fill: true,
              pointBackgroundColor: 'rgba(52, 152, 219, 1)'
            },
            {
              label: 'Đất nền',
              data: [0, 1.5, 2.2, 3.0, 4.5, 5.2],
              borderColor: 'rgba(230, 126, 34, 1)',
              backgroundColor: 'rgba(230, 126, 34, 0.2)',
              fill: true,
              pointBackgroundColor: 'rgba(230, 126, 34, 1)'
            }
          ]
        };
        
        setPriceChartData(priceSampleData);
        setDistributionData(distributionSampleData);
        setTrendData(trendSampleData);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải dữ liệu thị trường');
        setLoading(false);
        console.error('Error fetching market data:', err);
      }
    };

    fetchMarketData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value * 1000000);
  };

  // Get chart data based on window width
  const getChartData = () => {
    const areas = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 7', 'Thủ Đức', 'Quận 10', 'Bình Thạnh', 'Tân Bình'];
    const apartmentPrices = [85, 55, 70, 42, 38, 63, 45, 40];
    const housePrices = [120, 92, 105, 73, 62, 88, 78, 68];

    if (windowWidth <= 768) {
      // Separate charts for Apartments and Houses
      return [
        {
          title: 'Giá Căn hộ theo khu vực',
          type: 'apartment',
          data: {
            labels: areas,
            datasets: [{
              label: 'Căn hộ',
              data: apartmentPrices,
              backgroundColor: '#00B894',
              borderRadius: 6,
            }]
          }
        },
        {
          title: 'Giá Nhà phố theo khu vực',
          type: 'house',
          data: {
            labels: areas,
            datasets: [{
              label: 'Nhà phố',
              data: housePrices,
              backgroundColor: '#74B9FF',
              borderRadius: 6,
            }]
          }
        }
      ];
    }

    return [{
      title: 'Giá trung bình theo khu vực (triệu VNĐ/m²)',
      type: 'combined',
      data: {
        labels: areas,
        datasets: [
          {
            label: 'Căn hộ',
            data: apartmentPrices,
            backgroundColor: '#00B894',
            borderRadius: 6,
          },
          {
            label: 'Nhà phố',
            data: housePrices,
            backgroundColor: '#74B9FF',
            borderRadius: 6,
          }
        ]
      }
    }];
  };

  // Get the active chart component based on tab
  const renderChart = () => {
    switch(activeTab) {
      case 'price':
        if (windowWidth <= 768) {
          return (
            <div className="responsive-charts">
              {getChartData().map((chart, index) => (
                <div key={index} className="responsive-chart-item">
                  <h4 className="chart-title">{chart.title}</h4>
                  <Bar 
                    options={{
                      ...barChartOptions,
                      plugins: {
                        ...barChartOptions.plugins,
                        title: {
                          ...barChartOptions.plugins.title,
                          text: chart.title
                        }
                      }
                    }} 
                    data={chart.data} 
                  />
                </div>
              ))}
            </div>
          );
        }
        return <Bar options={barChartOptions} data={priceChartData} />;
      case 'distribution':
        return <Pie options={pieChartOptions} data={distributionData} />;
      case 'trend':
        return <Line options={lineChartOptions} data={trendData} />;
      default:
        return <Bar options={barChartOptions} data={priceChartData} />;
    }
  };

  return (
    <>
      <div className="market-stats-breadcrumb">
        <div className="container">
          <h1 className="breadcrumb-title text-center">Thống Kê Thị Trường</h1>
        </div>
      </div>

      <div className="market-stats-container">
        <div className="container">
          <div className="market-stats-header text-center">
            <h2>Phân Tích Thị Trường Bất Động Sản</h2>
            <p>Tổng hợp dữ liệu thị trường và phân tích xu hướng giá bất động sản theo khu vực</p>
          </div>

          {loading ? (
            <div className="chart-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p>Đang tải dữ liệu thị trường...</p>
            </div>
          ) : error ? (
            <div className="chart-error">
              <div className="alert alert-danger" role="alert">
                <h3>Đã xảy ra lỗi</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="chart-tabs">
                <button 
                  className={`chart-tab ${activeTab === 'price' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('price')}
                >
                  <FaChartBar className="tab-icon" />
                  <span>Giá Theo Khu Vực</span>
                </button>
                <button 
                  className={`chart-tab ${activeTab === 'distribution' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('distribution')}
                >
                  <FaChartPie className="tab-icon" />
                  <span>Phân Bố Loại Hình</span>
                </button>
                <button 
                  className={`chart-tab ${activeTab === 'trend' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('trend')}
                >
                  <FaChartLine className="tab-icon" />
                  <span>Xu Hướng Giá</span>
                </button>
              </div>

              <div className="chart-container">
                <div className="chart-wrapper">
                  {renderChart()}
                </div>
              </div>

              <div className="market-stats-grid">
                {/* Key metrics section */}
                <div className="stats-card-container">
                  <div className="row">
                    <div className="col-md-3 col-sm-6">
                      <div className="stats-card">
                        <div className="stats-icon">
                          <FaMapMarkerAlt />
                        </div>
                        <div className="stats-content">
                          <h3>Quận 1</h3>
                          <p>Khu vực có giá cao nhất</p>
                          <div className="stats-value">{formatCurrency(120)}/m²</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <div className="stats-card">
                        <div className="stats-icon">
                          <FaBuilding />
                        </div>
                        <div className="stats-content">
                          <h3>Căn hộ</h3>
                          <p>Loại hình phổ biến nhất</p>
                          <div className="stats-value">35% thị trường</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <div className="stats-card">
                        <div className="stats-icon">
                          <FaHome />
                        </div>
                        <div className="stats-content">
                          <h3>Đất nền</h3>
                          <p>Tăng trưởng mạnh nhất</p>
                          <div className="stats-value">+5.2% (6 tháng)</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                      <div className="stats-card">
                        <div className="stats-icon">
                          <FaRegBuilding />
                        </div>
                        <div className="stats-content">
                          <h3>Thủ Đức</h3>
                          <p>Khu vực tiềm năng</p>
                          <div className="stats-value">{formatCurrency(38)}/m²</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <BackToTop />
    </>
  );
};

MarketStats.propTypes = {
  initialTab: PropTypes.oneOf(['price', 'distribution', 'trend'])
};

MarketStats.defaultProps = {
  initialTab: 'price'
};

export default MarketStats; 