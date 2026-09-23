import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my')
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner text="Loading orders..." />;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 My Orders</h1>
          <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
        <Link to="/marketplace" className="btn btn-primary btn-sm">🛍️ Shop More</Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link to="/marketplace" className="btn btn-primary">Browse Marketplace</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-completed">✓ COMPLETED</span>
                      <span className="text-muted text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-muted" style={{ marginBottom: '0.5rem' }}>
                      Order ID: <span style={{ fontFamily: 'monospace', color: 'var(--gray-600)' }}>#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {order.items.map((item) => (
                        <span key={item._id} style={{ fontSize: '0.8rem', background: 'var(--primary-bg)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                          {item.productName} × {item.quantity}kg
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="fw-bold" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted">{order.paymentMethod}</div>
                    <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm mt-1">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
