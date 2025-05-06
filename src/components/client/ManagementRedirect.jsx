import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/client/authService';

const ManagementRedirect = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      try {
        setIsLoading(true);
        
        // Đợi một chút để đảm bảo token đã được load
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Kiểm tra và log role để debug
        const role = authService.getUserRole();
        console.log('Current user role:', role);
        
        if (authService.isAdmin()) {
          console.log('Redirecting to admin...');
          window.location.href = '/admin/';
          return;
        } 
        
        if (authService.isOwner()) {
          console.log('Redirecting to owner...');
          window.location.href = '/onwer/';
          return;
        }
        
        // Nếu không có quyền truy cập, chuyển hướng về trang chủ
        console.log('No management access, redirecting to home...');
        window.location.href = '/';
      } catch (error) {
        console.error('Error during redirect:', error);
        window.location.href = '/';
      } finally {
        setIsLoading(false);
      }
    };

    checkRoleAndRedirect();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang chuyển hướng...</span>
        </div>
      </div>
    );
  }

  return null;
};

export default ManagementRedirect; 