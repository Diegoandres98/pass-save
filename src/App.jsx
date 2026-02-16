import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VaultProvider, useVault } from './context/VaultContext';
import LoginPage from './components/Auth/LoginPage';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Header from './components/Layout/Header';
import VaultUnlock from './components/Vault/VaultUnlock';
import PasswordList from './components/Vault/PasswordList';
import ContactList from './components/Contacts/ContactList';
import PersonList from './components/People/PersonList';

function VaultGate() {
  const { isUnlocked, loading } = useVault();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-gray-950">
        <div className="text-gray-400">Cargando bóveda...</div>
      </div>
    );
  }

  if (!isUnlocked) return <VaultUnlock />;

  const section = location.pathname;

  if (section === '/contacts') return <ContactList />;
  if (section === '/people') return <PersonList />;
  return <PasswordList />;
}

function Dashboard() {
  return (
    <VaultProvider>
      <div className="min-h-screen bg-gray-950">
        <Header />
        <VaultGate />
      </div>
    </VaultProvider>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/people"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
