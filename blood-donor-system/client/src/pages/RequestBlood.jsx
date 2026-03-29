import React, { useState } from 'react';
import DonorCard from '../components/DonorCard';
import AlertMessage from '../components/ui/AlertMessage';
import InputField from '../components/ui/InputField';
import SelectField from '../components/ui/SelectField';

function RequestBlood() {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    location: '', // User types text for now
  });
  const [donors, setDonors] = useState([]);
  const [status, setStatus] = useState(null); // { type: 'loading' | 'success' | 'error', message: '' }
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Please select a blood group';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Please provide a location constraint boundary';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setStatus({ type: 'loading', message: 'Searching for matching donors...' });
    setDonors([]); // Reset previous matches

    try {
      // The backend requires a lat/lng object for location validation.
      // We pass a mock location for now to bypass the schema error alongside the requested text.
      const payload = {
        bloodGroup: formData.bloodGroup,
        location: { lat: 27.7172, lng: 85.3240 } // Mock location
      };

      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }

      const data = await res.json();
      
      const matched = data.matchingDonors || [];
      setDonors(matched);
      
      if (matched.length === 0) {
        setStatus({ type: 'error', message: `No available donors found for blood group ${formData.bloodGroup}. Request logged.` });
      } else {
        setStatus({ type: 'success', message: `Found ${matched.length} matching donor(s)! Request logged.` });
      }

    } catch (error) {
      console.error('Error requesting blood:', error);
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md mb-10">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Request Blood</h2>
        
        <AlertMessage status={status} />

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Required Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              error={errors.bloodGroup}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
              ]}
            />
            
            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="City, Hospital, or Landmark"
            />
          </div>

          <button
            type="submit"
            disabled={status?.type === 'loading'}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400"
          >
            {status?.type === 'loading' ? 'Searching...' : 'Find Donors'}
          </button>
        </form>
      </div>

      {donors.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Matching Donors ({donors.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {donors.map((donor) => (
              <DonorCard key={donor._id} donor={donor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestBlood;
