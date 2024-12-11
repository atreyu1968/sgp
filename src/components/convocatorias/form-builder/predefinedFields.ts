import { FormField } from '../../../types/form';

export const predefinedFields: Omit<FormField, 'id'>[] = [
  {
    type: 'text',
    label: 'Nombre y apellidos del responsable',
    required: true,
    placeholder: 'Ej: Juan Pérez García',
  },
  {
    type: 'text',
    label: 'DNI/NIE del responsable',
    required: true,
    placeholder: '12345678X',
    validation: {
      pattern: '^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$',
      message: 'Introduce un DNI/NIE válido'
    },
    maxLength: 9
  },
  {
    type: 'tel',
    label: 'Teléfono móvil del responsable',
    required: true,
    placeholder: '666777888',
    validation: {
      pattern: '^[6-9][0-9]{8}$',
      message: 'Introduce un número de móvil válido'
    }
  },
  {
    type: 'select',
    label: 'Especialidad',
    required: true,
    options: ['Informática', 'Electrónica', 'Mecánica', 'Administración', 'Comercio'],
  },
  {
    type: 'number',
    label: 'Importe solicitado',
    required: true,
    placeholder: 'Ej: 5000',
    minValue: 0,
    maxValue: 50000
  },
  {
    type: 'file',
    label: 'Memoria del proyecto',
    required: true,
    acceptedFileTypes: ['.pdf', '.doc', '.docx'],
    placeholder: 'Subir memoria del proyecto'
  },
  {
    type: 'file',
    label: 'Anexo I - Presupuesto',
    required: true,
    acceptedFileTypes: ['.pdf', '.xls', '.xlsx'],
    placeholder: 'Subir presupuesto detallado'
  },
  {
    type: 'file',
    label: 'Anexo II - Cronograma',
    required: true,
    acceptedFileTypes: ['.pdf', '.xls', '.xlsx'],
    placeholder: 'Subir cronograma del proyecto'
  },
  {
    type: 'select',
    label: 'Centro colaborador',
    required: false,
    options: [], // Will be populated from master data
  },
  {
    type: 'text',
    label: 'Persona responsable del centro colaborador',
    required: false,
    placeholder: 'Nombre completo del responsable'
  },
  {
    type: 'text',
    label: 'DNI/NIE del responsable del centro colaborador',
    required: false,
    placeholder: '12345678X',
    validation: {
      pattern: '^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$',
      message: 'Introduce un DNI/NIE válido'
    },
    maxLength: 9
  },
  {
    type: 'select',
    label: 'Especialidad del responsable del centro colaborador',
    required: false,
    options: ['Informática', 'Electrónica', 'Mecánica', 'Administración', 'Comercio'],
  }
];