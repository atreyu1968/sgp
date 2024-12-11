import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConvocatoriasList from '../components/convocatorias/ConvocatoriasList';
import { Convocatoria } from '../types/convocatoria';

// Mock data - Replace with actual API calls
const mockConvocatorias: Convocatoria[] = [
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
        description: 'Proyectos tecnológicos innovadores que apliquen nuevas tecnologías o metodologías',
        maxParticipants: 4,
        minCorrections: 2,
        requirements: ['Memoria técnica', 'Presupuesto', 'Video demostrativo'],
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
                },
                {
                  id: 'c2',
                  name: 'Aplicación tecnológica',
                  description: 'Uso adecuado y novedoso de la tecnología',
                  maxScore: 10,
                  sectionId: 's1',
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
                  sectionId: 's2',
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
                  sectionId: 's2',
                  levels: [
                    { id: 'l1', score: 10, description: 'Prototipo funcional completo' },
                    { id: 'l2', score: 7, description: 'Prototipo parcialmente funcional' },
                    { id: 'l3', score: 4, description: 'Prototipo básico o mockup' },
                    { id: 'l4', score: 1, description: 'Solo concepto sin prototipo' }
                  ]
                }
              ]
            },
            {
              id: 's3',
              name: 'Impacto y Aplicabilidad',
              description: 'Evaluación del impacto potencial y aplicabilidad real',
              weight: 30,
              criteria: [
                {
                  id: 'c5',
                  name: 'Impacto social/educativo',
                  description: 'Beneficios y mejoras aportadas al ámbito educativo',
                  maxScore: 10,
                  sectionId: 's3',
                  levels: [
                    { id: 'l1', score: 10, description: 'Impacto significativo y demostrable' },
                    { id: 'l2', score: 7, description: 'Impacto positivo considerable' },
                    { id: 'l3', score: 4, description: 'Impacto moderado' },
                    { id: 'l4', score: 1, description: 'Impacto limitado' }
                  ]
                },
                {
                  id: 'c6',
                  name: 'Aplicabilidad práctica',
                  description: 'Facilidad de implementación en entornos reales',
                  maxScore: 10,
                  sectionId: 's3',
                  levels: [
                    { id: 'l1', score: 10, description: 'Fácilmente aplicable en múltiples contextos' },
                    { id: 'l2', score: 7, description: 'Aplicable con adaptaciones menores' },
                    { id: 'l3', score: 4, description: 'Aplicable con adaptaciones significativas' },
                    { id: 'l4', score: 1, description: 'Difícilmente aplicable' }
                  ]
                }
              ]
            }
          ],
          totalScore: 60
        }
      },
      {
        id: '2',
        name: 'Sostenibilidad',
        description: 'Proyectos enfocados en sostenibilidad y medio ambiente',
        maxParticipants: 4,
        minCorrections: 2,
        requirements: ['Memoria técnica', 'Estudio de impacto ambiental'],
        rubric: {
          id: '2',
          sections: [
            {
              id: 's1',
              name: 'Impacto Ambiental',
              description: 'Evaluación del impacto positivo en el medio ambiente',
              weight: 40,
              criteria: [
                {
                  id: 'c1',
                  name: 'Reducción de huella ambiental',
                  description: 'Capacidad del proyecto para reducir el impacto ambiental',
                  maxScore: 10,
                  sectionId: 's1',
                  levels: [
                    { id: 'l1', score: 10, description: 'Reducción significativa y medible' },
                    { id: 'l2', score: 7, description: 'Reducción notable' },
                    { id: 'l3', score: 4, description: 'Reducción moderada' },
                    { id: 'l4', score: 1, description: 'Reducción mínima' }
                  ]
                },
                {
                  id: 'c2',
                  name: 'Eficiencia energética',
                  description: 'Uso eficiente de recursos energéticos',
                  maxScore: 10,
                  sectionId: 's1',
                  levels: [
                    { id: 'l1', score: 10, description: 'Altamente eficiente energéticamente' },
                    { id: 'l2', score: 7, description: 'Buena eficiencia energética' },
                    { id: 'l3', score: 4, description: 'Eficiencia energética moderada' },
                    { id: 'l4', score: 1, description: 'Baja eficiencia energética' }
                  ]
                }
              ]
            },
            {
              id: 's2',
              name: 'Viabilidad y Escalabilidad',
              description: 'Evaluación de la viabilidad y potencial de crecimiento',
              weight: 30,
              criteria: [
                {
                  id: 'c3',
                  name: 'Viabilidad económica',
                  description: 'Sostenibilidad económica del proyecto',
                  maxScore: 10,
                  sectionId: 's2',
                  levels: [
                    { id: 'l1', score: 10, description: 'Modelo económico sólido y sostenible' },
                    { id: 'l2', score: 7, description: 'Modelo económico viable' },
                    { id: 'l3', score: 4, description: 'Viabilidad económica limitada' },
                    { id: 'l4', score: 1, description: 'Viabilidad económica dudosa' }
                  ]
                },
                {
                  id: 'c4',
                  name: 'Potencial de escalabilidad',
                  description: 'Capacidad de crecimiento y replicación',
                  maxScore: 10,
                  sectionId: 's2',
                  levels: [
                    { id: 'l1', score: 10, description: 'Alto potencial de escalabilidad' },
                    { id: 'l2', score: 7, description: 'Buen potencial de escalabilidad' },
                    { id: 'l3', score: 4, description: 'Potencial de escalabilidad limitado' },
                    { id: 'l4', score: 1, description: 'Difícil de escalar' }
                  ]
                }
              ]
            },
            {
              id: 's3',
              name: 'Innovación y Originalidad',
              description: 'Evaluación de aspectos innovadores en sostenibilidad',
              weight: 30,
              criteria: [
                {
                  id: 'c5',
                  name: 'Solución innovadora',
                  description: 'Originalidad de la solución propuesta',
                  maxScore: 10,
                  sectionId: 's3',
                  levels: [
                    { id: 'l1', score: 10, description: 'Solución altamente innovadora' },
                    { id: 'l2', score: 7, description: 'Solución innovadora' },
                    { id: 'l3', score: 4, description: 'Solución parcialmente innovadora' },
                    { id: 'l4', score: 1, description: 'Solución poco innovadora' }
                  ]
                },
                {
                  id: 'c6',
                  name: 'Impacto social',
                  description: 'Beneficios para la comunidad',
                  maxScore: 10,
                  sectionId: 's3',
                  levels: [
                    { id: 'l1', score: 10, description: 'Impacto social significativo' },
                    { id: 'l2', score: 7, description: 'Buen impacto social' },
                    { id: 'l3', score: 4, description: 'Impacto social moderado' },
                    { id: 'l4', score: 1, description: 'Impacto social limitado' }
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
  },
];

const ConvocatoriasPage: React.FC = () => {
  const navigate = useNavigate();

  const handleConvocatoriaClick = (id: string) => {
    navigate(`/convocatorias/edit/${id}`);
  };

  const handleNewConvocatoria = () => {
    navigate('/convocatorias/new');
  };

  return (
    <ConvocatoriasList
      convocatorias={mockConvocatorias}
      onConvocatoriaClick={handleConvocatoriaClick}
      onNewConvocatoria={handleNewConvocatoria}
    />
  );
};

export default ConvocatoriasPage;