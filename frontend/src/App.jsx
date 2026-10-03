import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';

// Layouts
import { ClientLayout } from './layouts/ClientLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public & User Pages
import { HomePage } from './pages/HomePage';
import { MarketsPage } from './pages/MarketsPage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { PortfolioPage } from './pages/PortfolioPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { BuySellPage } from './pages/BuySellPage';
import { HoldingsPage } from './pages/HoldingsPage';

// Admin Pages
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminUsersPage } from './admin/AdminUsersPage';
import { AdminStocksPage } from './admin/AdminStocksPage';
import { AdminTradesPage } from './admin/AdminTradesPage';
import AdminUserInvestmentsPage from './admin/AdminUserInvestmentsPage';
import { AdminTransactionsPage } from './admin/AdminTransactionsPage';
import { AdminNotificationsPage } from './admin/AdminNotificationsPage';
import { AdminAuditLogsPage } from './admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './admin/AdminSettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F172A',
            color: '#F8FAFC',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
      <Routes>
        {/* Client Layout Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Guest Auth Routes */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/trade" element={<BuySellPage />} />
            <Route path="/dashboard/holdings" element={<HoldingsPage />} />
            <Route path="/dashboard/my-shares" element={<HoldingsPage />} />
            <Route path="/dashboard/portfolio" element={<PortfolioPage />} />
            <Route path="/dashboard/markets" element={<MarketsPage />} />
            <Route path="/dashboard/trades" element={<TransactionsPage />} />
            <Route path="/dashboard/transactions" element={<TransactionsPage />} />
            <Route path="/dashboard/watchlist" element={<WatchlistPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin Guest Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Layout Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/stocks" element={<AdminStocksPage />} />
            <Route path="/admin/trades" element={<AdminTradesPage />} />
            <Route path="/admin/user-investments" element={<AdminUserInvestmentsPage />} />
            <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
