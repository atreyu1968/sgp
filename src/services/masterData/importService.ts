import { utils, read } from 'xlsx';
import { MasterDataType, ImportResult } from '../../types/master';
import { getTemplateConfig } from './templateConfig';
import { validateRow } from './validation';
import { createEntity } from './entityService';

export async function importData(
  type: MasterDataType,
  file: File,
  userId: string,
  userName: string
): Promise<ImportResult> {
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
    const config = getTemplateConfig(type);

    // Skip header row
    const dataRows = rows.slice(1) as any[];
    result.totalRows = dataRows.length;

    for (let i = 0; i < dataRows.length; i++) {
      try {
        const row = dataRows[i];
        const rowData = config.fields.reduce((acc, field, index) => {
          acc[field] = row[index];
          return acc;
        }, {} as any);

        // Validate row data
        const validationError = validateRow(type, rowData);
        if (validationError) {
          throw new Error(validationError);
        }

        // Create entity
        await createEntity(type, {
          ...rowData,
          active: true
        }, userId, userName);
        
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
}