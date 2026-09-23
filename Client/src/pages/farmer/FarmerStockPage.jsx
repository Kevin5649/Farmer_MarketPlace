import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/54x54/e8f5eb/2d7a3a?text=🌿';

const FarmerStockPage = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState('');

  const fetchStock = async () => {
    try {
      const { data } = await API.get('/farmer/stock');
      setStock(data);
    } catch {
      toast.error('Failed to load stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStock(); }, []);

  const handleEditSave = async (stockId) => {
    const qty = parseFloat(editQty);
    if (isNaN(qty) || qty < 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    try {
      await API.put(`/farmer/stock/${stockId}`, { quantity: qty });
      toast.success('Stock updated');
      setEditingId(null);
      fetchStock();
    } catch {
      toast.error('Failed to update stock');
    }
  };

  const handleRemove = async (stockId, productName) => {
    if (!window.confirm(`Remove ${productName} from your stock?`)) return;
    try {
      await API.delete(`/farmer/stock/${stockId}`);
      toast.success(`${productName} removed`);
      fetchStock();
    } catch {
      toast.error('Failed to remove stock');
    }
  };

  if (loading) return <Spinner text="Loading stock..." />;

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 My Stock</h1>
          <p className="page-subtitle">{stock.length} product{stock.length !== 1 ? 's' : ''} listed</p>
        </div>
        <Link to="/farmer/stock/add" className="btn btn-primary">+ Add Stock</Link>
      </div>

      {stock.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3>No products in stock</h3>
          <p>Add products from the catalog to start selling</p>
          <Link to="/farmer/stock/add" className="btn btn-primary">+ Add Product Stock</Link>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock (kg)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={`http://localhost:5000${s.product?.image}`}
                          alt={s.product?.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                          onError={(e) => { e.target.src = FALLBACK_IMG; }}
                        />
                        <span className="fw-semibold">{s.product?.name}</span>
                      </div>
                    </td>
                    <td className="text-muted text-sm">{s.product?.category?.name}</td>
                    <td className="text-primary fw-semibold">₹{s.product?.price}/kg</td>
                    <td>
                      {editingId === s._id ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="number"
                            className="form-control"
                            style={{ width: '90px', padding: '0.35rem 0.6rem' }}
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            min="0"
                            step="0.5"
                            autoFocus
                          />
                          <button className="btn btn-primary btn-sm" onClick={() => handleEditSave(s._id)}>✓</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>✕</button>
                        </div>
                      ) : (
                        <span className="fw-bold" style={{ color: s.quantity === 0 ? 'var(--danger)' : 'var(--gray-800)' }}>
                          {s.quantity.toFixed(1)} kg
                        </span>
                      )}
                    </td>
                    <td>
                      {s.quantity > 0 ? (
                        <span className="stock-badge in-stock">In Stock</span>
                      ) : (
                        <span className="stock-badge out-of-stock">Out of Stock</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => { setEditingId(s._id); setEditQty(s.quantity.toString()); }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemove(s._id, s.product?.name)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerStockPage;
