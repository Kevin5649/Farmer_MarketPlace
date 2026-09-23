import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/60x60/e8f5eb/2d7a3a?text=🌿';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner text="Loading order..." />;
  if (!order) return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="empty-state">
        <div className="empty-icon">❌</div>
        <h3>Order not found</h3>
        <Link to="/orders" className="btn btn-primary">Back to Orders</Link>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div className="order-detail-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '700' }}>
                ✓ ORDER COMPLETED
              </span>
            </div>
            <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>
              Order #{order._id.slice(-8).toUpperCase()}
            </h2>
            <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{order.totalAmount.toFixed(2)}</div>
            <div style={{ opacity: 0.85, fontSize: '0.9rem' }}>Total Amount</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Items */}
        <div className="card">
          <div className="card-header">🛒 Ordered Items</div>
          <div className="card-body">
            {order.items.map((item) => (
              <div key={item._id} className="order-item-row">
                <img
                  src={`http://localhost:5000${item.productImage}`}
                  alt={item.productName}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius)', background: 'var(--gray-100)', flexShrink: 0 }}
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                <div style={{ flex: 1 }}>
                  <div className="fw-semibold">{item.productName}</div>
                  <div className="text-sm text-muted">
                    {item.quantity} kg × ₹{item.pricePerKg}/kg
                  </div>
                </div>
                <div className="fw-bold text-primary">₹{item.subtotal.toFixed(2)}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.05rem', padding: '1rem 0 0', borderTop: '2px solid var(--gray-200)', marginTop: '0.5rem' }}>
              <span>Total</span>
              <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Delivery */}
          <div className="card">
            <div className="card-header">📍 Delivery Address</div>
            <div className="card-body text-sm">
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
              <p>Pincode: {order.deliveryAddress.pincode}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <div className="card-header">💰 Payment</div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {order.paymentMethod === 'COD' ? '💵' : order.paymentMethod === 'UPI' ? '📱' : '💳'}
                </span>
                <div>
                  <div className="fw-semibold">{order.paymentMethod}</div>
                  <div className="text-sm text-muted">Payment Successful</div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="card">
            <div className="card-header">📋 Status</div>
            <div className="card-body">
              <span className="badge badge-completed" style={{ fontSize: '0.875rem', padding: '0.4rem 0.9rem' }}>
                ✓ COMPLETED
              </span>
              <p className="text-sm text-muted mt-1">
                Your order has been confirmed and is being processed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/orders" className="btn btn-secondary">← Back to Orders</Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;
