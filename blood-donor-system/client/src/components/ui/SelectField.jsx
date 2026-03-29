import React from 'react';

function SelectField({ label, name, value, onChange, error, options = [], placeholder = 'Select an option' }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-5 py-4 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all font-bold text-red-600 appearance-none cursor-pointer ${
            error ? 'border-red-500' : 'border-gray-200 focus:border-red-500'
          }`}
        >
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-red-600 text-xs font-bold mt-2 ml-1">{error}</p>
      )}
    </div>
  );
}

export default SelectField;
