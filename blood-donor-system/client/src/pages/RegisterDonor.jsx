import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../components/ui/AlertMessage';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import LocationPicker from '../components/ui/LocationPicker';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import toast from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState(null); // { lat, lng } from browser
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
    // Clear the specific error when user types again
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

    if (!validateForm()) {
      toast.error('Please fix the errors in the form below.');
      return;
    }

    setIsLoading(true);
    const registerToast = toast.loading('Registering donor secure profile...');

    try {
      const payload = {
        ...formData,
        role,
        age: role === 'donor' ? Number(formData.age) : undefined,
        location: role === 'donor' ? { lat: location.lat, lng: location.lng } : undefined,
      };

      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const userData = data.data;
      login(userData);
      toast.success(`Successfully registered as ${role}! Redirecting...`, { id: registerToast });
      
      setTimeout(() => navigate(role === 'donor' ? '/profile' : '/'), 1500);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(error.message, { id: registerToast });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 animate-fade-in-up">
      <div className="bg-white/75 backdrop-blur-[12px] border border-white/60 p-10 sm:p-16 rounded-[3.5rem] shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] relative overflow-hidden">
        
        {/* Soft decorative background flares */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-red-100/40 opacity-60 mix-blend-multiply blur-3xl z-0 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-orange-100/40 opacity-60 mix-blend-multiply blur-3xl z-0 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <div className="w-16 h-16 flex items-center justify-center mb-10 mx-auto transform hover:rotate-6 transition-transform">
              <img src="/logo.png" alt="Lifeline Connect" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-gray-900 mb-4 tracking-tighter leading-none animate-float" style={{ fontFamily: 'var(--font-heading)' }}>
              {role === 'donor' ? 'Become a Hero' : 'Hospital Portal'}
            </h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl mx-auto">
              {role === 'donor' ? 'Join the global registry and give the ultimate gift of life.' : 'Register your medical facility to request blood instantly.'}
            </p>
          </div>

          {/* Premium Role Selection Toggle */}
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
          

          <form onSubmit={handleSubmit} className="space-y-12" noValidate>
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
                
                <div className="flex items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] cursor-pointer hover:border-red-200 transition-all group/check active:scale-[0.98]" onClick={() => setFormData(p => ({ ...p, available: !p.available }))}>
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${formData.available ? 'bg-red-600 border-red-600' : 'bg-transparent border-gray-200 group-hover/check:border-red-400'}`}>
                    {formData.available && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className="ml-6">
                    <label className="text-sm font-black text-gray-900 cursor-pointer tracking-tight">
                      Ready for Active Duty
                    </label>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Allow emergency requesters to discover your profile.</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-20 flex items-center justify-center gap-4 bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[2rem] transition-all duration-500 hover:bg-red-600 hover:shadow-[0_25px_50px_-12px_rgba(220,38,38,0.4)] hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group mt-12 overflow-hidden relative font-heading"
            >
              <div className={`absolute inset-0 bg-red-600 transition-transform duration-500 ${isLoading ? 'translate-y-0' : 'translate-y-full'}`}></div>
              <span className="relative z-10">{isLoading ? 'Initializing Identity...' : 'Confirm Registration'}</span>
              {!isLoading && <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
              {isLoading && <svg className="animate-spin h-5 w-5 text-white relative z-10" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterDonor;
