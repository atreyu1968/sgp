import { utils, writeFile } from 'xlsx';
import { ReportType, ReportFilter, ReportConfig, ReportData } from '../types/report';

// Configuraciones de informes
const reportConfigs: Record<ReportType, ReportConfig> = {
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
};

// Función para obtener datos según el tipo de informe y filtros
async function getReportData(type: ReportType, filters: ReportFilter[]): Promise<ReportData> {
  // TODO: Implementar llamadas a la API para obtener datos según el tipo y filtros
  const mockData = {
    projects: [
      {
        id: '1',
        title: 'Sistema IoT',
        category: 'Tecnología',
        status: 'active',
        center: 'IES Tecnológico',
        department: 'Informática',
        score: 8.5,
        submissionDate: '2024-03-15',
      }
    ],
    users: [
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'admin',
        center: 'IES Tecnológico',
        department: 'Informática',
        active: true,
        lastLogin: '2024-03-15',
      }
    ],
    reviews: [
      {
        id: '1',
        projectId: '1',
        projectTitle: 'Sistema IoT',
        reviewerId: '2',
        reviewerName: 'Ana Martínez',
        score: 8.5,
        status: 'completed',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
      }
    ],
    statistics: [
      {
        metric: 'Proyectos Activos',
        value: 15,
        category: 'Proyectos',
        period: '2024',
      }
    ]
  };

  return {
    columns: reportConfigs[type].columns,
    rows: mockData[type]
  };
}

// Función para generar el archivo Excel
export async function generateExcelReport(type: ReportType, filters: ReportFilter[]): Promise<void> {
  try {
    const config = reportConfigs[type];
    const data = await getReportData(type, filters);

    // Crear libro de trabajo
    const wb = utils.book_new();
    
    // Crear hoja de cálculo
    const ws = utils.json_to_sheet(data.rows, {
      header: config.columns.map(col => col.field)
    });

    // Establecer anchos de columna
    ws['!cols'] = config.columns.map(col => ({ wch: col.width || 15 }));

    // Añadir encabezados personalizados
    utils.sheet_add_aoa(ws, [config.columns.map(col => col.header)], { origin: 'A1' });

    // Añadir hoja al libro
    utils.book_append_sheet(wb, ws, config.sheetName);

    // Generar archivo
    writeFile(wb, `${config.title}_${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel report:', error);
    throw error;
  }
}