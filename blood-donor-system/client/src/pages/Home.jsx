import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-4">
          Every Drop <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Saves Lives</span>
        </h2>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          A seamless network bridging the gap between brave donors and patients in critical need. Quick, reliable, and absolutely free.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        
        {/* Donor Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transform transition duration-500 hover:scale-[1.03] hover:shadow-2xl flex flex-col items-center text-center group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-red-50 transition duration-700 ease-in-out group-hover:scale-[3] opacity-50 z-0"></div>
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 z-10 shadow-inner group-hover:bg-red-600 group-hover:text-white transition duration-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 z-10">Be a Hero, Donate Blood</h3>
          <p className="text-gray-600 mb-8 z-10 flex-grow">
            Register your details securely and let hospitals and patients reach you securely when there is a critical shortage.
          </p>
          <Link to="/register" className="z-10 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all">
            Join the Registry
          </Link>
        </div>

        {/* Request Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transform transition duration-500 hover:scale-[1.03] hover:shadow-2xl flex flex-col items-center text-center group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 left-0 -ml-8 -mt-8 w-32 h-32 rounded-full bg-orange-50 transition duration-700 ease-in-out group-hover:scale-[3] opacity-50 z-0"></div>
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 z-10 shadow-inner group-hover:bg-orange-600 group-hover:text-white transition duration-300">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 z-10">Emergency Blood Request</h3>
          <p className="text-gray-600 mb-8 z-10 flex-grow">
            Instantly broadcast a location-based request and find immediately available matching donors within a 10km radius.
          </p>
          <Link to="/request" className="z-10 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-gray-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all">
            Find Donors Now
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Home;
