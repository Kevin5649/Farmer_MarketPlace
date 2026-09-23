import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/50x50/e8f5eb/2d7a3a?text=🌿';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill in complete delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod,
        deliveryAddress: address,
      };

      const { data } = await API.post('/orders', orderData);
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <Link to="/marketplace" className="btn btn-primary">Browse Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">💳 Checkout</h1>
          <p className="page-subtitle">Review and confirm your order</p>
        </div>
        <Link to="/cart" className="btn btn-secondary btn-sm">← Back to Cart</Link>
      </div>

      <div className="checkout-grid">
        {/* Left: Address + Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Delivery Address */}
          <div className="card">
            <div className="card-header">📍 Delivery Address</div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="street"
                  className="form-control"
                  placeholder="House no, Street name"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="City"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="State"
                    value={address.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card">
            <div className="card-header">💰 Payment Method</div>
            <div className="card-body">
              <div className="payment-options">
                {[
                  { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
                  { value: 'UPI', label: 'UPI Payment', icon: '📱' },
                  { value: 'Card', label: 'Credit / Debit Card', icon: '💳' },
                ].map((opt) => (
                  <div key={opt.value} className="payment-option">
                    <input
                      type="radio"
                      id={opt.value}
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor={opt.value} className="payment-label">
                      <span className="pay-icon">{opt.icon}</span>
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
              {paymentMethod !== 'COD' && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--primary-bg)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--primary)' }}>
                  ℹ️ This is a simulated payment for demo purposes. No real transaction will occur.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="order-summary-card">
            <div className="card-header">🧾 Order Summary</div>
            {cart.map((item) => (
              <div key={item.productId} className="summary-item">
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="summary-item-img"
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                <div style={{ flex: 1 }}>
                  <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{item.name}</div>
                  <div className="text-muted text-sm">{item.quantity} kg × ₹{item.price}</div>
                </div>
                <div className="fw-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="summary-total">
              <span>Total Amount</span>
              <span className="text-primary">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg mt-2"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? '⏳ Placing Order...' : `✅ Place Order · ₹${cartTotal.toFixed(2)}`}
          </button>

          <p className="text-center text-sm text-muted mt-1">
            🔒 Your order will be confirmed immediately
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
