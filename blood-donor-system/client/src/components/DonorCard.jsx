import React from 'react';

function DonorCard({ donor }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-800 group-hover:h-3 transition-all duration-300"></div>
      
      <div className="flex items-start justify-between mt-3 mb-5">
        <div className="flex flex-col">
          <h4 className="text-2xl font-bold text-gray-900 truncate tracking-tight">{donor.name}</h4>
          <span className="text-sm font-medium text-gray-500 mt-1">
            {donor.distance !== undefined 
              ? `${donor.distance.toFixed(1)} km away` 
              : 'Found locally within 10km'}
          </span>
        </div>
        <div className="flex-shrink-0 bg-red-100 border border-red-200 text-red-700 shadow-sm w-12 h-12 flex items-center justify-center rounded-full text-xl font-black">
          {donor.bloodGroup}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center text-gray-700 bg-gray-50 rounded-lg p-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase text-gray-500">Status</span>
            <span className="block text-sm font-bold text-green-700">Available to Donate</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <a href={`tel:${donor.phone}`} className="flex items-center justify-center w-full bg-gray-900 text-white shadow-md hover:bg-red-600 hover:shadow-red-500/50 py-3 rounded-xl font-bold transition-all duration-300 group">
          <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          Contact {donor.phone}
        </a>
      </div>
    </div>
  );
}

export default DonorCard;
