import { query, transaction } from './connection';
import { hashPassword } from '../utils/auth';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  try {
    // Usuarios de ejemplo
    const users = [
      {
        id: uuidv4(),
        name: 'Administrador',
        email: 'admin@fpinnova.es',
        password: 'admin123',
        role: 'admin',
        center: 'IES Tecnológico',
        department: 'Informática',
        active: true,
      },
      {
        id: uuidv4(),
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        role: 'coordinator',
        center: 'IES Tecnológico',
        department: 'Informática',
        active: true,
      },
      {
        id: uuidv4(),
        name: 'María García',
        email: 'maria@example.com',
        password: 'password123',
        role: 'presenter',
        center: 'IES Innovación',
        department: 'Electrónica',
        active: true,
      },
      {
        id: uuidv4(),
        name: 'Ana Martínez',
        email: 'ana@example.com',
        password: 'password123',
        role: 'reviewer',
        center: 'IES Tecnológico',
        department: 'Robótica',
        active: true,
      },
      {
        id: uuidv4(),
        name: 'Carlos López',
        email: 'carlos@example.com',
        password: 'password123',
        role: 'reviewer',
        center: 'IES Innovación',
        department: 'Mecánica',
        active: true,
      },
    ];

    // Crear convocatoria
    const convocatoriaId = uuidv4();
    await query(`
      INSERT INTO convocatorias (id, title, description, start_date, end_date, status, year, documentation_deadline, review_deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      convocatoriaId,
      'Convocatoria FP Innova 2024',
      'Proyectos de innovación en Formación Profesional para el año académico 2024',
      '2024-03-01',
      '2024-06-30',
      'active',
      2024,
      '2024-05-15',
      '2024-06-15'
    ]);

    // Crear categorías con sus rúbricas
    const categories = [
      {
        id: uuidv4(),
        name: 'Tecnología e Innovación',
        description: 'Proyectos tecnológicos innovadores',
        maxParticipants: 4,
        minCorrections: 2,
        requirements: ['Memoria técnica', 'Presupuesto', 'Video demostrativo'],
        totalBudget: 10000,
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
                  levels: [
                    { id: 'l1', score: 10, description: 'Fácilmente aplicable en múltiples contextos' },
                    { id: 'l2', score: 7, description: 'Aplicable con adaptaciones menores' },
                    { id: 'l3', score: 4, description: 'Aplicable con adaptaciones significativas' },
                    { id: 'l4', score: 1, description: 'Difícilmente aplicable' }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: uuidv4(),
        name: 'Educación Digital',
        description: 'Proyectos de innovación educativa',
        maxParticipants: 4,
        minCorrections: 2,
        requirements: ['Memoria técnica', 'Guía didáctica', 'Demo funcional'],
        totalBudget: 8000,
        rubric: {
          sections: [
            {
              id: 's1',
              name: 'Innovación Pedagógica',
              description: 'Evaluación del enfoque pedagógico y metodológico',
              weight: 35,
              criteria: [
                {
                  id: 'c1',
                  name: 'Metodología innovadora',
                  description: 'Uso de metodologías activas y enfoques pedagógicos innovadores',
                  maxScore: 10,
                  levels: [
                    { id: 'l1', score: 10, description: 'Metodología altamente innovadora y fundamentada' },
                    { id: 'l2', score: 7, description: 'Metodología innovadora con base teórica' },
                    { id: 'l3', score: 4, description: 'Metodología con algunos elementos innovadores' },
                    { id: 'l4', score: 1, description: 'Metodología tradicional sin innovación' }
                  ]
                },
                {
                  id: 'c2',
                  name: 'Personalización del aprendizaje',
                  description: 'Capacidad de adaptación a diferentes ritmos y estilos de aprendizaje',
                  maxScore: 10,
                  levels: [
                    { id: 'l1', score: 10, description: 'Alto grado de personalización y adaptabilidad' },
                    { id: 'l2', score: 7, description: 'Buena capacidad de personalización' },
                    { id: 'l3', score: 4, description: 'Personalización limitada' },
                    { id: 'l4', score: 1, description: 'Sin opciones de personalización' }
                  ]
                }
              ]
            },
            {
              id: 's2',
              name: 'Tecnología Educativa',
              description: 'Evaluación del uso de tecnología en el proceso educativo',
              weight: 35,
              criteria: [
                {
                  id: 'c3',
                  name: 'Integración tecnológica',
                  description: 'Nivel de integración de herramientas digitales',
                  maxScore: 10,
                  levels: [
                    { id: 'l1', score: 10, description: 'Integración tecnológica avanzada y coherente' },
                    { id: 'l2', score: 7, description: 'Buena integración tecnológica' },
                    { id: 'l3', score: 4, description: 'Integración tecnológica básica' },
                    { id: 'l4', score: 1, description: 'Integración tecnológica deficiente' }
                  ]
                },
                {
                  id: 'c4',
                  name: 'Usabilidad y accesibilidad',
                  description: 'Facilidad de uso y accesibilidad para todos los usuarios',
                  maxScore: 10,
                  levels: [
                    { id: 'l1', score: 10, description: 'Excelente usabilidad y totalmente accesible' },
                    { id: 'l2', score: 7, description: 'Buena usabilidad y accesibilidad' },
                    { id: 'l3', score: 4, description: 'Usabilidad y accesibilidad mejorables' },
                    { id: 'l4', score: 1, description: 'Problemas significativos de usabilidad' }
                  ]
                }
              ]
            },
            {
              id: 's3',
              name: 'Impacto Educativo',
              description: 'Evaluación del impacto en el proceso de enseñanza-aprendizaje',
              weight: 30,
              criteria: [
                {
                  id: 'c5',
                  name: 'Mejora del aprendizaje',
                  description: 'Evidencias de mejora en los resultados de aprendizaje',
                  maxScore: 10,
                  levels: [
                    { id: 'l1', score: 10, description: 'Mejora significativa demostrable' },
                    { id: 'l2', score: 7, description: 'Mejora notable' },
                    { id: 'l3', score: 4, description: 'Mejora moderada' },
                    { id: 'l4', score: 1, description: 'Mejora no demostrada' }
                  ]
                },
                {
                  id: 'c6',
                  name: 'Transferibilidad',
                  description: 'Posibilidad de aplicación en otros contextos educativos',
                  maxScore: 10,
                  levels: [
                    { id: 'l1', score: 10, description: 'Altamente transferible a múltiples contextos' },
                    { id: 'l2', score: 7, description: 'Transferible con adaptaciones menores' },
                    { id: 'l3', score: 4, description: 'Transferible con adaptaciones significativas' },
                    { id: 'l4', score: 1, description: 'Difícilmente transferible' }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: uuidv4(),
        name: 'Sostenibilidad',
        description: 'Proyectos enfocados en sostenibilidad y medio ambiente',
        maxParticipants: 4,
        minCorrections: 2,
        requirements: ['Memoria técnica', 'Estudio de impacto ambiental'],
        totalBudget: 12000,
        rubric: {
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
                  levels: [
                    { id: 'l1', score: 10, description: 'Impacto social significativo' },
                    { id: 'l2', score: 7, description: 'Buen impacto social' },
                    { id: 'l3', score: 4, description: 'Impacto social moderado' },
                    { id: 'l4', score: 1, description: 'Impacto social limitado' }
                  ]
                }
              ]
            }
          ]
        }
      }
    ];

    // Save to localStorage
    localStorage.setItem('categories', JSON.stringify(categories));

    console.log('Seed completed successfully');
  } catch (err) {
    console.error('Error during seed:', err);
    throw err;
  }
}

seed().catch(console.error);