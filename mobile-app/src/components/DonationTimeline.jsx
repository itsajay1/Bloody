import React from 'react';

function DonationTimeline({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200/60 group hover:border-red-200 transition-colors">
        <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-premium group-hover:-translate-y-2 group-hover:rotate-6 transition-all duration-700">
          <svg className="w-10 h-10 text-gray-200 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">The Journey Awaits.</h4>
        <p className="text-gray-400 font-medium text-lg px-8">Your legacy of heroism is yet to be written. Log your first contribution above.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-4 border-gray-100 ml-6 space-y-12 py-8">
      {history.slice().reverse().map((record, index) => (
        <div key={record._id || index} className="relative pl-12 group">
          {/* Multi-layered Animated Droplet */}
          <div className="absolute -left-[16px] top-2 flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
            <div className="w-8 h-8 rounded-xl bg-white shadow-premium flex items-center justify-center border border-red-100 group-hover:bg-red-600 group-hover:border-red-600 transition-colors">
              <svg className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <div className="absolute w-12 h-12 bg-red-500/10 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
          </div>
          
          <div className="glass p-8 rounded-[2rem] border-white/60 shadow-premium group-hover:-translate-y-2 transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(220,38,38,0.1)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-2xl font-black text-gray-900 mb-1 tracking-tighter leading-none group-hover:text-red-500 transition-colors">
                  {record.hospital}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-2 py-0.5 rounded-lg bg-red-50 text-[9px] font-black uppercase text-red-500 border border-red-100 tracking-widest">
                    Validated
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Contribution Date</p>
                <p className="text-sm font-bold text-gray-800 tracking-tight flex items-center justify-end gap-1.5">
                  <svg className="w-3 h-3 text-red-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" /></svg>
                  {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DonationTimeline;
