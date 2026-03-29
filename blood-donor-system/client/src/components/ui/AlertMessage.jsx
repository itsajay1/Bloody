import React from 'react';

function AlertMessage({ status }) {
  if (!status) return null;

  const bgClasses = {
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    loading: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const currentClass = bgClasses[status.type] || bgClasses.loading;

  return (
    <div className={`p-4 md:p-5 mb-8 rounded-xl md:rounded-2xl text-sm font-semibold flex items-center gap-3 transition-all border ${currentClass}`}>
      {status.type === 'loading' && (
        <svg className="animate-spin h-5 w-5 text-current flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {status.message}
    </div>
  );
}

export default AlertMessage;
