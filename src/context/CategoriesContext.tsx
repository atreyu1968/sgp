import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category } from '../types/convocatoria';
import { v4 as uuidv4 } from 'uuid';

interface CategoriesContextType {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

// Initial categories
const initialCategories: Category[] = [
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
];

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(initialCategories);
      localStorage.setItem('categories', JSON.stringify(initialCategories));
    }
  }, []);

  const addCategory = (category: Category) => {
    const updatedCategories = [...categories, { ...category, id: uuidv4() }];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const updateCategory = (id: string, categoryUpdate: Partial<Category>) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, ...categoryUpdate } : category
    );
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  return (
    <CategoriesContext.Provider value={{
      categories,
      setCategories,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};