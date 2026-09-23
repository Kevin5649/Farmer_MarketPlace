import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/54x54/e8f5eb/2d7a3a?text=🌿';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/farmer/stock')
      .then((res) => setStock(res.data))
      .catch(() => toast.error('Failed to load stock'))
      .finally(() => setLoading(false));
  }, []);

  const totalProducts = stock.length;
  const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);
  const outOfStock = stock.filter((s) => s.quantity === 0).length;
  const inStock = stock.filter((s) => s.quantity > 0).length;

  if (loading) return <Spinner text="Loading dashboard..." />;

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <h2 style={{ color: 'white', marginBottom: '0.3rem' }}>
            🌾 Welcome, {user?.name}!
          </h2>
          <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
            Manage your farm products and stock from here
          </p>
        </div>
        <Link to="/farmer/stock/add" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.5)' }}>
          + Add Stock
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon green">📦</div>
          <div className="stat-info">
            <h3>{totalProducts}</h3>
            <p>Products Listed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🏪</div>
          <div className="stat-info">
            <h3>{inStock}</h3>
            <p>In Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">📊</div>
          <div className="stat-info">
            <h3>{totalStock.toFixed(1)} kg</h3>
            <p>Total Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">⚠️</div>
          <div className="stat-info">
            <h3>{outOfStock}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Recent Stock */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          My Stock Overview
          <Link to="/farmer/stock" className="btn btn-outline btn-sm">Manage All →</Link>
        </div>
        <div className="card-body">
          {stock.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-icon">🌱</div>
              <h3>No stock listed yet</h3>
              <p>Start by adding products you want to sell</p>
              <Link to="/farmer/stock/add" className="btn btn-primary">+ Add Product Stock</Link>
            </div>
          ) : (
            stock.slice(0, 5).map((s) => (
              <div key={s._id} className="stock-card">
                <img
                  src={`http://localhost:5000${s.product?.image}`}
                  alt={s.product?.name}
                  className="stock-card-img"
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                <div className="stock-card-info">
                  <div className="stock-card-name">{s.product?.name}</div>
                  <div className="stock-card-meta">
                    {s.product?.category?.name} • ₹{s.product?.price}/kg
                  </div>
                </div>
                <div className="stock-card-qty">
                  {s.quantity > 0 ? s.quantity.toFixed(1) : (
                    <span style={{ color: 'var(--danger)' }}>0</span>
                  )}
                  <span>kg</span>
                  {s.quantity === 0 && (
                    <span style={{ color: 'var(--danger)', fontSize: '0.7rem' }}>Out of stock</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
