import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import ProductsPage from './pages/ProductsPage';
import ReelsPage from './pages/ReelsPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('products');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="relative">
      {currentPage === 'products' && <ProductsPage />}
      {currentPage === 'reels' && <ReelsPage />}
      {currentPage === 'upload' && <UploadPage />}
      {currentPage === 'profile' && <ProfilePage />}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
