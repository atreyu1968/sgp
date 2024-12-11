import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';
import SearchResults from './search/SearchResults';

const Header = () => {
  const { settings } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Mock data - Replace with API call
  const activeConvocatoria = {
    title: "Convocatoria FP Innova 2024",
    startDate: "2024-03-01",
    endDate: "2024-06-30"
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(query.length > 0);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Pequeño delay para permitir que se pueda hacer clic en los resultados
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  return (
    <header className="h-16 bg-header text-white px-6 flex items-center justify-between relative z-50">
      <div className="flex items-center space-x-8">
        {settings?.appearance?.branding?.logo && (
          <img 
            src={settings.appearance.branding.logo} 
            alt="Logo" 
            className="h-10 brightness-0 invert"
          />
        )}
        <h1 className="text-xl font-bold">
          {settings?.appearance?.branding?.appName}
        </h1>

        {/* Active Convocatoria */}
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-blue-300 mr-2" />
          <div>
            <p className="text-sm font-medium">{activeConvocatoria.title}</p>
            <p className="text-xs text-blue-300">
              {new Date(activeConvocatoria.startDate).toLocaleDateString('es-ES')} - {new Date(activeConvocatoria.endDate).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>

        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar proyectos, usuarios o documentos..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showResults && (
            <SearchResults query={searchQuery} />
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 hover:bg-blue-800 rounded-full">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="font-medium">{user?.name}</div>
            <div className="text-sm text-blue-300">{user?.role === 'admin' ? 'Administrador' : user?.role}</div>
          </div>
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}`}
            alt="Avatar del usuario"
            className="w-10 h-10 rounded-full border-2 border-blue-700"
          />
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 hover:bg-blue-800 rounded-lg transition-colors ml-4"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;