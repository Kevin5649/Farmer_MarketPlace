import { useState, useEffect } from 'react';
import API from '../../utils/api';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers');

  const fetchAll = async () => {
    try {
      const [cRes, fRes] = await Promise.all([
        API.get('/admin/customers'),
        API.get('/admin/farmers'),
      ]);
      setCustomers(cRes.data);
      setFarmers(fRes.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const deleteCustomer = async (id, name) => {
    if (!window.confirm(`Delete customer "${name}"? This action cannot be undone.`)) return;
    try {
      await API.delete(`/admin/customers/${id}`);
      toast.success(`${name} deleted`);
      fetchAll();
    } catch {
      toast.error('Failed to delete customer');
    }
  };

  const deleteFarmer = async (id, name) => {
    if (!window.confirm(`Delete farmer "${name}"? This will also remove their stock records.`)) return;
    try {
      await API.delete(`/admin/farmers/${id}`);
      toast.success(`${name} deleted`);
      fetchAll();
    } catch {
      toast.error('Failed to delete farmer');
    }
  };

  if (loading) return <Spinner text="Loading users..." />;

  const renderTable = (users, type) => (
    <div className="card">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>
                  No {type}s found
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: type === 'customer' ? '#faf5ff' : 'var(--primary-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', flexShrink: 0
                    }}>
                      {type === 'customer' ? '🛒' : '🌾'}
                    </div>
                    <span className="fw-semibold">{u.name}</span>
                  </div>
                </td>
                <td className="text-muted">{u.email}</td>
                <td className="text-muted">{u.phone || '—'}</td>
                <td className="text-muted">{u.address?.city || '—'}</td>
                <td className="text-sm text-muted">
                  {new Date(u.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => type === 'customer' ? deleteCustomer(u._id, u.name) : deleteFarmer(u._id, u.name)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2rem', flex: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">👥 User Management</h1>
          <p className="page-subtitle">
            {customers.length} customers · {farmers.length} farmers
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${activeTab === 'customers' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('customers')}
        >
          🛒 Customers ({customers.length})
        </button>
        <button
          className={`btn ${activeTab === 'farmers' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('farmers')}
        >
          🌾 Farmers ({farmers.length})
        </button>
      </div>

      {activeTab === 'customers' ? renderTable(customers, 'customer') : renderTable(farmers, 'farmer')}
    </div>
  );
};

export default AdminUsersPage;
