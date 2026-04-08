import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AlertMessage from '../components/ui/AlertMessage';
import InputField from '../components/ui/InputField';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import toast from 'react-hot-toast';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
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
    
    setIsLoading(true);
    const loginToast = toast.loading('Authenticating your credentials...');

    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const userData = data.data;
      login(userData);
      toast.success(`Welcome back, ${userData.name}! Access Granted.`, { id: loginToast });
      
      setTimeout(() => {
        if (userData.role === 'donor') navigate('/profile');
        else navigate('/');
      }, 800);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(error.message, { id: loginToast });
    }
  };

  const Logo = ({ className }) => (
    <img src="/logo.png" alt="Lifeline Connect" className={className} />
  );

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-6 animate-fade-in-up pt-24 pb-20">
      <div className="w-full max-w-sm bg-white/75 backdrop-blur-[12px] border border-white/60 p-10 sm:p-14 rounded-[3.5rem] shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-700">
        {/* Soft decorative background flares */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-red-100/40 blur-3xl mix-blend-multiply opacity-70"></div>
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-pink-100/40 blur-3xl mix-blend-multiply opacity-70"></div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 flex items-center justify-center mb-10 mx-auto transform hover:scale-110 transition-transform">
            <Logo className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter leading-none" style={{ fontFamily: 'var(--font-heading)' }}>Welcome Back.</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Secure Mobile Access</p>
          </div>

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
              disabled={isLoading}
              className="flex items-center justify-center gap-4 w-full h-16 bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all duration-500 hover:bg-red-600 hover:shadow-[0_25px_50px_-12px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group mt-4 overflow-hidden relative font-heading"
            >
              <div className={`absolute inset-0 bg-red-600 transition-transform duration-500 ${isLoading ? 'translate-y-0' : 'translate-y-full'}`}></div>
              <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Complete Identity'}</span>
              {!isLoading && <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
              {isLoading && <svg className="animate-spin h-5 w-5 text-white relative z-10" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>}
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
