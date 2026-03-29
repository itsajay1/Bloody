import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AlertMessage from '../components/ui/AlertMessage';
import InputField from '../components/ui/InputField';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required to proceed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setStatus({ type: 'loading', message: 'Authenticating your credentials...' });

    try {
      const res = await fetch('/api/donor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      localStorage.setItem('donorInfo', JSON.stringify(data));
      setStatus({ type: 'success', message: 'Access Granted. Redirecting to dashboard...' });
      
      setTimeout(() => navigate('/profile'), 1200);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in-up">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_50px_rgba(220,_38,_38,_0.1)] border border-white/50 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-red-100 opacity-50 z-0 mix-blend-multiply blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-orange-100 opacity-50 z-0 mix-blend-multiply blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-500/30 mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 mb-2 text-center tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-center mb-8 font-medium">Log in to manage your donor profile</p>
          
          <AlertMessage status={status} />

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="hero@example.com"
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              className="tracking-widest"
            />

            <button
              type="submit"
              disabled={status?.type === 'loading' || status?.type === 'success'}
              className="w-full group bg-gray-900 text-white font-bold py-4 px-4 rounded-xl hover:bg-red-600 shadow-[0_10px_20px_rgba(0,_0,_0,_0.1)] hover:shadow-[0_10px_20px_rgba(220,_38,_38,_0.3)] transform transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              <span>{status?.type === 'loading' ? 'Verifying...' : 'Access Account'}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 hover:text-red-700 font-bold hover:underline transition-all">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
