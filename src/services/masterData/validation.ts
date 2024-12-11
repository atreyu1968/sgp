import { MasterDataType } from '../../types/master';

export function validateRow(type: MasterDataType, data: any): string | null {
  switch (type) {
    case 'centers':
      return validateCenter(data);
    case 'families':
      return validateFamily(data);
    case 'cycles':
      return validateCycle(data);
    case 'courses':
      return validateCourse(data);
    default:
      return null;
  }
}

function validateCenter(data: any): string | null {
  if (!data.code?.trim()) return 'El código es obligatorio';
  if (!data.name?.trim()) return 'El nombre es obligatorio';
  if (!data.city?.trim()) return 'La ciudad es obligatoria';
  if (!data.email?.trim()) return 'El email es obligatorio';
  if (!isValidEmail(data.email)) return 'El email no es válido';
  return null;
}

function validateFamily(data: any): string | null {
  if (!data.code?.trim()) return 'El código es obligatorio';
  if (!data.name?.trim()) return 'El nombre es obligatorio';
  return null;
}

function validateCycle(data: any): string | null {
  if (!data.code?.trim()) return 'El código es obligatorio';
  if (!data.name?.trim()) return 'El nombre es obligatorio';
  if (!data.familyId?.trim()) return 'La familia profesional es obligatoria';
  if (!['basic', 'medium', 'higher'].includes(data.level)) {
    return 'El nivel debe ser basic, medium o higher';
  }
  if (isNaN(data.duration) || data.duration < 1000 || data.duration > 3000) {
    return 'La duración debe estar entre 1000 y 3000 horas';
  }
  return null;
}

function validateCourse(data: any): string | null {
  if (!data.code?.trim()) return 'El código es obligatorio';
  if (!data.name?.trim()) return 'El nombre es obligatorio';
  if (!data.cycleId?.trim()) return 'El ciclo formativo es obligatorio';
  if (![1, 2].includes(Number(data.year))) return 'El año debe ser 1 o 2';
  return null;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}