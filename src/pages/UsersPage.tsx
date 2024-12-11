import React from 'react';
import { useNavigate } from 'react-router-dom';
import UsersList from '../components/users/UsersList';
import { User } from '../types/user';

// Mock data - Replace with actual API call
const mockUsers: User[] = [
  {
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
  {
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
  {
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
  {
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
  {
    id: '5',
    name: 'Visitante',
    email: 'visitante@example.com',
    role: 'guest',
    center: 'Público General',
    department: 'N/A',
    active: true,
    createdAt: '2024-03-15',
    lastLogin: '2024-03-15',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const UsersPage: React.FC = () => {
  const navigate = useNavigate();

  const handleUserClick = (id: string) => {
    navigate(`/users/edit/${id}`);
  };

  const handleNewUser = () => {
    navigate('/users/new');
  };

  return <UsersList users={mockUsers} onUserClick={handleUserClick} onNewUser={handleNewUser} />;
};

export default UsersPage;