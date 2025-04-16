import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface FetchErrors {
  gumroad?: string;
  printful?: string;
}

interface ApiErrorProps {
  fetchErrors?: FetchErrors | null;
  fetcherError?: Error | null;
  context?: string; // Optional context message (e.g., "loading products", "loading product details")
}

const ApiError: React.FC<ApiErrorProps> = ({ fetchErrors, fetcherError, context }) => {
  const hasApiErrors = fetchErrors && (fetchErrors.gumroad || fetchErrors.printful);
  const hasFetcherError = fetcherError;

  if (!hasApiErrors && !hasFetcherError) {
    return null; // No errors to display
  }

  return (
    <div className="my-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
      <div className="flex items-center">
        <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
        <h3 className="font-semibold">
          {context ? `Error ${context}` : "An error occurred"}
        </h3>
      </div>
      <div className="mt-2 text-sm">
        {hasFetcherError && (
          <p>
            <strong>Network/Fetch Error:</strong> {fetcherError.message}
          </p>
        )}
        {hasApiErrors && (
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {fetchErrors.gumroad && (
              <li><strong>Gumroad:</strong> {fetchErrors.gumroad}</li>
            )}
            {fetchErrors.printful && (
              <li><strong>Printful:</strong> {fetchErrors.printful}</li>
            )}
          </ul>
        )}
         <p className="mt-2 text-xs text-red-600">Please try refreshing the page. If the problem persists, contact support.</p>
      </div>
    </div>
  );
};

export default ApiError; 