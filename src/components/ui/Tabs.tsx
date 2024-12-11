import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  return (
    <button
      onClick={() => {
        const parent = document.querySelector('[data-value]');
        const parentValue = parent?.getAttribute('data-value');
        if (parentValue !== value) {
          parent?.setAttribute('data-value', value);
          const event = new CustomEvent('valueChange', { detail: value });
          parent?.dispatchEvent(event);
        }
      }}
      className={`${className} ${
        document.querySelector('[data-value]')?.getAttribute('data-value') === value
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const parent = document.querySelector('[data-value]');
  const isActive = parent?.getAttribute('data-value') === value;
  
  if (!isActive) return null;
  
  return <div>{children}</div>;
};