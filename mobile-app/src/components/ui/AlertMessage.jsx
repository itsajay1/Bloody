import React from 'react';

function AlertMessage({ status }) {
  if (!status) return null;

  const config = {
    success: {
      bg: 'bg-green-50/80 text-green-800 border-green-200',
      icon: <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    error: {
      bg: 'bg-red-50/80 text-red-800 border-red-200',
      icon: <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    loading: {
      bg: 'bg-indigo-50/80 text-indigo-800 border-indigo-200',
      icon: (
        <svg className="animate-spin h-5 w-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )
    },
  };

  const { bg, icon } = config[status.type] || config.loading;

  return (
    <div className={`p-5 mb-8 rounded-[1.5rem] text-sm font-black flex items-center gap-4 transition-all border backdrop-blur-md animate-fade-in-up ${bg}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 leading-relaxed tracking-tight">{status.message}</div>
    </div>
  );
}

export default AlertMessage;
