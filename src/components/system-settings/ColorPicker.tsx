import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div
        className="w-full h-10 rounded-md border border-gray-300 cursor-pointer flex items-center px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="w-6 h-6 rounded-full mr-2"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-gray-700">{color}</span>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-48 h-48"
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;