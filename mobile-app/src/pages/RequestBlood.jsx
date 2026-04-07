import React, { useState } from 'react';
import RequestForm from '../components/RequestForm';
import DonorCard from '../components/DonorCard';
import AlertMessage from '../components/ui/AlertMessage';
import MapDisplay from '../components/ui/MapDisplay';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

function RequestBlood() {
  const [donors, setDonors] = useState([]);
  const [status, setStatus] = useState(null);
  const [lastLocation, setLastLocation] = useState(null); // Keep for map display

  const handleRequestSearch = async ({ bloodGroup, location }) => {
    setStatus({ type: 'loading', message: 'Searching for matching donors...' });
    setDonors([]);
    setLastLocation(location);

    try {
      const data = await apiRequest('/api/request', {
        method: 'POST',
        body: JSON.stringify({
          bloodGroup,
          location: { lat: location.lat, lng: location.lng },
        }),
      });

      const matched = data.matchingDonors || [];
      setDonors(matched);
      
      if (matched.length === 0) {
        setStatus({ type: 'error', message: `No available donors found for ${bloodGroup}. Request logged.` });
      } else {
        setStatus({ type: 'success', message: `Found ${matched.length} matching donor(s)!` });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 animate-fade-in-up">
      <div className="bg-white/75 backdrop-blur-[12px] border border-white/60 p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] mb-16 relative overflow-hidden max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-red-100/30 blur-3xl mix-blend-multiply opacity-50"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-red-600 text-white rounded-[1.25rem] flex items-center justify-center mb-10 shadow-2xl shadow-red-500/30 mx-auto transform hover:rotate-6 transition-transform">
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-7xl font-black text-gray-900 mb-4 tracking-tighter leading-none">
              Emergency <br/><span className="bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent">Broadcast</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-lg mx-auto">
              Identify and connect with nearby heroes instantly.
            </p>
          </div>
          
          <AlertMessage status={status} />

          <RequestForm onSubmit={handleRequestSearch} isLoading={status?.type === 'loading'} />
        </div>
      </div>

      {donors.length > 0 && (
        <div className="animate-fade-in-up mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          <div className="h-[500px] sticky top-32 bg-white/75 backdrop-blur-[12px] border border-white/60 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] p-2 overflow-hidden">
             <MapDisplay centerLocation={location} donors={donors} />
          </div>

          <div>
            <div className="flex items-end justify-between mb-8 px-4">
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-2">Available Heroes</h3>
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Showing matching donors in your vicinity</p>
              </div>
              <div className="h-12 w-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-red-500/30">
                {donors.length}
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              {donors.map((donor) => (
                <div key={donor._id} className="relative z-0 group w-full">
                  <DonorCard donor={donor} />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default RequestBlood;
