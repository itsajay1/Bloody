import React from 'react';

function InputField({ label, name, type = 'text', value, onChange, error, placeholder, className = '', min, max }) {
  return (
    <div className="group">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1 transition-colors group-focus-within:text-red-600">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          className={`w-full px-5 py-4 bg-white/50 backdrop-blur-sm border rounded-[1.25rem] focus:ring-4 focus:ring-red-500/10 focus:outline-none transition-all duration-300 font-semibold text-gray-900 placeholder-gray-300 ${
            error 
              ? 'border-red-400 bg-red-50/10' 
              : 'border-gray-100 focus:border-red-500 shadow-sm hover:border-gray-200'
          } ${className}`}
        />
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
             <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </div>
        )}
      </div>
      {error && (
        <p className="form-error">{error}</p>
      )}
    </div>
  );
}

export default InputField;
