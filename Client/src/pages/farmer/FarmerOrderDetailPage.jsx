import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG =
  'https://placehold.co/60x60/e8f5eb/2d7a3a?text=🌿';

const FarmerOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/farmer/${id}`)
      .then((res) => setOrder(res.data))
      .catch((error) => {
        toast.error(
          error.response?.data?.message || 'Failed to load order'
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Spinner text="Loading order..." />;
  }

  if (!order) {
    return (
      <div style={{ padding: '3rem 1.5rem' }}>
        <div className="empty-state">
          <div className="empty-icon">❌</div>
          <h3>Order not found</h3>
          <Link to="/farmer/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      {/* Header */}
      <div className="order-detail-header">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                }}
              >
                ✓ ORDER COMPLETED
              </span>
            </div>

            <h2 style={{ color: 'white', marginBottom: '0.25rem' }}>
              Order #{order._id.slice(-8).toUpperCase()}
            </h2>

            <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: '800',
              }}
            >
              ₹{order.farmerAmount.toFixed(2)}
            </div>

            <div
              style={{
                opacity: 0.85,
                fontSize: '0.9rem',
              }}
            >
              Your Amount
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '1.5rem',
        }}
      >
        {/* Farmer's supplied items */}
        <div className="card">
          <div className="card-header">
            📦 Products You Supplied
          </div>

          <div className="card-body">
            {order.items.map((item) => (
              <div
                key={item.product}
                className="order-item-row"
              >
                <img
                  src={`http://localhost:5000${item.productImage}`}
                  alt={item.productName}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius)',
                    background: 'var(--gray-100)',
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMG;
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div className="fw-semibold">
                    {item.productName}
                  </div>

                  <div className="text-sm text-muted">
                    {item.quantity.toFixed(1)} kg × ₹
                    {item.pricePerKg}/kg
                  </div>
                </div>

                <div className="fw-bold text-primary">
                  ₹{item.amount.toFixed(2)}
                </div>
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '800',
                fontSize: '1.05rem',
                padding: '1rem 0 0',
                borderTop: '2px solid var(--gray-200)',
                marginTop: '0.5rem',
              }}
            >
              <span>Your Total</span>
              <span className="text-primary">
                ₹{order.farmerAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Information cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Customer */}
          <div className="card">
            <div className="card-header">
              👤 Customer
            </div>

            <div className="card-body">
              <div className="fw-semibold">
                {order.customer?.name || 'Customer'}
              </div>

              <div className="text-sm text-muted">
                {order.customer?.email || ''}
              </div>
            </div>
          </div>

          {/* Order total */}
          <div className="card">
            <div className="card-header">
              💰 Order Amount
            </div>

            <div className="card-body">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
                <span className="text-muted">
                  Total Order Amount
                </span>

                <span className="fw-semibold">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span className="text-muted">
                  Your Amount
                </span>

                <span className="fw-bold text-primary">
                  ₹{order.farmerAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <div className="card-header">
              💳 Payment
            </div>

            <div className="card-body">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>
                  {order.paymentMethod === 'COD'
                    ? '💵'
                    : order.paymentMethod === 'UPI'
                    ? '📱'
                    : '💳'}
                </span>

                <div>
                  <div className="fw-semibold">
                    {order.paymentMethod}
                  </div>

                  <div className="text-sm text-muted">
                    Payment Successful
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="card">
            <div className="card-header">
              📋 Status
            </div>

            <div className="card-body">
              <span
                className="badge badge-completed"
                style={{
                  fontSize: '0.875rem',
                  padding: '0.4rem 0.9rem',
                }}
              >
                ✓ COMPLETED
              </span>

              <p className="text-sm text-muted mt-1">
                This order has been completed successfully.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div style={{ marginTop: '1.5rem' }}>
        <Link
          to="/farmer/orders"
          className="btn btn-secondary"
        >
          ← Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default FarmerOrderDetailPage;