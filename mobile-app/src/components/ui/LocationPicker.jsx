import React, { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const GEO_ERRORS = {
  1: 'Location permission was denied. Please allow access in your browser settings and try again.',
  2: 'Your position could not be determined. Check your device\'s location settings.',
  3: 'Location request timed out. Please try again.',
};

function LocationPicker({ onLocation, error: externalError }) {
  const [geoState, setGeoState] = useState('idle'); // 'idle' | 'loading' | 'granted' | 'denied'
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState(null);

  const handleGetLocation = async () => {
    setGeoState('loading');
    setGeoError(null);

    try {
      if (Capacitor.isNativePlatform()) {
        const hasPermission = await Geolocation.checkPermissions();
        if (hasPermission.location !== 'granted') {
          const request = await Geolocation.requestPermissions();
          if (request.location !== 'granted') {
            throw new Error('Location permission denied natively');
          }
        }
        
        const coordinates = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        const lat = coordinates.coords.latitude;
        const lng = coordinates.coords.longitude;
        setCoords({ lat, lng });
        setGeoState('granted');
        setGeoError(null);
        onLocation({ lat, lng });

      } else {
        if (!navigator.geolocation) {
          setGeoError('Geolocation is not supported by your browser.');
          setGeoState('denied');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: lat, longitude: lng } = position.coords;
            setCoords({ lat, lng });
            setGeoState('granted');
            setGeoError(null);
            onLocation({ lat, lng });
          },
          (err) => {
            const message = GEO_ERRORS[err.code] || 'An unknown error occurred while fetching location.';
            setGeoError(message);
            setGeoState('denied');
            onLocation(null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    } catch (err) {
      setGeoError(err.message || 'An unknown error occurred while fetching location.');
      setGeoState('denied');
      onLocation(null);
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 ml-1">
        Your Location
      </label>

      <div className={`w-full border rounded-xl transition-all overflow-hidden ${
        geoState === 'granted'
          ? 'border-green-300 bg-green-50'
          : geoState === 'denied'
          ? 'border-red-300 bg-red-50'
          : externalError
          ? 'border-red-500 bg-gray-50'
          : 'border-gray-200 bg-gray-50/50'
      }`}>
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={geoState === 'loading'}
          className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all disabled:cursor-not-allowed"
        >
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            geoState === 'granted' ? 'bg-green-200' : geoState === 'denied' ? 'bg-red-200' : 'bg-red-100'
          }`}>
            {geoState === 'loading' ? (
              <svg className="animate-spin w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : geoState === 'granted' ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            ) : geoState === 'denied' ? (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            {geoState === 'idle' && (
              <>
                <p className="font-semibold text-gray-800">Use My Current Location</p>
                <p className="text-xs text-gray-500 mt-0.5">Click to allow browser location access</p>
              </>
            )}
            {geoState === 'loading' && (
              <>
                <p className="font-semibold text-gray-700">Detecting location...</p>
                <p className="text-xs text-gray-500 mt-0.5">Please allow access in the browser prompt</p>
              </>
            )}
            {geoState === 'granted' && coords && (
              <>
                <p className="font-semibold text-green-700">Location Detected</p>
                <p className="text-xs text-green-600 font-mono mt-0.5">
                  {coords.lat.toFixed(5)}°N, {coords.lng.toFixed(5)}°E
                </p>
              </>
            )}
            {geoState === 'denied' && (
              <>
                <p className="font-semibold text-red-700">Location Unavailable — Tap to retry</p>
                <p className="text-xs text-red-500 mt-0.5">Check browser permissions and try again</p>
              </>
            )}
          </div>

          {/* Retry arrow for denied state */}
          {(geoState === 'idle' || geoState === 'denied') && (
            <svg className="flex-shrink-0 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Error messages */}
      {geoError && (
        <p className="text-red-600 text-xs font-bold mt-2 ml-1">{geoError}</p>
      )}
      {!geoError && externalError && (
        <p className="text-red-600 text-xs font-bold mt-2 ml-1">{externalError}</p>
      )}
    </div>
  );
}

export default LocationPicker;
