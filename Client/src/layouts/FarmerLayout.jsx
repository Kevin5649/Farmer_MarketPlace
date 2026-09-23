import { Outlet, NavLink } from 'react-router-dom';

const FarmerLayout = () => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-section">
          <div className="sidebar-section-label">Farmer Panel</div>

          <NavLink
            to="/farmer"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="icon">📊</span> Dashboard
          </NavLink>

          <NavLink
            to="/farmer/stock"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="icon">📦</span> My Stock
          </NavLink>

          <NavLink
            to="/farmer/stock/add"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="icon">➕</span> Add Stock
          </NavLink>

          <NavLink
            to="/farmer/orders"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="icon">📋</span> My Orders
          </NavLink>

          <NavLink
            to="/farmer/profile"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="icon">👤</span> My Profile
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Marketplace</div>

          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="icon">🛍️</span> Browse Market
          </NavLink>
        </div>
      </aside>

      <main
        className="dashboard-content"
        style={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default FarmerLayout;