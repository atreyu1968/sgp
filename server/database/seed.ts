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

    // Insertar usuarios
    for (const user of users) {
      await query(`
        INSERT INTO users (id, name, email, password_hash, role, center, department, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user.id,
        user.name,
        user.email,
        hashPassword(user.password),
        user.role,
        user.center,
        user.department,
        user.active
      ]);
    }

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
      },
      {
        id: uuidv4(),
        name: 'Educación Digital',
        description: 'Proyectos de innovación educativa',
        maxParticipants: 4,
        minCorrections: 2,
        requirements: ['Memoria técnica', 'Guía didáctica', 'Demo funcional'],
      },
      {
        id: uuidv4(),
        name: 'Sostenibilidad',
        description: 'Proyectos enfocados en sostenibilidad y medio ambiente',
        maxParticipants: 4,
        minCorrections: 2,
        requirements: ['Memoria técnica', 'Estudio de impacto ambiental'],
      },
    ];

    // Insertar categorías y sus requisitos
    for (const category of categories) {
      await query(`
        INSERT INTO categories (id, convocatoria_id, name, description, max_participants, min_corrections)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        category.id,
        convocatoriaId,
        category.name,
        category.description,
        category.maxParticipants,
        category.minCorrections
      ]);

      // Insertar requisitos
      for (const requirement of category.requirements) {
        await query(`
          INSERT INTO category_requirements (id, category_id, requirement)
          VALUES (?, ?, ?)
        `, [uuidv4(), category.id, requirement]);
      }
    }

    console.log('Seed completed successfully');
  } catch (err) {
    console.error('Error during seed:', err);
    throw err;
  }
}

seed().catch(console.error);