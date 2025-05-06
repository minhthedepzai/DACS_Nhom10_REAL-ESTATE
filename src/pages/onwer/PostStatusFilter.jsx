import React, { useState } from 'react';
import { Card, Button, Form, Badge, Table } from 'react-bootstrap';

const mockPosts = [
  {
    id: 101,
    title: 'Căn hộ cao cấp Quận 1',
    status: 'published',
    date: '2024-12-01',
  },
  {
    id: 102,
    title: 'Nhà phố Quận 5 giá rẻ',
    status: 'pending',
    date: '2025-01-15',
  },
  {
    id: 103,
    title: 'Đất nền dự án Quận 9',
    status: 'rejected',
    date: '2025-02-03',
  },
  {
    id: 104,
    title: 'Biệt thự Quận 7 full nội thất',
    status: 'published',
    date: '2025-03-21',
  },
];

const statusLabels = {
  published: { label: 'Đang hiển thị', variant: 'success' },
  pending: { label: 'Chờ duyệt', variant: 'warning' },
  rejected: { label: 'Bị từ chối', variant: 'danger' },
};

const PostStatusFilter = () => {
  const [filter, setFilter] = useState('all');

  const filteredPosts =
    filter === 'all'
      ? mockPosts
      : mockPosts.filter((post) => post.status === filter);

  return (
    <div className=" p-4">
      <h3 className="mb-4">Quản lý trạng thái bài đăng</h3>

      {/* Bộ lọc */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        <Form.Select
          style={{ maxWidth: '250px' }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đang hiển thị</option>
          <option value="pending">Chờ duyệt</option>
          <option value="rejected">Bị từ chối</option>
        </Form.Select>
      </div>

      {/* Danh sách bài đăng */}
      <Card className="shadow-sm">
        <Card.Body>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Trạng thái</th>
                <th>Ngày đăng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Không có bài đăng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post, idx) => (
                  <tr key={post.id}>
                    <td>{idx + 1}</td>
                    <td>{post.title}</td>
                    <td>
                      <Badge bg={statusLabels[post.status].variant}>
                        {statusLabels[post.status].label}
                      </Badge>
                    </td>
                    <td>{post.date}</td>
                    <td>
                      <Button size="sm" variant="outline-primary">
                        Xem chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <style jsx="true">{`
        .form-select {
          font-size: 0.95rem;
        }
        .card {
          border-radius: 0.35rem;
        }
        th {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default PostStatusFilter;
