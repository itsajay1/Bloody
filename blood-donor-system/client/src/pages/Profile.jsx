import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonationTimeline from '../components/DonationTimeline';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState({ type: 'loading', message: 'Loading profile...' });
  const [hospital, setHospital] = useState('');
  const [logStatus, setLogStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const stored = localStorage.getItem('userInfo');
      if (!stored) {
        navigate('/login');
        return;
      }
      
      const { token, role } = JSON.parse(stored);

      if (role !== 'donor') {
        navigate('/'); // Only donors have profiles for now
        return;
      }

      try {
        const res = await fetch('/api/donor/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Unauthenticated');
        }

        const data = await res.json();
        setProfile(data);
        setStatus(null);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('userInfo');
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogDonation = async (e) => {
    e.preventDefault();
    setLogStatus({ type: 'loading', message: 'Logging donation...' });

    const stored = localStorage.getItem('userInfo');
    const { token } = stored ? JSON.parse(stored) : {};

    try {
      const res = await fetch('/api/donor/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ hospital })
      });

      if (!res.ok) throw new Error('Failed to log donation');

      const data = await res.json();
      setProfile(data.donor); // Server returns updated donor
      setLogStatus({ type: 'success', message: 'Donation securely logged!' });
      setHospital('');
      
      setTimeout(() => setLogStatus(null), 3000);
    } catch (error) {
      setLogStatus({ type: 'error', message: error.message });
    }
  };

  const handleToggleAvailability = async () => {
    const stored = localStorage.getItem('donorInfo');
    const { token } = stored ? JSON.parse(stored) : {};

    try {
      const res = await fetch('/api/donor/availability', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to update availability');

      const data = await res.json();
      setProfile(prev => ({ ...prev, available: data.available }));
    } catch (error) {
      console.error(error);
      // Optional: show error message to user
    }
  };

  if (status) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in-up">
      
      {/* Profile Sidebar */}
      <div className="lg:col-span-4 h-fit sticky top-28">
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,_0,_0,_0.05)] border border-white p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150 z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-xl shadow-red-500/30 flex items-center justify-center mb-4 transform transition hover:-translate-y-1">
                <span className="text-3xl font-black text-white">{profile.bloodGroup}</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{profile.name}</h2>
              <div className="flex flex-col items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${profile.available ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                  {profile.available ? 'Available' : 'Unavailable'}
                </span>
                <button 
                  onClick={handleToggleAvailability}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${profile.available ? 'bg-green-600' : 'bg-gray-200'}`}
                >
                  <span className={`${profile.available ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </button>
              </div>
            </div>
            
            <div className="space-y-5 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Email</label>
                  <p className="font-semibold text-gray-900 truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Contact</label>
                  <p className="font-semibold text-gray-900">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-4 text-gray-400">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Demographics</label>
                  <p className="font-semibold text-gray-900">{profile.age} years old</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-10">
        
        {/* Call to Action: Log Donation */}
        <div className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Post-Donation Logging</h3>
              <p className="text-gray-400 font-medium text-lg mb-0 leading-relaxed">
                Log today's donation here to officially update your timeline. We will automatically place your profile on a 90-day cooldown to protect your health.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex-shrink-0 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
              {logStatus && (
                <div className={`p-3 mb-4 rounded-xl text-sm font-bold text-center ${logStatus.type === 'success' ? 'bg-green-400/20 text-green-300' : logStatus.type === 'error' ? 'bg-red-400/20 text-red-300' : 'bg-blue-400/20 text-blue-300'}`}>
                  {logStatus.message}
                </div>
              )}
              <form onSubmit={handleLogDonation} className="flex flex-col gap-4">
                <input
                  type="text"
                  required
                  placeholder="Enter Hospital Name..."
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full md:w-64 px-5 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:bg-white/10 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={logStatus?.type === 'loading'}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transform transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  <span>Log Recovery</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Beautiful Timeline */}
        <div className="bg-white/80 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,_0,_0,_0.03)] border border-white">
          <h3 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-5 flex items-center gap-3">
             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             Official Contribution Timeline
          </h3>
          
          <DonationTimeline history={profile.donationHistory} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
