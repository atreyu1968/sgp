import { query } from '../connection.js';

export async function findById(id) {
  const [project] = await query(`
    SELECT p.*, c.name as category_name, c.min_corrections, c.total_budget
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, [id]);
  return project;
}

export async function findAll(userId, role) {
  const sql = `
    SELECT p.*, c.name as category_name, c.min_corrections, c.total_budget
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE (p.status != 'draft' OR p.created_by = ?)
    ORDER BY p.updated_at DESC
  `;
  
  const projects = await query(sql, [userId]);
  return projects;
}

export async function create(projectData) {
  const result = await query(`
    INSERT INTO projects (
      title, description, category_id, center, department,
      status, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `, [
    projectData.title,
    projectData.description,
    projectData.categoryId,
    projectData.center,
    projectData.department,
    projectData.status || 'draft',
    projectData.createdBy
  ]);
  
  return result;
}