import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ClientMenu from './components/ClientMenu';
import ClientCart from './components/ClientCart';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const { currentView, isLoggedIn } = useApp();

  switch (currentView) {
    case 'menu':
      return <ClientMenu />;
    case 'cart':
      return <ClientCart />;
    case 'admin-login':
      return <AdminLogin />;
    case 'admin':
      return isLoggedIn ? <AdminPanel /> : <AdminLogin />;
    default:
      return <ClientMenu />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
