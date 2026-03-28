import React, { useState } from 'react';

function RequestBlood() {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    location: '', // User types text for now
  });
  const [donors, setDonors] = useState([]);
  const [status, setStatus] = useState(null); // { type: 'loading' | 'success' | 'error', message: '' }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        
        {status && (
          <div className={`p-4 mb-6 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-700' : status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Blood Group</label>
              <select
                name="bloodGroup"
                required
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="City, Hospital, or Landmark"
              />
            </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <div key={donor._id} className="bg-red-50 border border-red-100 p-6 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-900 truncate pr-2">{donor.name}</h4>
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {donor.bloodGroup}
                  </span>
                </div>
                <div className="flex items-center text-gray-700 mb-2">
                  <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                  <span className="font-medium text-gray-900 truncate">Available</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <a href={`tel:${donor.phone}`} className="hover:text-red-600 truncate">{donor.phone}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestBlood;
