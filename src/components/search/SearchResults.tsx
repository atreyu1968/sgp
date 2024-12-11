import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, File } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

interface SearchResultsProps {
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const navigate = useNavigate();
  const { canView } = usePermissions();

  // Mock data - Replace with API call
  const mockData = {
    projects: [
      { id: '1', title: 'Sistema de Monitorización IoT', category: 'Tecnología' },
      { id: '2', title: 'Plataforma de Aprendizaje', category: 'Educación' },
    ],
    users: [
      { id: '1', name: 'Juan Pérez', role: 'Presentador' },
      { id: '2', name: 'María García', role: 'Revisor' },
    ],
    documents: [
      { id: '1', name: 'Memoria Técnica.pdf', project: 'Sistema IoT' },
      { id: '2', name: 'Presupuesto.xlsx', project: 'Plataforma Educativa' },
    ],
  };

  // Filter results based on query
  const results = {
    projects: mockData.projects.filter(project => 
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.category.toLowerCase().includes(query.toLowerCase())
    ),
    users: mockData.users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase())
    ),
    documents: mockData.documents.filter(doc => 
      doc.name.toLowerCase().includes(query.toLowerCase()) ||
      doc.project.toLowerCase().includes(query.toLowerCase())
    ),
  };

  const handleProjectClick = (id: string) => {
    navigate(`/projects/${id}`);
  };

  const handleUserClick = (id: string) => {
    navigate(`/users/${id}`);
  };

  const handleDocumentClick = (id: string) => {
    // TODO: Implement document preview/download
    console.log('Open document:', id);
  };

  const hasResults = results.projects.length > 0 || 
                    results.users.length > 0 || 
                    results.documents.length > 0;

  return (
    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        {/* Projects */}
        {canView('projects') && results.projects.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Proyectos</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {results.projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left"
                >
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{project.title}</p>
                    <p className="text-xs text-gray-500">{project.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {canView('users') && results.users.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Usuarios</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {results.users.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left"
                >
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {results.documents.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Documentos</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {results.documents.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc.id)}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left"
                >
                  <File className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.project}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {!hasResults && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-gray-500">No se encontraron resultados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;