import { query } from './connection';

async function migrate() {
  try {
    // Usuarios
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'coordinator', 'presenter', 'reviewer', 'guest')) NOT NULL,
        center TEXT,
        department TEXT,
        avatar TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      );
    `);

    // Convocatorias
    await query(`
      CREATE TABLE IF NOT EXISTS convocatorias (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status TEXT CHECK(status IN ('draft', 'active', 'closed', 'archived')) NOT NULL,
        year INTEGER NOT NULL,
        documentation_deadline DATE NOT NULL,
        review_deadline DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Categorías
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        convocatoria_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        max_participants INTEGER NOT NULL DEFAULT 4,
        min_corrections INTEGER NOT NULL DEFAULT 2,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (convocatoria_id) REFERENCES convocatorias(id) ON DELETE CASCADE
      );
    `);

    // Requisitos de categorías
    await query(`
      CREATE TABLE IF NOT EXISTS category_requirements (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        requirement TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);

    // Rúbricas
    await query(`
      CREATE TABLE IF NOT EXISTS rubrics (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        total_score INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);

    // Secciones de rúbricas
    await query(`
      CREATE TABLE IF NOT EXISTS rubric_sections (
        id TEXT PRIMARY KEY,
        rubric_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        weight INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rubric_id) REFERENCES rubrics(id) ON DELETE CASCADE
      );
    `);

    // Criterios de evaluación
    await query(`
      CREATE TABLE IF NOT EXISTS rubric_criteria (
        id TEXT PRIMARY KEY,
        section_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        max_score INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES rubric_sections(id) ON DELETE CASCADE
      );
    `);

    // Niveles de evaluación
    await query(`
      CREATE TABLE IF NOT EXISTS rubric_levels (
        id TEXT PRIMARY KEY,
        criterion_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (criterion_id) REFERENCES rubric_criteria(id) ON DELETE CASCADE
      );
    `);

    // Proyectos
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category_id TEXT NOT NULL,
        center TEXT NOT NULL,
        department TEXT NOT NULL,
        status TEXT CHECK(status IN ('draft', 'submitted', 'reviewing', 'approved', 'rejected', 'needs_changes')) NOT NULL,
        submission_date DATETIME,
        score REAL,
        convocatoria_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (convocatoria_id) REFERENCES convocatorias(id)
      );
    `);

    // Presentadores de proyectos
    await query(`
      CREATE TABLE IF NOT EXISTS project_presenters (
        project_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (project_id, user_id),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Revisores de proyectos
    await query(`
      CREATE TABLE IF NOT EXISTS project_reviewers (
        project_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (project_id, user_id),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Correcciones de proyectos
    await query(`
      CREATE TABLE IF NOT EXISTS project_reviews (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        reviewer_id TEXT NOT NULL,
        score REAL,
        general_observations TEXT,
        is_draft INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewer_id) REFERENCES users(id),
        UNIQUE (project_id, reviewer_id)
      );
    `);

    // Puntuaciones por criterio
    await query(`
      CREATE TABLE IF NOT EXISTS review_scores (
        id TEXT PRIMARY KEY,
        review_id TEXT NOT NULL,
        criterion_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (review_id) REFERENCES project_reviews(id) ON DELETE CASCADE,
        FOREIGN KEY (criterion_id) REFERENCES rubric_criteria(id),
        UNIQUE (review_id, criterion_id)
      );
    `);

    // Documentos de proyectos
    await query(`
      CREATE TABLE IF NOT EXISTS project_documents (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        url TEXT NOT NULL,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);

    // Configuración del sistema
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Error during migration:', err);
    throw err;
  }
}

migrate().catch(console.error);