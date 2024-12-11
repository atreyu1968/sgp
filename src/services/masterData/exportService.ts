import { utils, write } from 'xlsx';
import { MasterDataType } from '../../types/master';
import { getTemplateConfig } from './templateConfig';

export function generateTemplate(type: MasterDataType): Blob {
  const wb = utils.book_new();
  const config = getTemplateConfig(type);
  
  // Add main template sheet
  const ws = utils.aoa_to_sheet([config.fields]);
  utils.book_append_sheet(wb, ws, 'Template');
  
  // Add validation sheet if needed
  if (config.validations) {
    const validationWs = utils.aoa_to_sheet([
      ['Valores válidos:'],
      ...config.validations.map(v => [v])
    ]);
    utils.book_append_sheet(wb, validationWs, 'Validation');
  }

  // Generate buffer and create blob
  const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}