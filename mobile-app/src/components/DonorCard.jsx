import React from 'react';

function DonorCard({ donor }) {
  return (
    <div className="relative bg-white/75 backdrop-blur-[12px] border border-white/40 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] p-8 overflow-hidden transition-transform duration-500 hover:-translate-y-2 group">
      {/* Decorative background flare */}
      <div className="absolute rounded-full filter blur-[3rem] mix-blend-multiply pointer-events-none z-0 bg-red-100/40 -top-10 -right-10 w-32 h-32 opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
      
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex flex-col">
          <h4 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{donor.name}</h4>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {donor.distance !== undefined 
                ? `${donor.distance.toFixed(1)} km away` 
                : 'Nearby Hero'}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_8px_20px_-5px_rgba(220,38,38,0.4)] w-14 h-14 flex items-center justify-center rounded-2xl text-2xl font-black transform transition group-hover:rotate-6">
          {donor.bloodGroup}
        </div>
      </div>

      <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 mb-8 relative z-10">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Current Status</span>
        <div className="flex items-center text-green-700 font-bold text-sm">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          Active Donor
        </div>
      </div>
      
      <div className="relative z-10">
        <a href={`tel:${donor.phone}`} className="flex items-center justify-center w-full py-4 bg-gray-900 text-white font-black text-sm uppercase tracking-tight rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-red-600 hover:shadow-[0_20px_25px_-5px_rgba(220,38,38,0.4)] group/btn">
          <svg className="w-5 h-5 mr-3 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          <span>Contact Donor</span>
        </a>
      </div>
    </div>
  );
}

export default DonorCard;
