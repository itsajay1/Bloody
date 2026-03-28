import React, { useState } from 'react';

function RegisterDonor() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodGroup: '',
    phone: '',
    lastDonationDate: '',
    available: true,
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Registering donor...' });

    if (formData.age < 18 || formData.age > 60) {
      setStatus({ type: 'error', message: 'You must be between 18 and 60 years old to register as a donor.' });
      return;
    }

    try {
      // The API requires location, substituting a default static location for now
      const payload = {
        ...formData,
        age: Number(formData.age),
        location: { lat: 27.7172, lng: 85.3240 }
      };

      const res = await fetch('/api/donor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to register');
      }

      setStatus({ type: 'success', message: 'Successfully registered as a donor!' });
      setFormData({ name: '', age: '', bloodGroup: '', phone: '', lastDonationDate: '', available: true });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Register As A Blood Donor</h2>
      
      {status && (
        <div className={`p-4 mb-6 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-700' : status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              required
              min="1"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="25"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Donation Date</label>
          <input
            type="date"
            name="lastDonationDate"
            value={formData.lastDonationDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            name="available"
            id="available"
            checked={formData.available}
            onChange={handleChange}
            className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="available" className="ml-3 block text-sm font-medium text-gray-700">
            I am currently available to donate blood
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 ease-in-out mt-6"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterDonor;
