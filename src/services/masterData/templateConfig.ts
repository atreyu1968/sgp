import { MasterDataType } from '../../types/master';

interface TemplateConfig {
  fields: string[];
  validations?: string[];
}

const templateConfigs: Record<MasterDataType, TemplateConfig> = {
  centers: {
    fields: ['code', 'name', 'address', 'city', 'province', 'phone', 'email']
  },
  families: {
    fields: ['code', 'name', 'description']
  },
  cycles: {
    fields: ['code', 'name', 'familyId', 'level', 'duration', 'description'],
    validations: ['level: basic, medium, higher']
  },
  courses: {
    fields: ['code', 'name', 'cycleId', 'year'],
    validations: ['year: 1, 2']
  }
};

export function getTemplateConfig(type: MasterDataType): TemplateConfig {
  return templateConfigs[type];
}