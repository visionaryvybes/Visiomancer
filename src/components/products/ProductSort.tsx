import React from 'react';
import { SortOption } from './types';

interface ProductSortProps {
  sortOptions: SortOption[];
  currentSort: SortOption;
  onChange: (option: SortOption) => void;
}

export default function ProductSort({ sortOptions, currentSort, onChange }: ProductSortProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedOption = sortOptions.find(option => option.id === selectedId);
    if (selectedOption) {
      onChange(selectedOption);
    }
  };

  return (
    <div className="flex items-center justify-end mb-4">
      <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Sort by:
      </label>
      <select
        id="sort-by"
        name="sort-by"
        value={currentSort.id}
        onChange={handleSelectChange}
        className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        {sortOptions.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
} 