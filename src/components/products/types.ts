// Defines the structure for active filters
// Keys are filter IDs (e.g., 'colors', 'sizes'), values are objects where keys are selected option IDs (e.g., 'red', 'm')
export type Filters = Record<string, Record<string, boolean>>;

// Defines the structure for a single filter option
export interface FilterOption {
  id: string;
  name: string;
}

// Defines the structure for a filter section (e.g., Colors, Sizes)
export interface FilterDefinition {
  id: string;
  name: string;
  options: FilterOption[];
}

// Defines the structure for sorting options
export interface SortOption {
  id: string;
  name: string;
} 