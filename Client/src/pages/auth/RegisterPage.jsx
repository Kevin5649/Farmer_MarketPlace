import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    role: 'customer',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // Clear error when user starts correcting the field
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

    if (!form.email.trim()) {
      newErrors.email = 'Email Address is required';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!form.address.trim()) {
      newErrors.address =
        form.role === 'farmer'
          ? 'Farm Address is required'
          : 'Address is required';
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
      const user = await register(
        form.name,
        form.email,
        form.password,
        form.role,
        form.phone,
        form.address,
        form.city,
        form.state,
        form.pincode
      );

      toast.success(
        `Welcome, ${user.name}! Account created successfully.`
      );

      if (user.role === 'farmer') {
        navigate('/farmer');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🌾</span>
          <h1>FarmerMarket</h1>
          <p>Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Role Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">I am a...</label>

            <div className="role-selector">
              <div className="role-option">
                <input
                  type="radio"
                  id="customer"
                  name="role"
                  value="customer"
                  checked={form.role === 'customer'}
                  onChange={handleChange}
                />

                <label htmlFor="customer" className="role-label">
                  <span className="role-icon">🛒</span>
                  Customer
                </label>
              </div>

              <div className="role-option">
                <input
                  type="radio"
                  id="farmer"
                  name="role"
                  value="farmer"
                  checked={form.role === 'farmer'}
                  onChange={handleChange}
                />

                <label htmlFor="farmer" className="role-label">
                  <span className="role-icon">🌾</span>
                  Farmer
                </label>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            {errors.name && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                {errors.name}
              </div>
            )}

            <label className="form-label">Full Name</label>

            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          {/* Email */}
          <div className="form-group">
            {errors.email && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                {errors.email}
              </div>
            )}

            <label className="form-label">Email Address</label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            {errors.password && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                {errors.password}
              </div>
            )}

            <label className="form-label">Password</label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            {errors.confirmPassword && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                {errors.confirmPassword}
              </div>
            )}

            <label className="form-label">Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            {errors.phone && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                {errors.phone}
              </div>
            )}

            <label className="form-label">Phone Number</label>

            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Enter your 10-digit phone number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              inputMode="numeric"
            />
          </div>

          {/* Address */}
          <div className="form-group">
            {errors.address && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                {errors.address}
              </div>
            )}

            <label className="form-label">
              {form.role === 'farmer' ? 'Farm Address' : 'Address'}
            </label>

            <input
              type="text"
              name="address"
              className="form-control"
              placeholder={
                form.role === 'farmer'
                  ? 'Enter your farm address'
                  : 'Enter your address'
              }
              value={form.address}
              onChange={handleChange}
            />
          </div>

          {/* City */}
          <div className="form-group">
            {errors.city && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                {errors.city}
              </div>
            )}

            <label className="form-label">City</label>

            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="Enter your city"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          {/* State */}
          <div className="form-group">
            {errors.state && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                {errors.state}
              </div>
            )}

            <label className="form-label">State</label>

            <input
              type="text"
              name="state"
              className="form-control"
              placeholder="Enter your state"
              value={form.state}
              onChange={handleChange}
            />
          </div>

          {/* Pincode */}
          <div className="form-group">
            {errors.pincode && (
              <div style={{ color: '#dc3545', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                {errors.pincode}
              </div>
            )}

            <label className="form-label">Pincode</label>

            <input
              type="text"
              name="pincode"
              className="form-control"
              placeholder="Enter your 6-digit pincode"
              value={form.pincode}
              onChange={handleChange}
              maxLength={6}
              inputMode="numeric"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading
              ? '⏳ Creating account...'
              : `✅ Register as ${
                  form.role === 'customer' ? 'Customer' : 'Farmer'
                }`}
          </button>
        </form>

        <hr className="divider" />

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary fw-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;