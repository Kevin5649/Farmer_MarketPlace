import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer pages
import MarketplacePage from './pages/customer/MarketplacePage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import ProfilePage from './pages/customer/ProfilePage';

// Farmer pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerStockPage from './pages/farmer/FarmerStockPage';
import AddStockPage from './pages/farmer/AddStockPage';
import FarmerOrdersPage from './pages/farmer/FarmerOrdersPage';
import FarmerOrderDetailPage from './pages/farmer/FarmerOrderDetailPage';
import FarmerProfilePage from './pages/farmer/FarmerProfilePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';

// Farmer layout wrapper
import FarmerLayout from './layouts/FarmerLayout';
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
              },
            }}
          />

          <div className="page-wrapper">
            <Navbar />

            <div className="main-content" style={{ padding: 0 }}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/marketplace" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />

                {/* Customer routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Farmer routes */}
                <Route
                  path="/farmer"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<FarmerDashboard />} />
                  <Route path="stock" element={<FarmerStockPage />} />
                  <Route path="stock/add" element={<AddStockPage />} />
                  <Route path="orders" element={<FarmerOrdersPage />} />
                  <Route path="orders/:id" element={<FarmerOrderDetailPage />} />
                  <Route path="profile" element={<FarmerProfilePage />} />
                </Route>

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                </Route>

                {/* Catch all */}
                <Route
                  path="*"
                  element={<Navigate to="/marketplace" replace />}
                />
              </Routes>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;