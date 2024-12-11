import { ReportType } from '../../types/report';

export const ReportConfig = {
  projects: {
    title: 'Informe de Proyectos',
    sheetName: 'Proyectos',
    columns: [
      { field: 'id', header: 'ID', width: 10 },
      { field: 'title', header: 'Título', width: 40 },
      { field: 'category', header: 'Categoría', width: 20 },
      { field: 'status', header: 'Estado', width: 15 },
      { field: 'center', header: 'Centro', width: 30 },
      { field: 'department', header: 'Departamento', width: 20 },
      { field: 'score', header: 'Puntuación', width: 10 },
      { field: 'submissionDate', header: 'Fecha de Presentación', width: 20 },
    ]
  },
  users: {
    title: 'Informe de Usuarios',
    sheetName: 'Usuarios',
    columns: [
      { field: 'id', header: 'ID', width: 10 },
      { field: 'name', header: 'Nombre', width: 30 },
      { field: 'email', header: 'Email', width: 30 },
      { field: 'role', header: 'Rol', width: 15 },
      { field: 'center', header: 'Centro', width: 30 },
      { field: 'department', header: 'Departamento', width: 20 },
      { field: 'active', header: 'Activo', width: 10 },
      { field: 'lastLogin', header: 'Último Acceso', width: 20 },
    ]
  },
  reviews: {
    title: 'Informe de Revisiones',
    sheetName: 'Revisiones',
    columns: [
      { field: 'id', header: 'ID', width: 10 },
      { field: 'projectId', header: 'ID Proyecto', width: 15 },
      { field: 'projectTitle', header: 'Proyecto', width: 40 },
      { field: 'reviewerId', header: 'ID Revisor', width: 15 },
      { field: 'reviewerName', header: 'Revisor', width: 30 },
      { field: 'score', header: 'Puntuación', width: 10 },
      { field: 'status', header: 'Estado', width: 15 },
      { field: 'createdAt', header: 'Fecha Creación', width: 20 },
      { field: 'updatedAt', header: 'Última Actualización', width: 20 },
    ]
  },
  statistics: {
    title: 'Estadísticas Generales',
    sheetName: 'Estadísticas',
    columns: [
      { field: 'metric', header: 'Métrica', width: 30 },
      { field: 'value', header: 'Valor', width: 20 },
      { field: 'category', header: 'Categoría', width: 20 },
      { field: 'period', header: 'Período', width: 20 },
    ]
  }
} as const;

export const FilterFields = {
  projects: [
    { value: 'category', label: 'Categoría', type: 'select' },
    { value: 'status', label: 'Estado', type: 'select' },
    { value: 'center', label: 'Centro', type: 'select' },
    { value: 'score', label: 'Puntuación', type: 'number' },
    { value: 'submissionDate', label: 'Fecha de Presentación', type: 'date' },
  ],
  users: [
    { value: 'role', label: 'Rol', type: 'select' },
    { value: 'center', label: 'Centro', type: 'select' },
    { value: 'active', label: 'Estado', type: 'select' },
    { value: 'lastLogin', label: 'Último Acceso', type: 'date' },
  ],
  reviews: [
    { value: 'score', label: 'Puntuación', type: 'number' },
    { value: 'status', label: 'Estado', type: 'select' },
    { value: 'reviewer', label: 'Revisor', type: 'select' },
    { value: 'createdAt', label: 'Fecha de Creación', type: 'date' },
  ],
  statistics: [
    { value: 'period', label: 'Período', type: 'select' },
    { value: 'category', label: 'Categoría', type: 'select' },
  ],
} as const;