import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../types/project';
import { v4 as uuidv4 } from 'uuid';

interface ProjectsContextType {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

// Initial mock data
const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Sistema de Monitorización IoT',
    description: 'Sistema de monitorización ambiental utilizando sensores IoT y análisis de datos en tiempo real.',
    category: {
      id: '1',
      name: 'Tecnología e Innovación',
      minCorrections: 2,
      totalBudget: 10000,
      requirements: ['Memoria técnica', 'Presupuesto', 'Video demostrativo'],
      rubric: {
        sections: [
          {
            id: 's1',
            name: 'Innovación y Originalidad',
            description: 'Evaluación del grado de innovación y originalidad del proyecto',
            weight: 30,
            criteria: [
              {
                id: 'c1',
                name: 'Originalidad de la propuesta',
                description: 'Grado de originalidad y diferenciación respecto a soluciones existentes',
                maxScore: 10,
                levels: [
                  { id: 'l1', score: 10, description: 'Propuesta altamente innovadora y única' },
                  { id: 'l2', score: 7, description: 'Propuesta innovadora con elementos diferenciadores' },
                  { id: 'l3', score: 4, description: 'Propuesta con algunos elementos innovadores' },
                  { id: 'l4', score: 1, description: 'Propuesta poco innovadora' }
                ]
              },
              {
                id: 'c2',
                name: 'Aplicación tecnológica',
                description: 'Uso adecuado y novedoso de la tecnología',
                maxScore: 10,
                levels: [
                  { id: 'l1', score: 10, description: 'Uso excepcional y novedoso de la tecnología' },
                  { id: 'l2', score: 7, description: 'Buen uso de la tecnología' },
                  { id: 'l3', score: 4, description: 'Uso básico de la tecnología' },
                  { id: 'l4', score: 1, description: 'Uso limitado de la tecnología' }
                ]
              }
            ]
          },
          {
            id: 's2',
            name: 'Viabilidad y Desarrollo',
            description: 'Evaluación de la viabilidad técnica y nivel de desarrollo',
            weight: 40,
            criteria: [
              {
                id: 'c3',
                name: 'Viabilidad técnica',
                description: 'Factibilidad de implementación y recursos necesarios',
                maxScore: 10,
                levels: [
                  { id: 'l1', score: 10, description: 'Proyecto completamente viable y bien planificado' },
                  { id: 'l2', score: 7, description: 'Proyecto viable con algunos desafíos menores' },
                  { id: 'l3', score: 4, description: 'Proyecto viable pero con desafíos significativos' },
                  { id: 'l4', score: 1, description: 'Proyecto con dudosa viabilidad' }
                ]
              },
              {
                id: 'c4',
                name: 'Nivel de desarrollo',
                description: 'Estado actual del desarrollo y prototipado',
                maxScore: 10,
                levels: [
                  { id: 'l1', score: 10, description: 'Prototipo funcional completo' },
                  { id: 'l2', score: 7, description: 'Prototipo parcialmente funcional' },
                  { id: 'l3', score: 4, description: 'Prototipo básico o mockup' },
                  { id: 'l4', score: 1, description: 'Solo concepto sin prototipo' }
                ]
              }
            ]
          }
        ]
      }
    },
    center: 'IES Tecnológico',
    department: 'Informática',
    status: 'reviewing',
    submissionDate: '2024-03-01',
    lastModified: '2024-03-15',
    presenters: ['1', '2'],
    reviewers: ['3'],
    score: 8.5,
    documents: [
      {
        id: '1',
        name: 'Memoria Técnica',
        type: 'pdf',
        url: '/documents/memoria.pdf',
        uploadDate: '2024-03-01',
        status: 'approved'
      }
    ],
    convocatoriaId: '1',
    mainResponsible: {
      name: 'Juan Pérez',
      dni: '12345678A',
      phone: '666777888',
      specialty: 'Informática'
    },
    collaborators: [],
    requestedAmount: 8000
  }
];

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      setProjects(initialProjects);
      localStorage.setItem('projects', JSON.stringify(initialProjects));
    }
  }, []);

  const addProject = (project: Project) => {
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const updateProject = (id: string, projectUpdate: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, ...projectUpdate } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectsContext.Provider value={{
      projects,
      setProjects,
      addProject,
      updateProject,
      deleteProject,
      getProjectById
    }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};