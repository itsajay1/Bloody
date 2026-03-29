import React from 'react';

function InputField({ label, name, type = 'text', value, onChange, error, placeholder, className = '', min, max }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full px-5 py-4 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all font-medium text-gray-900 ${
          error ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
        } ${className}`}
      />
      {error && (
        <p className="text-red-600 text-xs font-bold mt-2 ml-1">{error}</p>
      )}
    </div>
  );
}

export default InputField;
