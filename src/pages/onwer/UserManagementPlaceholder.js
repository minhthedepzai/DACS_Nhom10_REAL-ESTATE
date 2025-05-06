import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5278/api/users';

const UserManagementPlaceholder = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockUser, setBlockUser] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockEvidence, setBlockEvidence] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const token = localStorage.getItem('token');
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const ROLES = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Agent' },
    { id: 3, name: 'User' },
  ];

  // Lấy danh sách tài khoản
  const fetchUsers = () => {
    setLoading(true);
    axios.get(API_BASE, axiosConfig)
      .then(res => {
        setUsers(res.data.data || []);
        setError('');
      })
      .catch(() => setError('Không thể tải danh sách tài khoản!'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  // Xóa tài khoản
  const handleDelete = (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${user.email}?`)) return;
    setActionLoading(true);
    axios.delete(`${API_BASE}/${user.userID}`, axiosConfig)
      .then(() => {
        setUsers(users.filter(u => u.userID !== user.userID));
        alert('Đã xóa tài khoản thành công!');
      })
      .catch(() => alert('Xóa tài khoản thất bại!'))
      .finally(() => setActionLoading(false));
  };

  // Khi bấm nút Chặn, gửi luôn request với lý do mặc định
  const handleBlockUser = (user) => {
    if (user.isBanned) {
      // Bỏ chặn
      if (!window.confirm('Bạn có chắc chắn muốn bỏ chặn tài khoản này không?')) return;
      setActionLoading(true);
      axios.patch(`${API_BASE}/${user.userID}/block`, {
        isBanned: false,
        reason: 'Bỏ chặn'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          fetchUsers();
          alert('Đã bỏ chặn tài khoản thành công!');
        })
        .catch(() => alert('Bỏ chặn tài khoản thất bại!'))
        .finally(() => setActionLoading(false));
    } else {
      // Chặn
      if (!window.confirm('Bạn có chắc chắn muốn chặn tài khoản này không?')) return;
      setActionLoading(true);
      axios.patch(`${API_BASE}/${user.userID}/block`, {
        isBanned: true,
        reason: 'Vi phạm quy định'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          fetchUsers();
          alert('Đã chặn tài khoản thành công!');
        })
        .catch(() => alert('Chặn tài khoản thất bại!'))
        .finally(() => setActionLoading(false));
    }
  };

  // Đổi vai trò
  const handleChangeRole = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.roleID);
    setShowRoleModal(true);
  };

  const handleRoleSubmit = () => {
    if (!selectedUser || !selectedRole) return;
    setActionLoading(true);
    axios.patch(`${API_BASE}/${selectedUser.userID}/role`, { roleId: Number(selectedRole) }, axiosConfig)
      .then(() => {
        setShowRoleModal(false);
        fetchUsers();
        alert('Đã đổi vai trò thành công!');
      })
      .catch(() => alert('Đổi vai trò thất bại!'))
      .finally(() => setActionLoading(false));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Quản lý người dùng</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.userID}>
                <td>{idx + 1}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.isBanned ? 'bg-danger' : 'bg-success'}`}>
                    {user.isBanned ? 'Đã chặn' : 'Hoạt động'}
                  </span>
                </td>
                <td>{user.roleName}</td>
                <td>
                  <button
                    className={`btn btn-sm ${user.isBanned ? 'btn-success' : 'btn-warning'} me-1`}
                    disabled={actionLoading}
                    onClick={() => handleBlockUser(user)}
                  >
                    {user.isBanned ? 'Bỏ chặn' : 'Chặn'}
                  </button>
                  <button
                    className="btn btn-sm btn-primary me-1"
                    disabled={actionLoading}
                    onClick={() => handleChangeRole(user)}
                  >
                    Đổi vai trò
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    disabled={actionLoading}
                    onClick={() => handleDelete(user)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted">Không có tài khoản nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {/* Modal chọn vai trò */}
      {showRoleModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow rounded-4 p-3" style={{ minWidth: 350, maxWidth: 400 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Đổi vai trò tài khoản</h5>
                <button type="button" className="btn-close" onClick={() => setShowRoleModal(false)}></button>
              </div>
              <div className="modal-body pt-2">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <div className="form-control-plaintext text-primary fw-bold">{selectedUser?.email}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Chọn vai trò mới</label>
                  <select
                    className="form-select"
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                  >
                    {ROLES.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0 d-flex justify-content-end gap-2">
                <button className="btn btn-outline-secondary px-4" onClick={() => setShowRoleModal(false)}>Hủy</button>
                <button className="btn btn-success px-4 fw-bold" disabled={actionLoading} onClick={handleRoleSubmit}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPlaceholder;
