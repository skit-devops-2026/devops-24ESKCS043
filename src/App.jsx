import React, { useState } from 'react';
import { useVault } from './context/VaultContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import DocumentModal from './components/DocumentModal';

// Views
import LandingView from './views/LandingView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import UserDashboard from './views/UserDashboard';
import ProductsView from './views/ProductsView';
import ProductDetailsView from './views/ProductDetailsView';
import AddProductView from './views/AddProductView';
import ExpiringTrackerView from './views/ExpiringTrackerView';
import ServiceHistoryView from './views/ServiceHistoryView';
import DocumentsVaultView from './views/DocumentsVaultView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';

// Admin Views
import AdminDashboardView from './views/AdminDashboardView';
import AdminUsersView from './views/AdminUsersView';
import AdminProductsView from './views/AdminProductsView';
import AdminCategoriesView from './views/AdminCategoriesView';
import AdminReportsView from './views/AdminReportsView';

export default function App() {
  const { currentView } = useVault();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If public standalone views
  if (currentView === 'landing') {
    return (
      <div className="wv-app">
        <LandingView />
        <ToastContainer />
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="wv-app">
        <LoginView />
        <ToastContainer />
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div className="wv-app">
        <RegisterView />
        <ToastContainer />
      </div>
    );
  }

  // Render view router inside dashboard shell
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <UserDashboard />;
      case 'products':
        return <ProductsView />;
      case 'product-details':
        return <ProductDetailsView />;
      case 'add-product':
        return <AddProductView />;
      case 'expiring':
        return <ExpiringTrackerView />;
      case 'service-history':
        return <ServiceHistoryView />;
      case 'documents':
        return <DocumentsVaultView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;

      // Admin Views
      case 'admin-dashboard':
        return <AdminDashboardView />;
      case 'admin-users':
        return <AdminUsersView />;
      case 'admin-products':
        return <AdminProductsView />;
      case 'admin-categories':
        return <AdminCategoriesView />;
      case 'admin-reports':
        return <AdminReportsView />;

      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="wv-app">
      <div className="wv-dashboard-shell">
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className="wv-main-wrapper">
          <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
          <main style={{ flex: 1 }}>{renderView()}</main>
        </div>
      </div>

      <ToastContainer />
      <DocumentModal />
    </div>
  );
}
