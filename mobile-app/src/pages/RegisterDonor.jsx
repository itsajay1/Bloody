import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../components/ui/AlertMessage';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import LocationPicker from '../components/ui/LocationPicker';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

function RegisterDonor() {
  const [role, setRole] = useState('donor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // Donor specific
    age: '',
    bloodGroup: '',
    phone: '',
    lastDonationDate: '',
    available: true,
    // Hospital specific
    hospitalName: '',
    address: '',
    contactPerson: '',
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState(null); 
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'donor') navigate('/profile');
      else navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Username/Name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';

    if (role === 'donor') {
      const phoneRegex = /^[\d\s()+-]{7,15}$/;
      if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
      if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
      if (!formData.age || formData.age < 18 || formData.age > 60) {
        newErrors.age = 'You must be between 18 and 60 years old';
      }
      if (!location) {
        newErrors.location = 'Please share your location before registering';
      }
    } else if (role === 'hospital') {
      if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital Name is required';
      if (!formData.address.trim()) newErrors.address = 'Hospital Address is required';
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact Person Name is required';
      const phoneRegex = /^[\d\s()+-]{7,15}$/;
      if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Please enter a valid contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Intercepting Identity...' });

    if (!validateForm()) {
      setStatus({ type: 'error', message: 'Please fix the errors in the form below.' });
      return;
    }

    try {
      // Fallback coordinates (Kathmandu) if location services fail in emulator
      const finalLocation = location || { lat: 27.7172, lng: 85.3240 };

      const payload = {
        ...formData,
        role,
        age: role === 'donor' ? Number(formData.age) : undefined,
        location: role === 'donor' ? { lat: finalLocation.lat, lng: finalLocation.lng } : undefined,
      };

      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      login(data);
      setStatus({ type: 'success', message: `Successfully registered as ${role}! Redirecting...` });
      
      setTimeout(() => navigate(role === 'donor' ? '/profile' : '/'), 1500);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in-up">
      <div className="glass p-10 sm:p-16 rounded-[3.5rem] shadow-premium border-white/60 relative overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-red-100/40 opacity-60 mix-blend-multiply blur-3xl z-0 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-orange-100/40 opacity-60 mix-blend-multiply blur-3xl z-0 pointer-events-none"></div>
        
        <div className="relative z-10 text-center">
          <div className="mb-16">
            <div className="w-16 h-16 bg-red-600 text-white rounded-[1.25rem] flex items-center justify-center mb-10 shadow-2xl shadow-red-500/30 mx-auto transform hover:rotate-6 transition-transform">
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-gray-900 mb-4 tracking-tighter leading-none animate-float">
              {role === 'donor' ? 'Become a Hero' : 'Hospital Portal'}
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl mx-auto">
              {role === 'donor' ? 'Join the global registry and give the ultimate gift of life.' : 'Register your medical facility to request blood instantly.'}
            </p>
          </div>

          {/* Role Selection Toggle */}
          <div className="relative flex p-1.5 bg-gray-100 rounded-[2rem] mb-16 max-w-xs mx-auto border border-gray-200 shadow-inner group">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[1.75rem] shadow-xl transition-all duration-500 ease-out ${role === 'hospital' ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'}`}
            ></div>
            <button
              onClick={() => setRole('donor')}
              className={`relative z-10 flex-1 py-3 px-6 rounded-[1.75rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${role === 'donor' ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Donor
            </button>
            <button
              onClick={() => setRole('hospital')}
              className={`relative z-10 flex-1 py-3 px-6 rounded-[1.75rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${role === 'hospital' ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Hospital
            </button>
          </div>
          
          <AlertMessage status={status} />

          <form onSubmit={handleSubmit} className="space-y-12 text-left" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 font-bold">
              <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Nexus Commander" />
              <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="hero@lifeline.com" />
              <InputField label="Secret Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" className="tracking-widest" />
              
              {role === 'hospital' && (
                <>
                  <InputField label="Hospital Name" name="hospitalName" value={formData.hospitalName} onChange={handleChange} error={errors.hospitalName} placeholder="City General" />
                  <InputField label="Full Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} placeholder="123 Medical Dr" />
                  <InputField label="In-charge Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} error={errors.contactPerson} placeholder="Dr. Smith" />
                  <InputField label="Official Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="+1 (234) 567" />
                </>
              )}

              {role === 'donor' && (
                <>
                  <InputField label="Contact Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="+1 (234) 567" />
                  <SelectField label="Blood Type" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} error={errors.bloodGroup} options={[
                    { value: 'A+', label: 'A Positive' },
                    { value: 'A-', label: 'A Negative' },
                    { value: 'B+', label: 'B Positive' },
                    { value: 'B-', label: 'B Negative' },
                    { value: 'AB+', label: 'AB Positive' },
                    { value: 'AB-', label: 'AB Negative' },
                    { value: 'O+', label: 'O Positive' },
                    { value: 'O-', label: 'O Negative' },
                  ]} />
                  <InputField label="Your Age" type="number" name="age" min="18" max="60" value={formData.age} onChange={handleChange} error={errors.age} placeholder="25" />
                  <div className="md:col-span-2">
                    <LocationPicker
                      onLocation={(coords) => {
                        setLocation(coords);
                        if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
                      }}
                      error={errors.location}
                    />
                  </div>
                </>
              )}
            </div>

            {role === 'donor' && (
              <div className="p-10 bg-gray-50/50 rounded-[2.5rem] border border-gray-100/50 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Last Vital Contribution (Optional)</label>
                  <input
                    type="date"
                    name="lastDonationDate"
                    value={formData.lastDonationDate}
                    onChange={handleChange}
                    className="w-full md:w-1/2 px-6 py-4 bg-white/80 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-black text-gray-900 cursor-pointer shadow-sm"
                  />
                </div>
                
                <div className="flex items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-premium cursor-pointer hover:border-red-200 transition-all group/check active:scale-[0.98]" onClick={() => setFormData(p => ({ ...p, available: !p.available }))}>
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${formData.available ? 'bg-red-600 border-red-600' : 'bg-transparent border-gray-200 group-hover/check:border-red-400'}`}>
                    {formData.available && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className="ml-6">
                    <label className="text-sm font-black text-gray-900 cursor-pointer tracking-tight">Ready for Active Duty</label>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Allow emergency requesters to discover your profile.</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={status?.type === 'loading' || status?.type === 'success'}
              className="w-full h-20 group bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[2rem] hover:bg-red-600 shadow-2xl hover:shadow-red-500/40 transform transition-all duration-500 hover:-translate-y-1 mt-12 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
            >
              <span>{status?.type === 'loading' ? 'Encrypting Identity...' : 'Initialize Registry'}</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterDonor;
