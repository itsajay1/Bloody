import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../components/ui/AlertMessage';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';
import LocationPicker from '../components/ui/LocationPicker';

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
  const [location, setLocation] = useState(null); // { lat, lng } from browser
  const navigate = useNavigate();

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
    setStatus({ type: 'loading', message: 'Registering donor secure profile...' });

    if (!validateForm()) {
      setStatus({ type: 'error', message: 'Please fix the errors in the form below.' });
      return;
    }

    try {
      const payload = {
        ...formData,
        role,
        age: role === 'donor' ? Number(formData.age) : undefined,
        location: role === 'donor' ? { lat: location.lat, lng: location.lng } : undefined,
      };

      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      localStorage.setItem('userInfo', JSON.stringify(data));

      setStatus({ type: 'success', message: `Successfully registered as ${role}! Redirecting...` });
      
      setTimeout(() => navigate(role === 'donor' ? '/profile' : '/'), 1500);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="bg-white/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,_0,_0,_0.05)] border border-white relative overflow-hidden">
        
        {/* Soft decorative background flares */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 rounded-full bg-red-100 opacity-60 mix-blend-multiply blur-3xl z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 rounded-full bg-orange-50 opacity-60 mix-blend-multiply blur-3xl z-0 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              {role === 'donor' ? 'Become a Hero' : 'Hospital Portal'}
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              {role === 'donor' ? 'Join the registry and give the gift of life.' : 'Register your medical facility to request blood.'}
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-2xl mb-10 max-w-sm mx-auto border border-gray-200 shadow-inner">
            <button
              onClick={() => setRole('donor')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all duration-300 ${role === 'donor' ? 'bg-white text-red-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Donor
            </button>
            <button
              onClick={() => setRole('hospital')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all duration-300 ${role === 'hospital' ? 'bg-white text-red-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Hospital
            </button>
          </div>
          
          <AlertMessage status={status} />

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InputField label="Name / Username" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Unique identifier" />
              <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="hero@example.com" />
              <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" className="tracking-widest" />
              
              {role === 'hospital' && (
                <>
                  <InputField label="Hospital Name" name="hospitalName" value={formData.hospitalName} onChange={handleChange} error={errors.hospitalName} placeholder="City General Hospital" />
                  <InputField label="Hospital Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} placeholder="123 Medical Dr, City" />
                  <InputField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} error={errors.contactPerson} placeholder="Dr. Smith" />
                  <InputField label="Contact Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="+1 (234) 567-8900" />
                </>
              )}

              {role === 'donor' && (
                <>
                  <InputField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="+1 (234) 567-8900" />
                  <SelectField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} error={errors.bloodGroup} options={[
                    { value: 'A+', label: 'A Positive (A+)' },
                    { value: 'A-', label: 'A Negative (A-)' },
                    { value: 'B+', label: 'B Positive (B+)' },
                    { value: 'B-', label: 'B Negative (B-)' },
                    { value: 'AB+', label: 'AB Positive (AB+)' },
                    { value: 'AB-', label: 'AB Negative (AB-)' },
                    { value: 'O+', label: 'O Positive (O+)' },
                    { value: 'O-', label: 'O Negative (O-)' },
                  ]} />
                  <InputField label="Age" type="number" name="age" min="18" max="60" value={formData.age} onChange={handleChange} error={errors.age} placeholder="25" />
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
              <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100">
                <label className="block text-xs font-bold text-red-800 uppercase tracking-wider mb-3">Last Donation Date (Optional)</label>
                <input
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  onChange={handleChange}
                  className="w-full md:w-1/2 px-5 py-4 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium text-gray-900 cursor-pointer"
                />
                
                <div className="flex items-center mt-6 p-4 bg-white rounded-xl border border-red-100 shadow-sm cursor-pointer hover:border-red-300 transition-colors" onClick={() => setFormData(p => ({ ...p, available: !p.available }))}>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      readOnly
                      className="h-6 w-6 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                    />
                  </div>
                  <div className="ml-4">
                    <label className="text-sm font-bold text-gray-900 cursor-pointer">
                      I am currently available to donate blood
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">Keep this checked so emergency requesters can contact you.</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={status?.type === 'loading' || status?.type === 'success'}
              className="w-full group bg-gradient-to-r from-red-600 to-red-800 text-white font-black py-5 px-6 rounded-2xl hover:from-red-700 hover:to-red-900 shadow-[0_10px_20px_rgba(220,_38,_38,_0.2)] hover:shadow-[0_15px_30px_rgba(220,_38,_38,_0.4)] transform transition-all duration-300 hover:-translate-y-1 mt-8 text-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span>{status?.type === 'loading' ? 'Establishing Secure Profile...' : 'Complete Profile & Join'}</span>
              <svg className="w-6 h-6 group-hover:block transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterDonor;
