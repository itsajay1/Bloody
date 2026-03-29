import React from 'react';

function DonationTimeline({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">No past donations explicitly logged.</p>
        <p className="text-gray-400 text-sm mt-1">Your journey starts here!</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-red-100 ml-6 space-y-10 py-4">
      {history.slice().reverse().map((record, index) => (
        <div key={record._id || index} className="relative pl-10 group">
          <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-red-500 border-[5px] border-white shadow-md group-hover:scale-125 group-hover:bg-red-600 transition-all duration-300"></div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-[0_10px_30px_rgba(220,_38,_38,_0.05)] group-hover:-translate-y-1 transition-all duration-300 hover:border-red-100">
            <h4 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">{record.hospital}</h4>
            <p className="text-sm font-semibold text-red-600 uppercase tracking-widest">
              {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DonationTimeline;
