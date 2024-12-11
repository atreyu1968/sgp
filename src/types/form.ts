export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'file' | 'date' | 'tel' | 'email';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  acceptedFileTypes?: string[];
  multiple?: boolean;
  validation?: {
    pattern?: string;
    message?: string;
  };
}