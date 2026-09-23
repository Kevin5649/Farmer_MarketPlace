import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/40x40/e8f5eb/2d7a3a?text=🌿';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner text="Loading dashboard..." />;

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Admin Dashboard</h1>
          <p className="page-subtitle">Farmer Marketplace Overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">🛒</div>
          <div className="stat-info">
            <h3>{stats?.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🌾</div>
          <div className="stat-info">
            <h3>{stats?.totalFarmers}</h3>
            <p>Total Farmers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🌿</div>
          <div className="stat-info">
            <h3>{stats?.totalProducts}</h3>
            <p>Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📦</div>
          <div className="stat-info">
            <h3>{stats?.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-info">
            <h3>₹{stats?.totalRevenue?.toFixed(0) || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/admin/products" className="card" style={{ padding: '1.25rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌿</div>
          <div className="fw-semibold">Manage Products</div>
          <div className="text-sm text-muted">Add, edit, delete products</div>
        </Link>
        <Link to="/admin/categories" className="card" style={{ padding: '1.25rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏷️</div>
          <div className="fw-semibold">Manage Categories</div>
          <div className="text-sm text-muted">Organize product categories</div>
        </Link>
        <Link to="/admin/users" className="card" style={{ padding: '1.25rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
          <div className="fw-semibold">Manage Users</div>
          <div className="text-sm text-muted">View customers & farmers</div>
        </Link>
        <Link to="/admin/orders" className="card" style={{ padding: '1.25rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
          <div className="fw-semibold">View Orders</div>
          <div className="text-sm text-muted">Monitor all orders</div>
        </Link>
      </div>

      {/* Recent Orders */}
      {stats?.recentOrders?.length > 0 && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Recent Orders
            <Link to="/admin/orders" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td>{order.customer?.name}</td>
                    <td className="text-sm text-muted">{order.items?.length} item(s)</td>
                    <td className="fw-bold text-primary">₹{order.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span className="badge badge-completed">{order.paymentMethod}</span>
                    </td>
                    <td className="text-sm text-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
