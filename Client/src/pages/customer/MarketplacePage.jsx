import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/400x300/e8f5eb/2d7a3a?text=Product';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (product, quantity) => {
    if (!user) {
      toast.error('Please login to add items to your cart');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can add items to the cart');
      return;
    }

    addToCart(product, quantity);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products'),
          API.get('/categories'),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory ? p.category?._id === selectedCategory : true;
    return matchSearch && matchCat;
  });

  if (loading) return <Spinner text="Loading marketplace..." />;

  return (
    <div>
      <div className="hero">
        <h1>🌾 Fresh From the Farm</h1>
        <p>Buy fresh vegetables, fruits, grains & pulses directly from local farmers at fair prices.</p>
      </div>

      <div className="container">
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ maxWidth: '200px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button
              className={`btn btn-sm ${selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`btn btn-sm ${selectedCategory === cat._id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <p className="text-muted text-sm mb-2">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setSelectedCategory(''); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  const [qty, setQty] = useState(0.5);
  const inStock = product.availableQuantity > 0;

  const adjustQty = (delta) => {
    const newQty = Math.round((qty + delta) * 10) / 10;
    if (newQty >= 0.5 && newQty <= product.availableQuantity) setQty(newQty);
  };

  const imgSrc = `http://localhost:5000${product.image}`;

  return (
    <div className="product-card">
      <img
        src={imgSrc}
        alt={product.name}
        className="product-card-img"
        onError={(e) => { e.target.src = FALLBACK_IMG; }}
      />
      <div className="product-card-body">
        <div className="product-card-category">{product.category?.name}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-desc">{product.description}</div>

        <div style={{ marginBottom: '0.75rem' }}>
          {inStock ? (
            <span className="stock-badge in-stock">✓ {product.availableQuantity} kg available</span>
          ) : (
            <span className="stock-badge out-of-stock">✗ Out of Stock</span>
          )}
        </div>

        <div className="product-card-footer">
          <div>
            <div className="product-price">₹{product.price}<span>/kg</span></div>
          </div>
        </div>

        {inStock && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span className="text-sm text-muted">Qty:</span>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => adjustQty(-0.5)} disabled={qty <= 0.5}>−</button>
                <span className="qty-value">{qty} kg</span>
                <button className="qty-btn" onClick={() => adjustQty(0.5)} disabled={qty >= product.availableQuantity}>+</button>
              </div>
            </div>
            <button
              className="btn btn-primary btn-full btn-sm"
              onClick={() => onAddToCart(product, qty)}
            >
              🛒 Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;