import React from 'react';

function SelectField({ label, name, value, onChange, error, options = [], placeholder = 'Select an option' }) {
  return (
    <div className="group">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1 transition-colors group-focus-within:text-red-600">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-5 py-4 bg-white/50 backdrop-blur-sm border rounded-[1.25rem] focus:ring-4 focus:ring-red-500/10 focus:outline-none transition-all duration-300 font-bold text-gray-900 appearance-none cursor-pointer ${
            error 
              ? 'border-red-400 bg-red-50/10' 
              : 'border-gray-100 focus:border-red-500 shadow-sm hover:border-gray-200'
          }`}
        >
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-gray-900 bg-white">
              {opt.label}
            </option>
          ))}
        </select>
        {/* Modern Chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-400 group-focus-within:text-red-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-[11px] font-bold mt-2 ml-1 animate-fade-in-up">{error}</p>
      )}
    </div>
  );
}

export default SelectField;
