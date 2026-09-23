import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG =
  'https://placehold.co/54x54/e8f5eb/2d7a3a?text=🌿';

const FarmerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/farmer');
      setOrders(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load orders'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <Spinner text="Loading orders..." />;
  }

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 My Orders</h1>
          <p className="page-subtitle">
            Orders containing products supplied by you
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>
            Orders will appear here when customers purchase your stock.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {orders.map((order) => (
            <div className="card" key={order._id}>
              {/* Order Header */}
              <div
                style={{
                  padding: '1.25rem',
                  borderBottom: '1px solid var(--gray-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div className="fw-semibold">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </div>

                  <div
                    className="text-muted text-sm"
                    style={{ marginTop: '0.3rem' }}
                  >
                    Customer: {order.customer?.name || 'Customer'}
                  </div>

                  <div className="text-muted text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="stock-badge in-stock">
                    {order.status}
                  </span>

                  <div
                    className="text-muted text-sm"
                    style={{ marginTop: '0.4rem' }}
                  >
                    Payment: {order.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price/kg</th>
                      <th>Your Quantity</th>
                      <th>Your Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={`${item.product}-${index}`}>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                            }}
                          >
                            <img
                              src={`http://localhost:5000${item.productImage}`}
                              alt={item.productName}
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-sm)',
                              }}
                              onError={(e) => {
                                e.target.src = FALLBACK_IMG;
                              }}
                            />

                            <span className="fw-semibold">
                              {item.productName}
                            </span>
                          </div>
                        </td>

                        <td className="text-primary fw-semibold">
                          ₹{item.pricePerKg}/kg
                        </td>

                        <td>
                          <span className="fw-semibold">
                            {item.quantity.toFixed(1)} kg
                          </span>
                        </td>

                        <td className="text-primary fw-bold">
                          ₹{item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Amount Summary + Details */}
              <div
                style={{
                  padding: '1.25rem',
                  background: 'var(--gray-50)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div className="text-muted text-sm">
                      Total Order Amount
                    </div>

                    <div className="fw-semibold">
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <div className="text-muted text-sm">
                      Your Amount
                    </div>

                    <div
                      className="fw-bold text-primary"
                      style={{ fontSize: '1.1rem' }}
                    >
                      ₹{order.farmerAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/farmer/orders/${order._id}`}
                  className="btn btn-outline btn-sm"
                >
                  👁️ View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerOrdersPage;