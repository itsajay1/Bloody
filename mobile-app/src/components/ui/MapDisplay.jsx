import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map bounds when donors change
const BoundsUpdater = ({ centerLocation, donors }) => {
  const map = useMap();

  useEffect(() => {
    if (donors && donors.length > 0 && centerLocation) {
      const bounds = L.latLngBounds([centerLocation.lat, centerLocation.lng], [centerLocation.lat, centerLocation.lng]);
      donors.forEach(donor => {
        if (donor.location && donor.location.lat && donor.location.lng) {
          bounds.extend([donor.location.lat, donor.location.lng]);
        }
      });
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (centerLocation) {
      map.setView([centerLocation.lat, centerLocation.lng], 12);
    }
  }, [map, centerLocation, donors]);

  return null;
};

const MapDisplay = ({ centerLocation, donors = [] }) => {
  const mapCenter = centerLocation ? [centerLocation.lat, centerLocation.lng] : [27.7172, 85.324];

  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-inner border border-gray-200" style={{ zIndex: 0 }}>
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        <BoundsUpdater centerLocation={centerLocation} donors={donors} />

        {/* Requester Marker */}
        {centerLocation && (
          <Marker position={[centerLocation.lat, centerLocation.lng]} icon={redIcon}>
            <Popup>
              <div className="text-gray-900 font-bold p-1 text-center">
                <p className="text-xs font-black text-red-600 uppercase tracking-wider mb-1">Emergency Here</p>
                <p className="text-[10px] text-gray-500 m-0">Center of radius</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Nearby Donors Markers */}
        {donors.map((donor, idx) => {
          if (!donor.location || !donor.location.lat || !donor.location.lng) return null;

          return (
            <Marker
              key={donor._id || idx}
              position={[donor.location.lat, donor.location.lng]}
              icon={blueIcon}
            >
              <Popup>
                <div className="text-gray-900 font-bold p-1 text-center">
                  <p className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Matched Donor</p>
                  <p className="text-[10px] text-gray-800 m-0 mb-1">{donor.name} • {donor.bloodGroup}</p>
                  <p className="text-[10px] text-gray-500 m-0">{donor.distance ? `${donor.distance.toFixed(1)} km away` : 'Nearby'}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default React.memo(MapDisplay);
