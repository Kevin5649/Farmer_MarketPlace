import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FarmerProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!form.street.trim()) {
      newErrors.street = 'Farm Street Address is required';
    }

    if (!form.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!form.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!form.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      });

      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="page-title">👤 My Profile</h1>
          <p className="page-subtitle">
            Manage your farmer account information
          </p>
        </div>
      </div>

      {/* Farmer Info */}
      <div
        className="card mb-3"
        style={{ marginBottom: '1.5rem' }}
      >
        <div
          className="card-body"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--primary-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              flexShrink: 0,
            }}
          >
            🌾
          </div>

          <div>
            <div
              className="fw-bold"
              style={{ fontSize: '1.1rem' }}
            >
              {user?.name}
            </div>

            <div className="text-muted text-sm">
              {user?.email}
            </div>

            <span
              className="badge badge-farmer"
              style={{ marginTop: '0.3rem' }}
            >
              Farmer
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="card">
        <div className="card-header">✏️ Edit Profile</div>

        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              {/* Full Name */}
              <div className="form-group">
                {errors.name && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '0.8rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {errors.name}
                  </div>
                )}

                <label className="form-label">Full Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                {errors.phone && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '0.8rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {errors.phone}
                  </div>
                )}

                <label className="form-label">Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="9999999999"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>
            </div>

            <hr className="divider" />

            <h4
              style={{
                marginBottom: '1rem',
                fontSize: '0.95rem',
                color: 'var(--gray-700)',
              }}
            >
              📍 Farm Address
            </h4>

            {/* Farm Street Address */}
            <div className="form-group">
              {errors.street && (
                <div
                  style={{
                    color: '#dc3545',
                    fontSize: '0.8rem',
                    marginBottom: '0.35rem',
                  }}
                >
                  {errors.street}
                </div>
              )}

              <label className="form-label">
                Farm Street Address
              </label>

              <input
                type="text"
                name="street"
                className="form-control"
                placeholder="Farm address, village, street name"
                value={form.street}
                onChange={handleChange}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              {/* City */}
              <div className="form-group">
                {errors.city && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '0.8rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {errors.city}
                  </div>
                )}

                <label className="form-label">City</label>

                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>

              {/* State */}
              <div className="form-group">
                {errors.state && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '0.8rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {errors.state}
                  </div>
                )}

                <label className="form-label">State</label>

                <input
                  type="text"
                  name="state"
                  className="form-control"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Pincode */}
            <div className="form-group">
              {errors.pincode && (
                <div
                  style={{
                    color: '#dc3545',
                    fontSize: '0.8rem',
                    marginBottom: '0.35rem',
                  }}
                >
                  {errors.pincode}
                </div>
              )}

              <label className="form-label">Pincode</label>

              <input
                type="text"
                name="pincode"
                className="form-control"
                placeholder="400001"
                value={form.pincode}
                onChange={handleChange}
                maxLength={6}
                inputMode="numeric"
                style={{ maxWidth: '200px' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Saving...' : '💾 Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfilePage;