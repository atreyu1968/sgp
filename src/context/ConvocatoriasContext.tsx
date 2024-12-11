import React, { createContext, useContext, useState, useEffect } from 'react';
import { Convocatoria, Category, RubricSection } from '../types/convocatoria';
import { v4 as uuidv4 } from 'uuid';

interface ConvocatoriasContextType {
  convocatorias: Convocatoria[];
  setConvocatorias: (convocatorias: Convocatoria[]) => void;
  addConvocatoria: (convocatoria: Convocatoria) => void;
  updateConvocatoria: (id: string, convocatoria: Partial<Convocatoria>) => void;
  deleteConvocatoria: (id: string) => void;
  addCategory: (convocatoriaId: string, category: Category) => void;
  updateCategory: (convocatoriaId: string, categoryId: string, category: Partial<Category>) => void;
  deleteCategory: (convocatoriaId: string, categoryId: string) => void;
  updateRubric: (convocatoriaId: string, categoryId: string, sections: RubricSection[]) => void;
}

const ConvocatoriasContext = createContext<ConvocatoriasContextType | undefined>(undefined);

// Initial mock data
const initialConvocatorias: Convocatoria[] = [
  {
    id: '1',
    title: 'Convocatoria FP Innova 2024',
    description: 'Proyectos de innovación en Formación Profesional para el año académico 2024.',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    status: 'active',
    year: 2024,
    documentationDeadline: '2024-05-15',
    reviewDeadline: '2024-06-15',
    categories: [
      {
        id: '1',
        name: 'Tecnología e Innovación',
        description: 'Proyectos tecnológicos innovadores',
        maxParticipants: 4,
        minCorrections: 2,
        requirements: ['Memoria técnica', 'Presupuesto', 'Video demostrativo'],
        cutoffScore: 7,
        totalBudget: 10000,
        rubric: {
          id: '1',
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
                  sectionId: 's1',
                  levels: [
                    { id: 'l1', score: 10, description: 'Propuesta altamente innovadora y única' },
                    { id: 'l2', score: 7, description: 'Propuesta innovadora con elementos diferenciadores' },
                    { id: 'l3', score: 4, description: 'Propuesta con algunos elementos innovadores' },
                    { id: 'l4', score: 1, description: 'Propuesta poco innovadora' }
                  ]
                }
              ]
            }
          ],
          totalScore: 60
        }
      }
    ],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  }
];

export const ConvocatoriasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);

  useEffect(() => {
    const storedConvocatorias = localStorage.getItem('convocatorias');
    if (storedConvocatorias) {
      setConvocatorias(JSON.parse(storedConvocatorias));
    } else {
      setConvocatorias(initialConvocatorias);
      localStorage.setItem('convocatorias', JSON.stringify(initialConvocatorias));
    }
  }, []);

  const addConvocatoria = (convocatoria: Convocatoria) => {
    const updatedConvocatorias = [...convocatorias, { ...convocatoria, id: uuidv4() }];
    setConvocatorias(updatedConvocatorias);
    localStorage.setItem('convocatorias', JSON.stringify(updatedConvocatorias));
  };

  const updateConvocatoria = (id: string, convocatoriaUpdate: Partial<Convocatoria>) => {
    const updatedConvocatorias = convocatorias.map(convocatoria =>
      convocatoria.id === id ? { ...convocatoria, ...convocatoriaUpdate } : convocatoria
    );
    setConvocatorias(updatedConvocatorias);
    localStorage.setItem('convocatorias', JSON.stringify(updatedConvocatorias));
  };

  const deleteConvocatoria = (id: string) => {
    const updatedConvocatorias = convocatorias.filter(convocatoria => convocatoria.id !== id);
    setConvocatorias(updatedConvocatorias);
    localStorage.setItem('convocatorias', JSON.stringify(updatedConvocatorias));
  };

  const addCategory = (convocatoriaId: string, category: Category) => {
    const updatedConvocatorias = convocatorias.map(convocatoria => {
      if (convocatoria.id === convocatoriaId) {
        return {
          ...convocatoria,
          categories: [...convocatoria.categories, { ...category, id: uuidv4() }]
        };
      }
      return convocatoria;
    });
    setConvocatorias(updatedConvocatorias);
    localStorage.setItem('convocatorias', JSON.stringify(updatedConvocatorias));
  };

  const updateCategory = (convocatoriaId: string, categoryId: string, categoryUpdate: Partial<Category>) => {
    const updatedConvocatorias = convocatorias.map(convocatoria => {
      if (convocatoria.id === convocatoriaId) {
        return {
          ...convocatoria,
          categories: convocatoria.categories.map(category =>
            category.id === categoryId ? { ...category, ...categoryUpdate } : category
          )
        };
      }
      return convocatoria;
    });
    setConvocatorias(updatedConvocatorias);
    localStorage.setItem('convocatorias', JSON.stringify(updatedConvocatorias));
  };

  const deleteCategory = (convocatoriaId: string, categoryId: string) => {
    const updatedConvocatorias = convocatorias.map(convocatoria => {
      if (convocatoria.id === convocatoriaId) {
        return {
          ...convocatoria,
          categories: convocatoria.categories.filter(category => category.id !== categoryId)
        };
      }
      return convocatoria;
    });
    setConvocatorias(updatedConvocatorias);
    localStorage.setItem('convocatorias', JSON.stringify(updatedConvocatorias));
  };

  const updateRubric = (convocatoriaId: string, categoryId: string, sections: RubricSection[]) => {
    const updatedConvocatorias = convocatorias.map(convocatoria => {
      if (convocatoria.id === convocatoriaId) {
        return {
          ...convocatoria,
          categories: convocatoria.categories.map(category => {
            if (category.id === categoryId) {
              return {
                ...category,
                rubric: {
                  ...category.rubric,
                  sections,
                  totalScore: sections.reduce((total, section) => 
                    total + section.criteria.reduce((sum, criterion) => sum + criterion.maxScore, 0), 0
                  )
                }
              };
            }
            return category;
          })
        };
      }
      return convocatoria;
    });
    setConvocatorias(updatedConvocatorias);
    localStorage.setItem('convocatorias', JSON.stringify(updatedConvocatorias));
  };

  return (
    <ConvocatoriasContext.Provider value={{
      convocatorias,
      setConvocatorias,
      addConvocatoria,
      updateConvocatoria,
      deleteConvocatoria,
      addCategory,
      updateCategory,
      deleteCategory,
      updateRubric
    }}>
      {children}
    </ConvocatoriasContext.Provider>
  );
};

export const useConvocatorias = () => {
  const context = useContext(ConvocatoriasContext);
  if (context === undefined) {
    throw new Error('useConvocatorias must be used within a ConvocatoriasProvider');
  }
  return context;
};