import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/60x60/e8f5eb/2d7a3a?text=🌿';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/admin/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner text="Loading order..." />;
  if (!order) return <div className="container" style={{ padding: '2rem' }}>Order not found</div>;

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/orders" className="btn btn-secondary btn-sm">← Back to Orders</Link>
      </div>

      <div className="order-detail-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.7rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '700' }}>
                ✓ COMPLETED
              </span>
            </div>
            <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>
              Order #{order._id.slice(-8).toUpperCase()}
            </h2>
            <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p style={{ opacity: 0.85, fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Customer: <strong>{order.customer?.name}</strong> ({order.customer?.email})
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>₹{order.totalAmount.toFixed(2)}</div>
            <div style={{ opacity: 0.85 }}>{order.paymentMethod}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        {/* Items + Allocations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header">🛒 Ordered Items</div>
            <div className="card-body">
              {order.items.map((item) => (
                <div key={item._id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--gray-100)' }}>
                  <div className="order-item-row">
                    <img
                      src={`http://localhost:5000${item.productImage}`}
                      alt={item.productName}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0 }}
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                    <div style={{ flex: 1 }}>
                      <div className="fw-semibold">{item.productName}</div>
                      <div className="text-sm text-muted">{item.quantity} kg × ₹{item.pricePerKg}/kg</div>
                    </div>
                    <div className="fw-bold text-primary">₹{item.subtotal.toFixed(2)}</div>
                  </div>

                  {/* FCFS Allocations */}
                  {item.farmerAllocations?.length > 0 && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--primary-bg)', borderRadius: 'var(--radius)', fontSize: '0.82rem' }}>
                      <div className="fw-semibold text-primary mb-1" style={{ marginBottom: '0.4rem' }}>
                        🌾 FCFS Farmer Allocation:
                      </div>
                      {item.farmerAllocations.map((alloc, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0' }}>
                          <span className="text-muted">{alloc.farmerName}</span>
                          <span className="fw-semibold">{alloc.quantity} kg</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.05rem' }}>
                <span>Total</span>
                <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="card-header">📍 Delivery Address</div>
            <div className="card-body text-sm">
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
              <p>Pincode: {order.deliveryAddress.pincode}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-header">💰 Payment</div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {order.paymentMethod === 'COD' ? '💵' : order.paymentMethod === 'UPI' ? '📱' : '💳'}
                </span>
                <div>
                  <div className="fw-semibold">{order.paymentMethod}</div>
                  <span className="badge badge-completed">Payment Successful</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
