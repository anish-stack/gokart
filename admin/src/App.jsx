import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import ServicesPage from './pages/ServicesPage';
import ProductsPage from './pages/ProductsPage';
import ArticlesPage from './pages/ArticlesPage';
import CmsPage from './pages/CmsPage';
import ContactAreasPage from './pages/ContactAreasPage';
import ContactSubmissionsPage from './pages/ContactSubmissionsPage';
import NotificationLogsPage from './pages/NotificationLogsPage';
import AppConfigPage from './pages/AppConfigPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="shipments" element={<ShipmentsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="cms" element={<CmsPage />} />
            <Route path="contact-areas" element={<ContactAreasPage />} />
            <Route path="contact-submissions" element={<ContactSubmissionsPage />} />
            <Route path="notification-logs" element={<NotificationLogsPage />} />
            <Route path="config" element={<AppConfigPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}