import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-section">
          <div className="sidebar-section-label">Admin Panel</div>
          <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="icon">👤</span> Profile
          </NavLink>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Catalog</div>
          <NavLink to="/admin/products" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="icon">🌿</span> Products
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="icon">🏷️</span> Categories
          </NavLink>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Users</div>
          <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="icon">👥</span> All Users
          </NavLink>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Orders</div>
          <NavLink to="/admin/orders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="icon">📦</span> All Orders
          </NavLink>
        </div>
      </aside>
      <main className="dashboard-content" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;