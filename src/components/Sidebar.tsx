import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  CheckSquare, 
  Users, 
  Settings,
  Calendar,
  Sliders,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { canView } = usePermissions();

  const menuItems = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Inicio",
      show: true
    },
    {
      to: "/convocatorias",
      icon: Calendar,
      label: "Convocatorias",
      show: canView('convocatorias')
    },
    {
      to: "/projects",
      icon: FileText,
      label: "Proyectos",
      show: canView('projects')
    },
    {
      to: "/reviews",
      icon: CheckSquare,
      label: "Revisiones",
      show: canView('reviews')
    },
    {
      to: "/users",
      icon: Users,
      label: "Usuarios",
      show: canView('users')
    },
    {
      to: "/reports",
      icon: FileSpreadsheet,
      label: "Informes",
      show: canView('reports')
    },
    {
      to: "/master-data",
      icon: Database,
      label: "Datos Maestros",
      show: canView('system')
    },
    {
      to: "/settings",
      icon: Settings,
      label: "Mi Cuenta",
      show: true
    },
    {
      to: "/system-settings",
      icon: Sliders,
      label: "Configuración",
      show: canView('system')
    }
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-gray-800 flex flex-col h-full">
      <nav className="flex-1 px-4 pt-6 space-y-2">
        {menuItems
          .filter(item => item.show)
          .map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          <p>Versión 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;