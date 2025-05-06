// Mock dữ liệu người dùng
const mockUsers = [
  {
    id: 1,
    fullName: "Nguyễn Văn An",
    username: "nguyenvanan",
    email: "nguyenvanan@example.com",
    phoneNumber: "0901234567",
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=random",
    roleId: 1, // User
    isBlocked: false,
    createdAt: "2023-04-15T08:30:00Z"
  },
  {
    id: 2,
    fullName: "Trần Thị Bình",
    username: "tranthibinh",
    email: "tranthibinh@example.com",
    phoneNumber: "0912345678",
    avatar: "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=random",
    roleId: 2, // Admin
    isBlocked: false,
    createdAt: "2023-03-10T10:15:00Z"
  },
  {
    id: 3,
    fullName: "Lê Văn Cường",
    username: "levancuong",
    email: "levancuong@example.com",
    phoneNumber: "0923456789",
    avatar: "https://ui-avatars.com/api/?name=Le+Van+Cuong&background=random",
    roleId: 3, // Moderator
    isBlocked: true,
    createdAt: "2023-05-20T14:45:00Z"
  },
  {
    id: 4,
    fullName: "Phạm Thị Dung",
    username: "phamthidung",
    email: "phamthidung@example.com",
    phoneNumber: "0934567890",
    avatar: "https://ui-avatars.com/api/?name=Pham+Thi+Dung&background=random",
    roleId: 1, // User
    isBlocked: false,
    createdAt: "2023-06-05T09:20:00Z"
  },
  {
    id: 5,
    fullName: "Hoàng Văn Em",
    username: "hoangvanem",
    email: "hoangvanem@example.com",
    phoneNumber: "0945678901",
    avatar: "https://ui-avatars.com/api/?name=Hoang+Van+Em&background=random",
    roleId: 1, // User
    isBlocked: false,
    createdAt: "2023-07-12T11:30:00Z"
  }
];

// Mock dữ liệu vi phạm
const mockViolations = [
  {
    id: 1,
    user: mockUsers[2], // Lê Văn Cường
    violationType: "Spam nội dung",
    violationCount: 3,
    warned: true,
    createdAt: "2023-08-15T08:30:00Z"
  },
  {
    id: 2,
    user: mockUsers[3], // Phạm Thị Dung
    violationType: "Nội dung không phù hợp",
    violationCount: 1,
    warned: false,
    createdAt: "2023-09-10T10:15:00Z"
  },
  {
    id: 3,
    user: mockUsers[4], // Hoàng Văn Em
    violationType: "Thông tin sai lệch",
    violationCount: 2,
    warned: false,
    createdAt: "2023-10-05T14:45:00Z"
  }
];

// Các hàm giả lập API
export const mockGetAllUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockUsers]);
    }, 500);
  });
};

export const mockBlockUser = (id, isBlocked) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        mockUsers[userIndex].isBlocked = isBlocked;
        resolve({ 
          success: true,
          message: `Người dùng đã được ${isBlocked ? 'chặn' : 'bỏ chặn'} thành công!` 
        });
      } else {
        reject({ 
          success: false,
          message: "Không tìm thấy người dùng!" 
        });
      }
    }, 500);
  });
};

export const mockDeleteUser = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        // Soft delete (không xóa thực sự khỏi mảng)
        // mockUsers.splice(userIndex, 1);
        resolve({ 
          success: true,
          message: "Người dùng đã được xóa thành công!" 
        });
      } else {
        reject({ 
          success: false,
          message: "Không tìm thấy người dùng!" 
        });
      }
    }, 500);
  });
};

export const mockUpdateUserRole = (id, roleId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        mockUsers[userIndex].roleId = roleId;
        resolve({ 
          success: true,
          message: "Quyền người dùng đã được cập nhật thành công!" 
        });
      } else {
        reject({ 
          success: false,
          message: "Không tìm thấy người dùng!" 
        });
      }
    }, 500);
  });
};

export const mockGetUserViolations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockViolations]);
    }, 500);
  });
};

export const mockWarnUser = (id, warningContent, reason) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        // Cập nhật trạng thái đã cảnh báo trong danh sách vi phạm
        const violationIndex = mockViolations.findIndex(v => v.user.id === id);
        if (violationIndex !== -1) {
          mockViolations[violationIndex].warned = true;
        }
        resolve({ 
          success: true,
          message: "Đã gửi cảnh báo thành công!",
          details: { warningContent, reason }
        });
      } else {
        reject({ 
          success: false,
          message: "Không tìm thấy người dùng!" 
        });
      }
    }, 500);
  });
}; 