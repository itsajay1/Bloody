import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonationTimeline from '../components/DonationTimeline';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState({ type: 'loading', message: 'Loading profile...' });
  const [hospital, setHospital] = useState('');
  const [logStatus, setLogStatus] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (user.role !== 'donor') {
        navigate('/'); 
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/donor/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
             logout();
             return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        setProfile(data);
        setStatus(null);
      } catch (error) {
        console.error(error);
        setStatus({ type: 'error', message: 'Communications Link Failure' });
      }
    };

    fetchProfile();
  }, [user, navigate, logout]);

  const handleLogDonation = async (e) => {
    e.preventDefault();
    setLogStatus({ type: 'loading', message: 'Logging donation...' });

    const { token } = user || {};

    try {
      const res = await fetch(`${API_BASE_URL}/api/donor/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ hospital })
      });

      if (!res.ok) throw new Error('Failed to log donation');

      const data = await res.json();
      setProfile(data.donor); 
      setLogStatus({ type: 'success', message: 'Donation securely logged!' });
      setHospital('');
      
      setTimeout(() => setLogStatus(null), 3000);
    } catch (error) {
      setLogStatus({ type: 'error', message: error.message });
    }
  };

  const handleToggleAvailability = async () => {
    const { token } = user || {};

    try {
      const res = await fetch(`${API_BASE_URL}/api/donor/availability`, {
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
    }
  };

  if (status?.type === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-pulse">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600/40">Synchronizing Identity...</p>
      </div>
    );
  }

  if (status?.type === 'error') {
    return (
       <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-sm mx-auto text-center px-6">
         <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500">
           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
         </div>
         <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Identity Mismatch</h3>
         <p className="text-gray-500 font-medium mb-8">We encountered a secure line failure while establishing your profile link.</p>
         <button onClick={() => window.location.reload()} className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-xl shadow-gray-900/10">Re-Initialize Link</button>
       </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-fade-in-up">
      
      {/* Profile Sidebar */}
      <div className="lg:col-span-4 h-fit lg:sticky lg:top-32">
        <div className="glass rounded-[3rem] shadow-premium border-white/60 p-10 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-100/40 rounded-full blur-3xl z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-red-500 to-red-700 shadow-2xl shadow-red-500/30 flex items-center justify-center mb-6 transform transition-transform hover:scale-110 hover:rotate-6 relative group/icon">
                <svg className="w-16 h-16 text-white/20 absolute -bottom-2 -right-2 transition-transform group-hover/icon:scale-125" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" />
                </svg>
                <span className="text-4xl font-black text-white tracking-tighter relative z-10">{profile.bloodGroup}</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">{profile.name}</h2>
              <div className="flex flex-col items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${profile.available ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                  {profile.available ? 'Active Duty' : 'Standby'}
                </span>
                <button 
                  onClick={handleToggleAvailability}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 focus:outline-none ring-offset-4 focus:ring-4 focus:ring-red-500/20 ${profile.available ? 'bg-red-600 shadow-lg shadow-red-500/40' : 'bg-gray-200'}`}
                >
                  <span className={`${profile.available ? 'translate-x-7' : 'translate-x-1'} inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-500 ease-out`} />
                </button>
              </div>
            </div>
            
            <div className="space-y-6 bg-white/40 p-8 rounded-[2rem] border border-white/60 shadow-inner">
              <div className="flex items-center group/item">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-premium flex items-center justify-center mr-5 text-gray-400 group-hover/item:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div className="min-w-0">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-0.5">Frequency</label>
                  <p className="font-bold text-gray-900 truncate tracking-tight">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center group/item">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-premium flex items-center justify-center mr-5 text-gray-400 group-hover/item:text-red-500 transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-0.5">Secure Line</label>
                  <p className="font-bold text-gray-900 tracking-tight">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center group/item">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-premium flex items-center justify-center mr-5 text-gray-400 group-hover/item:text-red-500 transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-0.5">Registry Bio</label>
                  <p className="font-bold text-gray-900 tracking-tight">{profile.age} Cycles Old</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-12">
        
        {/* Call to Action: Log Donation */}
        <div className="bg-gray-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 rounded-lg bg-red-500/10 border border-white/5 mb-6 text-center md:text-left">
                <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.2em]">Contribution Update</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter leading-none">Log Contribution.</h3>
              <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                Securely record your clinical donation to refresh your hero status.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex-shrink-0 bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              {logStatus && (
                <div className={`p-4 mb-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-fade-in-up ${logStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : logStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                  {logStatus.message}
                </div>
              )}
              <form onSubmit={handleLogDonation} className="space-y-6">
                <div>
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Facility Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Nexus Clinic South..."
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full md:w-72 h-16 px-6 rounded-[1.25rem] bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:bg-white/10 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all font-bold tracking-tight"
                  />
                </div>
                <button
                  type="submit"
                  disabled={logStatus?.type === 'loading'}
                  className="w-full h-16 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-[1.25rem] shadow-2xl shadow-red-500/20 hover:shadow-red-500/40 transform transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex justify-center items-center gap-3"
                >
                  <svg className={`w-5 h-5 ${logStatus?.type === 'loading' ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                  <span>{logStatus?.type === 'loading' ? 'Recording...' : 'Finalize Log'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Beautiful Timeline */}
        <div className="glass p-8 md:p-12 rounded-[3.5rem] shadow-premium border-white/60">
          <div className="flex items-center justify-between mb-12 px-2">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none mb-2">Contribution Stream</h3>
              <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Validated clinical donation history</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center transform hover:rotate-12 transition-transform shadow-xl shadow-red-500/20 flex-shrink-0">
               <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" /></svg>
            </div>
          </div>
          
          <DonationTimeline history={profile.donationHistory} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
