import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem',
};

const MapDisplay = ({ centerLocation, donors = [] }) => {
  const [activeMarker, setActiveMarker] = React.useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'PLACEHOLDER_KEY'
  });

  // Calculate bounding bounds to fit both requester and donors inside the map view
  const mapCenter = useMemo(() => {
    return centerLocation ? { lat: centerLocation.lat, lng: centerLocation.lng } : { lat: 27.7172, lng: 85.324 }; // Defaults to Kathmandu
  }, [centerLocation]);

  const onLoad = React.useCallback((map) => {
    if (donors.length > 0 && centerLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(centerLocation.lat, centerLocation.lng));
      donors.forEach(donor => {
        if (donor.location && donor.location.lat && donor.location.lng) {
            bounds.extend(new window.google.maps.LatLng(donor.location.lat, donor.location.lng));
        }
      });
      // Add a little padding constraint so markers aren't pinned to the exact edge
      map.fitBounds(bounds, 50); 
    }
  }, [centerLocation, donors]);

  if (!isLoaded) return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-3xl animate-pulse">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Mapping Subsystem...</p>
    </div>
  );

  return (
    <div className="w-full h-full rounded-[1.5rem] overflow-hidden shadow-inner border border-gray-200">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={12}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [{"color": "#7c93a3"},{"lightness": "-10"}]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [{"color": "#e9e9e9"},{"lightness": "17"}]
            }
          ]
        }}
      >
        {/* Requester Marker (Red, Default) */}
        {centerLocation && (
          <Marker
            position={{ lat: centerLocation.lat, lng: centerLocation.lng }}
            icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
            onClick={() => setActiveMarker('requester')}
          >
            {activeMarker === 'requester' && (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="text-gray-900 font-bold p-1">
                  <p className="text-xs font-black text-red-600 uppercase tracking-wider mb-1">Emergency Here</p>
                  <p className="text-[10px] text-gray-500">Center of radius</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}

        {/* Nearby Donors Markers (Blue) */}
        {donors.map((donor, idx) => {
            if (!donor.location || !donor.location.lat || !donor.location.lng) return null;
            
            return (
                <Marker
                    key={donor._id || idx}
                    position={{ lat: donor.location.lat, lng: donor.location.lng }}
                    icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                    onClick={() => setActiveMarker(donor._id)}
                >
                    {activeMarker === donor._id && (
                    <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                        <div className="text-gray-900 font-bold p-1">
                        <p className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Matched Donor</p>
                        <p className="text-[10px] text-gray-800">{donor.name} • {donor.bloodGroup}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{donor.distance ? `${donor.distance.toFixed(1)} km away` : 'Nearby'}</p>
                        </div>
                    </InfoWindow>
                    )}
                </Marker>
            );
        })}
      </GoogleMap>
    </div>
  );
};

export default React.memo(MapDisplay);
