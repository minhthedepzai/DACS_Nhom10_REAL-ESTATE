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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaChartBar, FaMapMarkerAlt, FaBuilding, FaHome, FaRegBuilding } from 'react-icons/fa';
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
);

const MarketStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceChartData, setPriceChartData] = useState({
    labels: [],
    datasets: []
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: windowWidth <= 768 ? false : true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Roboto', sans-serif",
            size: windowWidth <= 768 ? 10 : 12
          },
          usePointStyle: true,
          padding: windowWidth <= 768 ? 10 : 20,
          color: '#00B98E'
        }
      },
      title: {
        display: true,
        text: 'Giá bất động sản theo khu vực',
        font: {
          family: "'Roboto', sans-serif",
          size: windowWidth <= 768 ? 14 : 16,
          weight: 'bold'
        },
        padding: {
          top: windowWidth <= 768 ? 5 : 10,
          bottom: windowWidth <= 768 ? 10 : 20
        },
        color: '#00B98E'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#00B98E',
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
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Roboto', sans-serif",
            size: windowWidth <= 768 ? 8 : 12
          },
          maxRotation: windowWidth <= 768 ? 45 : 0,
          minRotation: windowWidth <= 768 ? 45 : 0
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: "'Roboto', sans-serif",
            size: windowWidth <= 768 ? 8 : 12
          },
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' tr';
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 6
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
        
        setPriceChartData(priceSampleData);
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
    const apartmentPrices = [85, 56, 72, 45, 38, 65, 48, 42];
    const housePrices = [120, 95, 105, 75, 65, 90, 80, 70];

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
              backgroundColor: 'rgba(0, 185, 142, 0.8)',
              borderColor: 'rgba(0, 185, 142, 1)',
              borderWidth: 1,
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
              backgroundColor: 'rgba(52, 152, 219, 0.8)',
              borderColor: 'rgba(52, 152, 219, 1)',
              borderWidth: 1,
              borderRadius: 6,
            }]
          }
        }
      ];
    }

    // Return combined chart for desktop
    return [{
      title: 'Giá bất động sản theo khu vực',
      type: 'combined',
      data: priceChartData
    }];
  };

  // Render chart based on screen size
  const renderCharts = () => {
    const charts = getChartData();
    
    if (windowWidth <= 768) {
      return (
        <div className="responsive-charts" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          width: '100%',
          marginBottom: '2rem'
        }}>
          {charts.map((chart, index) => (
            <div key={index} className="responsive-chart-item" style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              minHeight: '400px'
            }}>
              <h4 className="chart-title" style={{
                fontSize: '1rem',
                color: '#00B98E',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>{chart.title}</h4>
              <div style={{
                height: '350px',
                width: '100%',
                position: 'relative'
              }}>
                <Bar 
                  options={{
                    ...barChartOptions,
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      ...barChartOptions.plugins,
                      title: {
                        ...barChartOptions.plugins.title,
                        display: false
                      },
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      ...barChartOptions.scales,
                      x: {
                        ...barChartOptions.scales.x,
                        ticks: {
                          ...barChartOptions.scales.x.ticks,
                          maxRotation: 45,
                          minRotation: 45,
                          font: {
                            size: 10
                          }
                        }
                      },
                      y: {
                        ...barChartOptions.scales.y,
                        beginAtZero: true,
                        ticks: {
                          font: {
                            size: 10
                          }
                        }
                      }
                    }
                  }} 
                  data={chart.data} 
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Render single combined chart for desktop
    return <Bar options={barChartOptions} data={priceChartData} />;
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="chart-section" style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                {windowWidth <= 768 ? (
                  <div className="responsive-charts" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                  }}>
                    {getChartData().map((chart, index) => (
                      <div key={index} className="responsive-chart-item">
                        <h4 className="chart-title" style={{
                          fontSize: '1rem',
                          color: '#00B98E',
                          textAlign: 'center',
                          marginBottom: '1rem'
                        }}>{chart.title}</h4>
                        <div style={{
                          height: '250px',
                          width: '100%',
                          position: 'relative'
                        }}>
                          <Bar 
                            options={{
                              ...barChartOptions,
                              maintainAspectRatio: false,
                              responsive: true,
                              plugins: {
                                ...barChartOptions.plugins,
                                title: {
                                  display: false
                                },
                                legend: {
                                  display: false
                                }
                              },
                              scales: {
                                x: {
                                  ...barChartOptions.scales.x,
                                  ticks: {
                                    ...barChartOptions.scales.x.ticks,
                                    maxRotation: 45,
                                    minRotation: 45,
                                    font: {
                                      size: 10
                                    }
                                  }
                                },
                                y: {
                                  ...barChartOptions.scales.y,
                                  beginAtZero: true,
                                  ticks: {
                                    font: {
                                      size: 10
                                    }
                                  }
                                }
                              }
                            }} 
                            data={chart.data} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Bar options={barChartOptions} data={priceChartData} />
                )}
              </div>

              <div className="stats-section">
                <div className="row g-4">
                  <div className="col-md-3 col-sm-6">
                    <div className="stats-card" style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 185, 142, 0.1)'
                    }}>
                      <div className="stats-icon" style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: 'rgba(0, 185, 142, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: '#00B98E'
                      }}>
                        <FaMapMarkerAlt />
                      </div>
                      <div className="stats-content">
                        <h3 style={{ 
                          color: '#00B98E',
                          fontSize: '1.1rem',
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}>Quận 1</h3>
                        <p style={{
                          color: '#666',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem'
                        }}>Khu vực có giá cao nhất</p>
                        <div className="stats-value" style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: '#00B98E'
                        }}>{formatCurrency(120)}/m²</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="stats-card" style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 185, 142, 0.1)'
                    }}>
                      <div className="stats-icon" style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: 'rgba(0, 185, 142, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: '#00B98E'
                      }}>
                        <FaBuilding />
                      </div>
                      <div className="stats-content">
                        <h3 style={{ 
                          color: '#00B98E',
                          fontSize: '1.1rem',
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}>Căn hộ</h3>
                        <p style={{
                          color: '#666',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem'
                        }}>Loại hình phổ biến nhất</p>
                        <div className="stats-value" style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: '#00B98E'
                        }}>35% thị trường</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="stats-card" style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 185, 142, 0.1)'
                    }}>
                      <div className="stats-icon" style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: 'rgba(0, 185, 142, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: '#00B98E'
                      }}>
                        <FaHome />
                      </div>
                      <div className="stats-content">
                        <h3 style={{ 
                          color: '#00B98E',
                          fontSize: '1.1rem',
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}>Đất nền</h3>
                        <p style={{
                          color: '#666',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem'
                        }}>Tăng trưởng mạnh nhất</p>
                        <div className="stats-value" style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: '#00B98E'
                        }}>+5.2% (6 tháng)</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="stats-card" style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 185, 142, 0.1)'
                    }}>
                      <div className="stats-icon" style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: 'rgba(0, 185, 142, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: '#00B98E'
                      }}>
                        <FaRegBuilding />
                      </div>
                      <div className="stats-content">
                        <h3 style={{ 
                          color: '#00B98E',
                          fontSize: '1.1rem',
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}>Thủ Đức</h3>
                        <p style={{
                          color: '#666',
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem'
                        }}>Khu vực tiềm năng</p>
                        <div className="stats-value" style={{
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: '#00B98E'
                        }}>{formatCurrency(38)}/m²</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <BackToTop />
    </>
  );
};

export default MarketStats; 