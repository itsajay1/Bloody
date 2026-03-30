import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-24 animate-fade-in-up">
        <div className="inline-block px-4 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6">
          <span className="text-[10px] font-black uppercase text-red-600 tracking-[0.2em]">Community Driven</span>
        </div>
        <h2 className="text-6xl font-black text-gray-900 tracking-tighter sm:text-8xl mb-6 leading-none animate-float">
          Every Drop <br/>
          <span className="text-gradient">Saves Lives</span>
        </h2>
        <p className="mt-8 max-w-2xl text-xl text-gray-500 mx-auto font-medium leading-relaxed">
          The ultimate network connecting heroes with patients. <br className="hidden md:block"/>
          Fast, secure, and purely humanitarian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
        
        {/* Donor Card */}
        <div className="glass rounded-[3rem] shadow-premium p-10 transform transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-15px_rgba(220,38,38,0.2)] flex flex-col items-center text-center group cursor-pointer border-white/60">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl transform transition-transform group-hover:scale-110 group-hover:rotate-6">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Be a Hero</h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-grow">
            Join thousands of donors. Register securely and save lives in your neighborhood when every second counts.
          </p>
          <Link to="/register" className="w-full inline-flex justify-center items-center px-8 py-5 text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-gray-900 hover:bg-red-600 shadow-2xl transition-all active:scale-95">
            Join the Registry
          </Link>
        </div>

        {/* Request Card */}
        <div className="glass rounded-[3rem] shadow-premium p-10 transform transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-15px_rgba(30,41,59,0.15)] flex flex-col items-center text-center group cursor-pointer border-white/60">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-950 text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl transform transition-transform group-hover:scale-110 group-hover:-rotate-6">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Instant Request</h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-grow">
            Emergency? Broadcast a location-based request and find available matching donors within minutes.
          </p>
          <Link to="/request" className="w-full inline-flex justify-center items-center px-8 py-5 text-sm font-black uppercase tracking-widest rounded-2xl text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all active:scale-95">
            Find Donors Now
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Home;
