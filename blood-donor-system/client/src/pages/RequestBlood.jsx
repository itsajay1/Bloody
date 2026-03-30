import React, { useState } from 'react';
import DonorCard from '../components/DonorCard';
import AlertMessage from '../components/ui/AlertMessage';
import SelectField from '../components/ui/SelectField';
import LocationPicker from '../components/ui/LocationPicker';

function RequestBlood() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState(null);
  const [donors, setDonors] = useState([]);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!bloodGroup) newErrors.bloodGroup = 'Please select a blood group';
    if (!location) newErrors.location = 'Please share your location to find nearby donors';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setStatus({ type: 'loading', message: 'Searching for matching donors...' });
    setDonors([]);

    try {
      const payload = {
        bloodGroup,
        location: { lat: location.lat, lng: location.lng },
      };

      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }

      const data = await res.json();
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
    <div className="max-w-4xl mx-auto px-6 py-24 animate-fade-in-up safe-pt">
      <div className="glass p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-premium border-white/60 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-red-100/30 blur-3xl mix-blend-multiply opacity-50"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-red-600 text-white rounded-[1.25rem] flex items-center justify-center mb-10 shadow-2xl shadow-red-500/30 mx-auto transform hover:rotate-6 transition-transform">
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-7xl font-black text-gray-900 mb-4 tracking-tighter leading-none">
              Emergency <br/><span className="text-gradient">Broadcast</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-lg mx-auto">
              Identify and connect with nearby heroes instantly.
            </p>
          </div>
          
          <AlertMessage status={status} />

          <form onSubmit={handleSubmit} className="space-y-10" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <SelectField
                label="Required Type"
                name="bloodGroup"
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                  if (errors.bloodGroup) setErrors((prev) => ({ ...prev, bloodGroup: null }));
                }}
                error={errors.bloodGroup}
                options={[
                  { value: 'A+', label: 'A Positive' },
                  { value: 'A-', label: 'A Negative' },
                  { value: 'B+', label: 'B Positive' },
                  { value: 'B-', label: 'B Negative' },
                  { value: 'AB+', label: 'AB Positive' },
                  { value: 'AB-', label: 'AB Negative' },
                  { value: 'O+', label: 'O Positive' },
                  { value: 'O-', label: 'O Negative' },
                ]}
              />
              <div className="md:pt-1">
                <LocationPicker
                  onLocation={(coords) => {
                    setLocation(coords);
                    if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
                  }}
                  error={errors.location}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status?.type === 'loading'}
              className="w-full h-16 group bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-red-600 shadow-2xl hover:shadow-red-500/40 transform transition-all duration-500 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
            >
              <svg className={`w-5 h-5 ${status?.type === 'loading' ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{status?.type === 'loading' ? 'Intercepting Heroes...' : 'Trigger Frequency'}</span>
            </button>
          </form>
        </div>
      </div>

      {donors.length > 0 && (
        <div className="animate-fade-in-up">
          <div className="flex items-end justify-between mb-10 px-4">
            <div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-2">Available Heroes</h3>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Showing matching donors in your vicinity</p>
            </div>
            <div className="h-12 w-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-red-500/30">
              {donors.length}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {donors.map((donor) => (
              <DonorCard key={donor._id} donor={donor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestBlood;
