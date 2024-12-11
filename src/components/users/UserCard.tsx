import React from 'react';
import { Mail, Building2, Briefcase } from 'lucide-react';
import { User, roleLabels } from '../../types/user';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
          alt={user.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Mail size={16} />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {user.active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Building2 size={16} className="mr-2" />
          <span>{user.center || 'Sin centro asignado'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase size={16} className="mr-2" />
          <span>{user.department || 'Sin departamento'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {roleLabels[user.role]}
        </span>
        <div className="mt-2 text-xs text-gray-500">
          Último acceso: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}
        </div>
      </div>
    </div>
  );
};

export default UserCard;