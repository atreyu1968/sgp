import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ServerStatusProvider } from './context/ServerStatusContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { MasterDataProvider } from './context/MasterDataContext';
import { ConvocatoriasProvider } from './context/ConvocatoriasContext';
import { CategoriesProvider } from './context/CategoriesContext';
import { useAuth } from './hooks/useAuth';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './components/Dashboard';
import ConvocatoriasPage from './pages/ConvocatoriasPage';
import ConvocatoriaFormPage from './pages/ConvocatoriaFormPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';
import SettingsPage from './pages/SettingsPage';
import SystemSettingsPage from './pages/SystemSettingsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CodeVerificationPage from './pages/CodeVerificationPage';
import InvalidCodePage from './pages/InvalidCodePage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import MasterDataPage from './pages/MasterDataPage';
import ReportsPage from './pages/ReportsPage';
import ReviewsPage from './pages/ReviewsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="h-screen">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ServerStatusProvider>
      <AuthProvider>
        <SettingsProvider>
          <MasterDataProvider>
            <ConvocatoriasProvider>
              <CategoriesProvider>
                <ProjectsProvider>
                  <ReviewsProvider>
                    <Router>
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/verify" element={<CodeVerificationPage />} />
                        <Route path="/invalid-code" element={<InvalidCodePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        
                        {/* Protected routes */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/convocatorias" element={<ProtectedRoute><ConvocatoriasPage /></ProtectedRoute>} />
                        <Route path="/convocatorias/new" element={<ProtectedRoute><ConvocatoriaFormPage /></ProtectedRoute>} />
                        <Route path="/convocatorias/edit/:id" element={<ProtectedRoute><ConvocatoriaFormPage /></ProtectedRoute>} />
                        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
                        <Route path="/projects/new" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
                        <Route path="/projects/edit/:id" element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} />
                        <Route path="/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
                        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
                        <Route path="/users/new" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
                        <Route path="/users/edit/:id" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                        <Route path="/system-settings" element={<ProtectedRoute><SystemSettingsPage /></ProtectedRoute>} />
                        <Route path="/master-data" element={<ProtectedRoute><MasterDataPage /></ProtectedRoute>} />
                        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />

                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Router>
                  </ReviewsProvider>
                </ProjectsProvider>
              </CategoriesProvider>
            </ConvocatoriasProvider>
          </MasterDataProvider>
        </SettingsProvider>
      </AuthProvider>
    </ServerStatusProvider>
  );
};

export default App;