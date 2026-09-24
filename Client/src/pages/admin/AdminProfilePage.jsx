import { useEffect, useState } from 'react';
import API from '../../utils/api';

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const { data } = await API.get('/profile/admin');
        setAdmin(data);
      } catch (error) {
        console.error('Failed to fetch admin profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  if (loading) {
    return <div className="container">Loading profile...</div>;
  }

  return (
    <div
      className="container"
      style={{
        padding: '2rem 1.5rem',
        maxWidth: '700px',
      }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">👤 Admin Profile</h1>
          <p className="page-subtitle">
            View your administrator account information
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">👤 Profile Information</div>

        <div className="card-body">
          <div style={{ marginBottom: '1rem' }}>
            <strong>Name:</strong>
            <div>{admin?.name}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong>
            <div>{admin?.email}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Role:</strong>
            <div>{admin?.role}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>Phone:</strong>
            <div>{admin?.phone || 'Not provided'}</div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;