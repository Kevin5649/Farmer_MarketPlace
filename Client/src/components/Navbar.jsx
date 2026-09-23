import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌾</span>
          FarmerMarket
        </Link>

        <div className="navbar-links">
          {!user && (
            <>
              <Link to="/" className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
                Marketplace
              </Link>
              <Link to="/login" className="nav-btn outline">Login</Link>
              <Link to="/register" className="nav-btn filled">Register</Link>
            </>
          )}

          {user?.role === 'customer' && (
            <>
              <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>
                🛍️ Shop
              </Link>
              <Link to="/cart" className={`nav-link ${isActive('/cart') ? 'active' : ''}`}>
                <span className="cart-badge">
                  🛒 Cart
                  {totalItems > 0 && (
                    <span className="badge">{totalItems.toFixed(1)}</span>
                  )}
                </span>
              </Link>
              <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                📦 Orders
              </Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                👤 {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="nav-btn outline">Logout</button>
            </>
          )}

          {user?.role === 'farmer' && (
            <>
              <Link to="/farmer" className={`nav-link ${isActive('/farmer') ? 'active' : ''}`}>
                🌿 My Dashboard
              </Link>
              <Link to="/farmer/stock" className={`nav-link ${isActive('/farmer/stock') ? 'active' : ''}`}>
                📦 My Stock
              </Link>
              <Link
                to="/farmer/profile"
                className={`nav-link ${isActive('/farmer/profile') ? 'active' : ''}`}
                >
                👤 {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="nav-btn outline">Logout</button>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className={`nav-link ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}>
                📊 Dashboard
              </Link>
              <Link to="/admin/products" className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`}>
                🌿 Products
              </Link>
              <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                👥 Users
              </Link>
              <Link to="/admin/orders" className={`nav-link ${isActive('/admin/orders') ? 'active' : ''}`}>
                📦 Orders
              </Link>
              <button onClick={handleLogout} className="nav-btn outline">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
