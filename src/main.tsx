import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ServerStatusProvider } from './context/ServerStatusContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { MasterDataProvider } from './context/MasterDataContext';
import { ConvocatoriasProvider } from './context/ConvocatoriasContext';
import { CategoriesProvider } from './context/CategoriesContext';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <React.StrictMode>
    <ServerStatusProvider>
      <AuthProvider>
        <SettingsProvider>
          <MasterDataProvider>
            <ConvocatoriasProvider>
              <CategoriesProvider>
                <ProjectsProvider>
                  <ReviewsProvider>
                    <App />
                  </ReviewsProvider>
                </ProjectsProvider>
              </CategoriesProvider>
            </ConvocatoriasProvider>
          </MasterDataProvider>
        </SettingsProvider>
      </AuthProvider>
    </ServerStatusProvider>
  </React.StrictMode>
);