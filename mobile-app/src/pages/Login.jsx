import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AlertMessage from '../components/ui/AlertMessage';
import InputField from '../components/ui/InputField';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
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
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const userData = data.data;
      login(userData);
      setStatus({ type: 'success', message: `Welcome back, ${userData.name}! Access Granted.` });
      
      setTimeout(() => {
        if (userData.role === 'donor') navigate('/profile');
        else navigate('/');
      }, 800);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message });
    }
  };

  const BloodDropIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" />
    </svg>
  );

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-6 animate-fade-in-up pt-24 pb-20">
      <div className="w-full max-w-sm bg-white/75 backdrop-blur-[12px] border border-white/60 p-10 sm:p-14 rounded-[3.5rem] shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-700">
        {/* Soft decorative background flares */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-red-100/40 blur-3xl mix-blend-multiply opacity-70"></div>
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-pink-100/40 blur-3xl mix-blend-multiply opacity-70"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-[1.75rem] flex items-center justify-center mb-10 shadow-2xl shadow-red-500/30 mx-auto transform hover:rotate-6 transition-transform">
            <BloodDropIcon className="w-10 h-10" />
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter leading-none">Welcome Back.</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identify to Access Platform</p>
          </div>
          
          <AlertMessage status={status} />

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="hero@lifeline.com"
            />

            <InputField
              label="Secret Password"
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
              className="flex items-center justify-center gap-4 w-full h-16 bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all duration-500 hover:bg-red-600 hover:shadow-[0_25px_50px_-12px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
            >
              <span>{status?.type === 'loading' ? 'Encrypting Access...' : 'Complete Identity'}</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              New to the Network?{' '}
              <Link to="/register" className="text-red-600 hover:text-red-700 transition-all font-black ml-1 border-b-2 border-red-100 hover:border-red-600 pb-0.5">Initialize Identity</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
