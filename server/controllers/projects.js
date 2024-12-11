import { findAll, findById, create } from '../database/models/Project.js';

export async function getProjects(req, res) {
  const projects = await findAll(req.user.id, req.user.role);
  res.json(projects);
}

export async function getProject(req, res) {
  const project = await findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(project);
}

export async function createProject(req, res) {
  const project = await create({
    ...req.body,
    createdBy: req.user.id
  });
  res.status(201).json(project);
}