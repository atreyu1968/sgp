import React, { useState } from 'react';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import UserCard from './UserCard';
import UserTable from './UserTable';
import { User, UserRole } from '../../types/user';
import { useViewMode } from '../../hooks/useViewMode';

interface UsersListProps {
  users: User[];
  onUserClick: (id: string) => void;
  onNewUser: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, onUserClick, onNewUser }) => {
  const { viewMode, changeViewMode } = useViewMode('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState<boolean | 'all'>('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesActive =
      activeFilter === 'all' || user.active === activeFilter;
    return matchesSearch && matchesRole && matchesActive;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <button
          onClick={onNewUser}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="coordinator">Coordinador</option>
            <option value="presenter">Presentador</option>
            <option value="reviewer">Revisor</option>
            <option value="guest">Invitado</option>
          </select>

          <select
            value={String(activeFilter)}
            onChange={(e) => setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>

          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => changeViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Vista en cuadrícula"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => changeViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Vista en lista"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() => onUserClick(user.id)}
            />
          ))}
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          onUserClick={onUserClick}
        />
      )}
    </div>
  );
};

export default UsersList;