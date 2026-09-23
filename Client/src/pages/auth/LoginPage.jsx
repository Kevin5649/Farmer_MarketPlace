import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);

      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'farmer') {
        navigate('/farmer');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors({
        ...errors,
        email: '',
      });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (errors.password) {
      setErrors({
        ...errors,
        password: '',
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🌾</span>
          <h1>FarmerMarket</h1>
          <p>Welcome back! Please login to continue</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            {errors.email && (
              <div
                style={{
                  color: '#dc3545',
                  fontSize: '0.8rem',
                  marginBottom: '0.35rem',
                }}
              >
                {errors.email}
              </div>
            )}

            <label className="form-label">Email Address</label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="form-group">
            {errors.password && (
              <div
                style={{
                  color: '#dc3545',
                  fontSize: '0.8rem',
                  marginBottom: '0.35rem',
                }}
              >
                {errors.password}
              </div>
            )}

            <label className="form-label">Password</label>

            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🔑 Login'}
          </button>
        </form>

        <hr className="divider" />

        <p className="text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary fw-semibold">
            Register here
          </Link>
        </p>

        {/* <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius)',
            fontSize: '0.78rem',
            color: 'var(--gray-500)',
          }}
        >
          <strong>Demo Accounts:</strong>
          <br />
          🔐 Admin: admin@farmermarket.com / admin123
          <br />
          🌾 Farmer: ramesh@farmer.com / farmer123
          <br />
          🛒 Customer: priya@customer.com / customer123
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;