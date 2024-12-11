import { utils, write } from 'xlsx';
import { MasterDataType, ImportResult } from '../types/master';

// Configuraciones de informes
const reportConfigs: Record<MasterDataType, string[]> = {
  centers: ['code', 'name', 'address', 'city', 'province', 'phone', 'email'],
  families: ['code', 'name', 'description'],
  cycles: ['code', 'name', 'familyId', 'level', 'duration', 'description'],
  courses: ['code', 'name', 'cycleId', 'year']
};

// Fix the generateTemplate function to use write instead of utils.write
export const generateTemplate = (type: MasterDataType): Blob => {
  const wb = utils.book_new();
  const ws = utils.aoa_to_sheet([reportConfigs[type]]);
  utils.book_append_sheet(wb, ws, 'Template');
  
  // Add validation sheet if needed
  if (type === 'cycles' || type === 'courses') {
    const validationWs = utils.aoa_to_sheet([
      ['Valores válidos:'],
      type === 'cycles' ? 
        ['level: basic, medium, higher'] :
        ['year: 1, 2']
    ]);
    utils.book_append_sheet(wb, validationWs, 'Validation');
  }

  // Generate buffer and create blob using write instead of utils.write
  const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

// Rest of the file remains unchanged
export const importData = async (
  type: MasterDataType,
  file: File,
  userId: string,
  userName: string
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    totalRows: 0,
    successCount: 0,
    errorCount: 0,
    errors: []
  };

  try {
    const data = await file.arrayBuffer();
    const workbook = read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = utils.sheet_to_json(worksheet, { header: 1 });

    // Skip header row
    const dataRows = rows.slice(1) as any[];
    result.totalRows = dataRows.length;

    for (let i = 0; i < dataRows.length; i++) {
      try {
        const row = dataRows[i];
        const template = reportConfigs[type];
        const rowData = template.reduce((acc, field, index) => {
          acc[field] = row[index];
          return acc;
        }, {} as any);

        // TODO: Implement createEntity function
        // await createEntity(type, {
        //   ...rowData,
        //   active: true
        // }, userId, userName);
        
        result.successCount++;
      } catch (error) {
        result.errorCount++;
        result.errors.push({
          row: i + 2, // +2 because Excel rows start at 1 and we have a header
          field: 'unknown',
          message: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    }

    result.success = result.errorCount === 0;
  } catch (error) {
    throw new Error('Error al procesar el archivo');
  }

  return result;
};

// TODO: Implement createEntity function
export const createEntity = async (
  type: MasterDataType,
  data: any,
  userId: string,
  userName: string
): Promise<void> => {
  // Implementation pending
  console.log('Creating entity:', { type, data, userId, userName });
};