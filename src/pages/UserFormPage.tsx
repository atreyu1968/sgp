import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserForm from '../components/users/UserForm';
import { User } from '../types/user';

// Mock data - Replace with actual API call
const mockUsers: Record<string, User> = {
  '1': {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'admin',
    center: 'IES Tecnológico',
    department: 'Informática',
    active: true,
    createdAt: '2024-01-01',
    lastLogin: '2024-03-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  '2': {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    role: 'coordinator',
    center: 'IES Innovación',
    department: 'Electrónica',
    active: true,
    createdAt: '2024-01-15',
    lastLogin: '2024-03-14',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  '3': {
    id: '3',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    role: 'presenter',
    center: 'IES Tecnológico',
    department: 'Mecánica',
    active: true,
    createdAt: '2024-02-01',
    lastLogin: '2024-03-13',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  '4': {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    role: 'reviewer',
    center: 'IES Innovación',
    department: 'Robótica',
    active: false,
    createdAt: '2024-02-15',
    lastLogin: '2024-03-01',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
};

const UserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const user = id ? mockUsers[id] : undefined;

  const handleSubmit = (data: Partial<User>) => {
    console.log(`${isEditing ? 'Updating' : 'Creating'} user:`, data);
    // TODO: Implement API call
    navigate('/users');
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
      </h1>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default UserFormPage;