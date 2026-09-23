import { useState, useEffect } from 'react';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://placehold.co/44x44/e8f5eb/2d7a3a?text=🌿';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', description: '', image: '' });

  const fetchAll = async () => {
    try {
      const [pRes, cRes] = await Promise.all([API.get('/products'), API.get('/categories')]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: '', category: '', price: '', description: '', image: '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      category: p.category?._id || '',
      price: p.price,
      description: p.description || '',
      image: p.image || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      toast.error('Name, category and price are required');
      return;
    }
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        image: form.image || `/images/${form.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      };
      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated');
      } else {
        await API.post('/products', payload);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This will also remove all farmer stock records.`)) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success(`${name} deleted`);
      fetchAll();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <Spinner text="Loading products..." />;

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">🌿 Product Catalog</h1>
          <p className="page-subtitle">{products.length} products in catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price (₹/kg)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={`http://localhost:5000${p.image}`}
                        alt={p.name}
                        style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        onError={(e) => { e.target.src = FALLBACK_IMG; }}
                      />
                      <div>
                        <div className="fw-semibold">{p.name}</div>
                        <div className="text-sm text-muted" style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted">{p.category?.name}</td>
                  <td className="fw-bold text-primary">₹{p.price}</td>
                  <td>
                    <span className={`stock-badge ${p.isActive ? 'in-stock' : 'out-of-stock'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editProduct ? '✏️ Edit Product' : '+ Add Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} id="product-form">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price per kg (₹) *</label>
                  <input type="number" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} min="0" step="0.5" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Image path (e.g. /images/tomato.jpg)</label>
                  <input type="text" className="form-control" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder={`/images/${form.name.toLowerCase().replace(/\s+/g, '-') || 'product'}.jpg`} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button form="product-form" type="submit" className="btn btn-primary">
                {editProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
