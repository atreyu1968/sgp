import React, { useEffect, useState } from 'react';
import { FileText, Building2, Folder, Star, Calendar, Award, Users, CheckSquare, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Project } from '../types/project';
import { User } from '../types/user';
import { Review } from '../types/review';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalProjects: 0,
    completedReviews: 0,
    pendingReviews: 0,
    reviewProgress: 0,
    projectsByStatus: {} as Record<string, number>,
    projectsByCategory: {} as Record<string, number>,
    recentActivity: [] as Array<{
      action: string;
      user: string;
      time: string;
      details?: string;
    }>,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Cargar datos del localStorage
    const projectsData = localStorage.getItem('projects');
    const usersData = localStorage.getItem('users');
    const reviewsData = localStorage.getItem('project_reviews');

    const projects = projectsData ? JSON.parse(projectsData) as Project[] : [];
    const users = usersData ? JSON.parse(usersData) as User[] : [];
    const reviews = reviewsData ? Object.values(JSON.parse(reviewsData)) as Review[] : [];

    // Calcular estadísticas
    const activeUsers = users.filter(u => u.active).length;
    const totalProjects = projects.length;
    const completedReviews = reviews.filter(r => !r.isDraft).length;
    const pendingReviews = reviews.filter(r => r.isDraft).length;
    const reviewProgress = totalProjects > 0 ? (completedReviews / (totalProjects * 2)) * 100 : 0;

    // Proyectos por estado
    const projectsByStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Proyectos por categoría
    const projectsByCategory = projects.reduce((acc, project) => {
      if (project.category?.name) {
        acc[project.category.name] = (acc[project.category.name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Actividad reciente
    const recentActivity = [
      ...reviews.map(review => ({
        action: review.isDraft ? 'Borrador de revisión guardado' : 'Revisión completada',
        user: review.reviewerName,
        time: new Date(review.updatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        details: `Proyecto #${review.projectId}`,
      })),
      ...projects.map(project => ({
        action: 'Proyecto actualizado',
        user: project.presenters?.[0] || 'Usuario',
        time: new Date(project.lastModified || '').toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        details: project.title,
      })),
    ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

    setStats({
      activeUsers,
      totalProjects,
      completedReviews,
      pendingReviews,
      reviewProgress,
      projectsByStatus,
      projectsByCategory,
      recentActivity,
    });
  };

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Usuarios Activos</p>
              <p className="text-2xl font-semibold mt-1">{stats.activeUsers}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Proyectos Totales</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalProjects}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <FileText className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <span>{stats.pendingReviews} pendientes de revisión</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Revisiones Completadas</p>
              <p className="text-2xl font-semibold mt-1">{stats.completedReviews}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckSquare className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>{stats.reviewProgress.toFixed(0)}% completado</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Proyectos por Revisar</p>
              <p className="text-2xl font-semibold mt-1">{stats.pendingReviews}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Settings className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">por {activity.user}</p>
                  {activity.details && (
                    <p className="text-xs text-gray-400">{activity.details}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Proyectos</h3>
          <div className="space-y-4">
            {Object.entries(stats.projectsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {status === 'draft' ? 'Borrador' :
                   status === 'submitted' ? 'Presentado' :
                   status === 'reviewing' ? 'En revisión' :
                   status === 'reviewed' ? 'Revisado' :
                   status === 'approved' ? 'Aprobado' :
                   'Rechazado'}
                </span>
                <span className="text-sm font-semibold text-blue-600">{count}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Proyectos por Categoría</h3>
          <div className="space-y-4">
            {Object.entries(stats.projectsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-sm font-semibold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderGuestDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Proyectos Activos</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalProjects}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <Calendar size={16} className="mr-1" />
            <span>Convocatoria actual</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Categorías</p>
              <p className="text-2xl font-semibold mt-1">{Object.keys(stats.projectsByCategory).length}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Folder className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <Award size={16} className="mr-1" />
            <span>Diferentes áreas</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Revisiones Completadas</p>
              <p className="text-2xl font-semibold mt-1">{stats.completedReviews}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <CheckSquare className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <span>{stats.reviewProgress.toFixed(0)}% completado</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Proyectos</h3>
          <div className="space-y-4">
            {Object.entries(stats.projectsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {status === 'draft' ? 'Borrador' :
                   status === 'submitted' ? 'Presentado' :
                   status === 'reviewing' ? 'En revisión' :
                   status === 'reviewed' ? 'Revisado' :
                   status === 'approved' ? 'Aprobado' :
                   'Rechazado'}
                </span>
                <span className="text-sm font-semibold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyectos por Categoría</h3>
          <div className="space-y-4">
            {Object.entries(stats.projectsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-sm font-semibold text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderPresenterDashboard = () => (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mis Proyectos</h3>
        <div className="space-y-4">
          {/* TODO: Filtrar proyectos por presentador actual */}
          <p className="text-gray-500">Panel del presentador en construcción</p>
        </div>
      </div>
    </div>
  );

  const renderReviewerDashboard = () => (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mis Revisiones</h3>
        <div className="space-y-4">
          {/* TODO: Filtrar revisiones por revisor actual */}
          <p className="text-gray-500">Panel del revisor en construcción</p>
        </div>
      </div>
    </div>
  );

  const renderCoordinatorDashboard = () => (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Panel de Coordinación</h3>
        <div className="space-y-4">
          {/* TODO: Mostrar estadísticas específicas del coordinador */}
          <p className="text-gray-500">Panel del coordinador en construcción</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        {user?.role === 'admin' && 'Panel de Administración'}
        {user?.role === 'coordinator' && 'Panel de Coordinación'}
        {user?.role === 'presenter' && 'Mis Proyectos'}
        {user?.role === 'reviewer' && 'Panel de Revisión'}
        {user?.role === 'guest' && 'Panel de Visualización'}
      </h1>

      {user?.role === 'admin' && renderAdminDashboard()}
      {user?.role === 'coordinator' && renderCoordinatorDashboard()}
      {user?.role === 'presenter' && renderPresenterDashboard()}
      {user?.role === 'reviewer' && renderReviewerDashboard()}
      {user?.role === 'guest' && renderGuestDashboard()}
    </div>
  );
};

export default Dashboard;