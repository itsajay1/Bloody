import React, { useState } from 'react';
import SelectField from './ui/SelectField';
import LocationPicker from './ui/LocationPicker';

/**
 * RequestForm Component
 * Renders the blood request form with blood type and location selection.
 * Used identically in both Web and Mobile apps.
 */
const RequestForm = ({ onSubmit, isLoading }) => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!bloodGroup) newErrors.bloodGroup = 'Please select a blood group';
    if (!location) newErrors.location = 'Please share your location to find nearby donors';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({ bloodGroup, location });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <SelectField
          label="Required Type"
          name="bloodGroup"
          value={bloodGroup}
          onChange={(e) => {
            setBloodGroup(e.target.value);
            if (errors.bloodGroup) setErrors((prev) => ({ ...prev, bloodGroup: null }));
          }}
          error={errors.bloodGroup}
          options={[
            { value: 'A+', label: 'A Positive' },
            { value: 'A-', label: 'A Negative' },
            { value: 'B+', label: 'B Positive' },
            { value: 'B-', label: 'B Negative' },
            { value: 'AB+', label: 'AB Positive' },
            { value: 'AB-', label: 'AB Negative' },
            { value: 'O+', label: 'O Positive' },
            { value: 'O-', label: 'O Negative' },
          ]}
        />
        <div className="md:pt-1">
          <LocationPicker
            onLocation={(coords) => {
              setLocation(coords);
              if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
            }}
            error={errors.location}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-4 w-full h-16 bg-gray-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all duration-500 hover:bg-red-600 hover:shadow-[0_25px_50px_-12px_rgba(220,38,38,0.4)] active:scale-95 disabled:opacity-50 group overflow-hidden relative"
      >
        <div className={`absolute inset-0 bg-red-600 transition-transform duration-500 ${isLoading ? 'translate-y-0' : 'translate-y-full'}`}></div>
        <span className="relative z-10">{isLoading ? 'Intercepting Heroes...' : 'Trigger Frequency'}</span>
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white relative z-10" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5 group-hover:rotate-12 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default RequestForm;
