import { useState, useEffect } from 'react';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditCat(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditCat(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCat) {
        await API.put(`/categories/${editCat._id}`, form);
        toast.success('Category updated');
      } else {
        await API.post('/categories', form);
        toast.success('Category created');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Cannot delete if products exist.`)) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success(`${name} deleted`);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) return <Spinner text="Loading categories..." />;

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">🏷️ Categories</h1>
          <p className="page-subtitle">{categories.length} categories</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Category</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {categories.map((cat) => (
          <div key={cat._id} className="card">
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="fw-bold" style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>
                    🏷️ {cat.name}
                  </div>
                  {cat.description && (
                    <div className="text-sm text-muted">{cat.description}</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(cat)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id, cat.name)}>🗑️</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏷️</div>
          <h3>No categories yet</h3>
          <button className="btn btn-primary" onClick={openAdd}>Add First Category</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editCat ? '✏️ Edit Category' : '+ Add Category'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} id="cat-form">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button form="cat-form" type="submit" className="btn btn-primary">
                {editCat ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
