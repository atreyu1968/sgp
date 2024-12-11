import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  EducationalCenter, 
  ProfessionalFamily, 
  EducationalCycle,
  Course,
  Specialty 
} from '../types/master';

interface MasterDataContextType {
  centers: EducationalCenter[];
  families: ProfessionalFamily[];
  cycles: EducationalCycle[];
  courses: Course[];
  specialties: Specialty[];
  getActiveSpecialties: () => Specialty[];
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

// Initial mock data
const initialData = {
  centers: [
    {
      id: uuidv4(),
      code: 'IES001',
      name: 'IES Tecnológico',
      address: 'Calle Principal 1',
      city: 'Las Palmas',
      province: 'Las Palmas',
      phone: '928123456',
      email: 'info@iestec.es',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  families: [
    {
      id: uuidv4(),
      code: 'INF',
      name: 'Informática y Comunicaciones',
      description: 'Familia profesional de informática',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  cycles: [
    {
      id: uuidv4(),
      code: 'DAW',
      name: 'Desarrollo de Aplicaciones Web',
      familyId: '1',
      level: 'higher',
      duration: 2000,
      description: 'Ciclo formativo de grado superior',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  courses: [
    {
      id: uuidv4(),
      code: 'DAW1',
      name: 'Primero DAW',
      cycleId: '1',
      year: 1,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  specialties: [
    {
      id: uuidv4(),
      code: 'INF',
      name: 'Informática',
      familyId: '1',
      description: 'Especialidad de Informática',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [centers, setCenters] = useState<EducationalCenter[]>([]);
  const [families, setFamilies] = useState<ProfessionalFamily[]>([]);
  const [cycles, setCycles] = useState<EducationalCycle[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const loadData = (key: string, initialValue: any[]) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    };

    setCenters(loadData('centers', initialData.centers));
    setFamilies(loadData('families', initialData.families));
    setCycles(loadData('cycles', initialData.cycles));
    setCourses(loadData('courses', initialData.courses));
    setSpecialties(loadData('specialties', initialData.specialties));
  }, []);

  const getActiveSpecialties = () => {
    return specialties.filter(specialty => specialty.active);
  };

  return (
    <MasterDataContext.Provider value={{
      centers,
      families,
      cycles,
      courses,
      specialties,
      getActiveSpecialties
    }}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  if (context === undefined) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
};