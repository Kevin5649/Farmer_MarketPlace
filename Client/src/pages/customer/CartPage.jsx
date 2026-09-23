import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/80x80/e8f5eb/2d7a3a?text=🌿';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const adjustQty = (item, delta) => {
    const newQty = Math.round((item.quantity + delta) * 10) / 10;
    if (newQty < 0.5) {
      removeFromCart(item.productId);
      return;
    }
    if (newQty > item.availableQuantity) {
      toast.error(`Only ${item.availableQuantity} kg available`);
      return;
    }
    updateQuantity(item.productId, newQty);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some fresh produce from the marketplace</p>
          <Link to="/marketplace" className="btn btn-primary">
            🛍️ Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">🛒 Shopping Cart</h1>
          <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={clearCart}>
          🗑️ Clear Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        {/* Cart Items */}
        <div className="card">
          <div className="card-body">
            {cart.map((item) => (
              <div key={item.productId} className="cart-item">
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                <div>
                  <div className="fw-semibold" style={{ color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                    {item.name}
                  </div>
                  <div className="text-sm text-muted">₹{item.price}/kg</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => adjustQty(item, -0.5)}>−</button>
                      <span className="qty-value">{item.quantity} kg</span>
                      <button className="qty-btn" onClick={() => adjustQty(item, 0.5)}>+</button>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="fw-bold" style={{ color: 'var(--primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="card">
          <div className="card-header">Order Summary</div>
          <div className="card-body">
            {cart.map((item) => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span className="text-muted">{item.name} × {item.quantity}kg</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.1rem' }}>
              <span>Total</span>
              <span className="text-primary">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
              💳 Proceed to Checkout
            </button>
            <Link to="/marketplace" className="btn btn-secondary btn-full mt-1" style={{ textAlign: 'center' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
