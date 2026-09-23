import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/orders')
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner text="Loading orders..." />;

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 All Orders</h1>
          <p className="page-subtitle">{orders.length} total orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Farmer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const farmers = [
                    ...new Set(
                      order.items?.flatMap((item) =>
                        item.farmerAllocations?.map((allocation) => allocation.farmerName) || []
                      )
                    ),
                  ];

                  return (
                    <tr key={order._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      <td>
                        <div className="fw-semibold">{order.customer?.name}</div>
                        <div className="text-sm text-muted">{order.customer?.email}</div>
                      </td>

                      <td>
                        <div className="text-sm">
                          {farmers.length > 0 ? (
                            farmers.map((farmerName, index) => (
                              <div key={index} className="fw-semibold">
                                🌾 {farmerName}
                              </div>
                            ))
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="text-sm">
                          {order.items.map((item) => (
                            <div key={item._id} style={{ color: 'var(--gray-600)' }}>
                              {item.productName} × {item.quantity}kg
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="fw-bold text-primary">₹{order.totalAmount.toFixed(2)}</td>

                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {order.paymentMethod === 'COD'
                            ? '💵'
                            : order.paymentMethod === 'UPI'
                            ? '📱'
                            : '💳'}
                          {' '}{order.paymentMethod}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-completed">✓ COMPLETED</span>
                      </td>

                      <td className="text-sm text-muted">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      <td>
                        <Link to={`/admin/orders/${order._id}`} className="btn btn-outline btn-sm">
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;