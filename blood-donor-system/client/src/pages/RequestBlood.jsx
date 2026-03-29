import React, { useState } from 'react';
import DonorCard from '../components/DonorCard';
import AlertMessage from '../components/ui/AlertMessage';
import SelectField from '../components/ui/SelectField';
import LocationPicker from '../components/ui/LocationPicker';

function RequestBlood() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState(null); // { lat, lng } from browser
  const [donors, setDonors] = useState([]);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!bloodGroup) {
      newErrors.bloodGroup = 'Please select a blood group';
    }
    if (!location) {
      newErrors.location = 'Please share your location to find nearby donors';
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
      const payload = {
        bloodGroup,
        location: { lat: location.lat, lng: location.lng },
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
        setStatus({ type: 'error', message: `No available donors found for blood group ${bloodGroup}. Request logged.` });
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
              value={bloodGroup}
              onChange={(e) => {
                setBloodGroup(e.target.value);
                if (errors.bloodGroup) setErrors((prev) => ({ ...prev, bloodGroup: null }));
              }}
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

            <LocationPicker
              onLocation={(coords) => {
                setLocation(coords);
                if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
              }}
              error={errors.location}
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
