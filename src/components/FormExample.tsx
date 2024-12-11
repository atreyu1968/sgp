import React from 'react';

const FormExample: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      {/* Text input with placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre completo
        </label>
        <input
          type="text"
          placeholder="Ej: Juan Pérez García"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Email input with placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          type="email"
          placeholder="ejemplo@correo.com"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Phone input with placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <input
          type="tel"
          placeholder="666 777 888"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Textarea with placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          placeholder="Escribe una breve descripción..."
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default FormExample;