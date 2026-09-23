import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/60x60/e8f5eb/2d7a3a?text=🌿';

const AddStockPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setProductsLoading(false));
  }, []);

  const selectedProductData = products.find((p) => p._id === selectedProduct);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    setLoading(true);
    try {
      await API.post('/farmer/stock', { productId: selectedProduct, quantity: qty });
      toast.success('Stock added successfully!');
      navigate('/farmer/stock');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', flex: 1, maxWidth: '600px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">+ Add Stock</h1>
          <p className="page-subtitle">Select a product and add your available quantity</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Product</label>
              {productsLoading ? (
                <p className="text-muted text-sm">Loading products...</p>
              ) : (
                <select
                  className="form-select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="">-- Choose a product --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.category?.name}) — ₹{p.price}/kg
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Product Preview */}
            {selectedProductData && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem', background: 'var(--primary-bg)',
                borderRadius: 'var(--radius)', marginBottom: '1rem',
                border: '1px solid var(--primary)'
              }}>
                <img
                  src={`http://localhost:5000${selectedProductData.image}`}
                  alt={selectedProductData.name}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                <div>
                  <div className="fw-bold text-primary">{selectedProductData.name}</div>
                  <div className="text-sm text-muted">{selectedProductData.category?.name}</div>
                  <div className="fw-semibold" style={{ color: 'var(--primary)' }}>
                    ₹{selectedProductData.price}/kg (Admin-set price)
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Quantity to Add (kg)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0.5"
                step="0.5"
                required
              />
              <p className="text-sm text-muted" style={{ marginTop: '0.3rem' }}>
                ℹ️ If you already have this product in stock, the quantity will be added to existing stock.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Adding...' : '✅ Add Stock'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/farmer/stock')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStockPage;
