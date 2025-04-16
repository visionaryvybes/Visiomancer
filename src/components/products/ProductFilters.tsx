import React from 'react';
import { Filters, FilterDefinition } from './types';

interface ProductFiltersProps {
  filters: Record<string, FilterDefinition>; // Use FilterDefinition
  activeFilters: Filters;
  onChange: (filterId: string, optionId: string, checked: boolean) => void;
}

export default function ProductFilters({ filters, activeFilters, onChange }: ProductFiltersProps) {
  return (
    <form className="space-y-6">
      {Object.values(filters).map((section) => (
        <div key={section.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="-my-3 flow-root">
            <span className="font-medium text-gray-900 dark:text-white">{section.name}</span>
          </h3>
          <div className="pt-6 space-y-4">
            {section.options.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  id={`filter-${section.id}-${option.id}`}
                  name={`${section.id}[]`}
                  defaultValue={option.id}
                  type="checkbox"
                  checked={!!activeFilters[section.id]?.[option.id]}
                  onChange={(e) => onChange(section.id, option.id, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                />
                <label
                  htmlFor={`filter-${section.id}-${option.id}`}
                  className="ml-3 text-sm text-gray-600 dark:text-gray-300"
                >
                  {option.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </form>
  );
} 