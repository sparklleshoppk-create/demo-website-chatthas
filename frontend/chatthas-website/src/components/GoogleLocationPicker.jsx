import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FaLocationArrow, FaSearch, FaSpinner } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = { lat: 33.6844, lng: 73.0479 }; // F-10, Islamabad

// Custom gold map pin SVG matching Chattha's branding
const goldIcon = L.icon({
  iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="38" height="38">
      <path fill="#D4AF37" stroke="#ffffff" stroke-width="1" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

export default function GoogleLocationPicker({ position, onPositionChange, className = '' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [resolvedLabel, setResolvedLabel] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Reverse geocoding helper (Nominatim API)
  const reverseGeocode = useCallback(
    async (lat, lng) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
        );
        const data = await res.json();
        if (data && data.display_name) {
          const formatted = data.display_name;
          setResolvedLabel(formatted);
          onPositionChange(
            { lat, lng },
            {
              formatted_address: formatted,
              address_components: data.address,
              place_id: data.place_id ? String(data.place_id) : '',
            }
          );
        } else {
          const fallbackLabel = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setResolvedLabel(fallbackLabel);
          onPositionChange({ lat, lng }, { formatted_address: fallbackLabel });
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        const fallbackLabel = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setResolvedLabel(fallbackLabel);
        onPositionChange({ lat, lng }, { formatted_address: fallbackLabel });
      }
    },
    [onPositionChange]
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter = position || DEFAULT_CENTER;
    const initialZoom = position ? 17 : 13;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([initialCenter.lat, initialCenter.lng], initialZoom);

    // Apply Premium Dark Matter Theme Map Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;

    // Force Leaflet to calculate correct container size after rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
    setTimeout(() => {
      map.invalidateSize();
    }, 500);

    // Tap map to set/move pin
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], {
          icon: goldIcon,
          draggable: true,
        }).addTo(map);

        markerRef.current.on('dragend', (evt) => {
          const newPos = evt.target.getLatLng();
          reverseGeocode(newPos.lat, newPos.lng);
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }
      
      reverseGeocode(lat, lng);
    });

    // Create marker if position is already selected
    if (position) {
      markerRef.current = L.marker([position.lat, position.lng], {
        icon: goldIcon,
        draggable: true,
      }).addTo(map);

      markerRef.current.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        reverseGeocode(lat, lng);
      });
    }

    // Trigger reverse-geocoding if position is passed but no label is resolved
    if (position && !resolvedLabel) {
      reverseGeocode(position.lat, position.lng);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Invalidate map size on mount/resize to fix grey screen inside dynamic modal
  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 150);
    const timer2 = setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Update map when position prop changes externally (e.g. from search result)
  useEffect(() => {
    if (!mapRef.current) return;
    const currentCenter = mapRef.current.getCenter();
    const targetCenter = position || DEFAULT_CENTER;
    
    const dist = mapRef.current.distance(
      [currentCenter.lat, currentCenter.lng],
      [targetCenter.lat, targetCenter.lng]
    );

    if (position) {
      if (!markerRef.current) {
        markerRef.current = L.marker([position.lat, position.lng], {
          icon: goldIcon,
          draggable: true,
        }).addTo(mapRef.current);

        markerRef.current.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          reverseGeocode(lat, lng);
        });
      } else {
        const currentMarkerLatLng = markerRef.current.getLatLng();
        const markerDist = mapRef.current.distance(
          [currentMarkerLatLng.lat, currentMarkerLatLng.lng],
          [position.lat, position.lng]
        );
        if (markerDist > 1) {
          markerRef.current.setLatLng([position.lat, position.lng]);
        }
      }

      if (dist > 50) {
        mapRef.current.setView([position.lat, position.lng], 17);
      }
    }
  }, [position]);

  // Handle Autocomplete / Nominatim Search with Debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&countrycodes=pk&limit=5&accept-language=en`
        );
        const data = await res.json();
        setSearchResults(
          data.map((item) => ({
            label: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            place_id: item.place_id ? String(item.place_id) : '',
            address: item.address || {},
          }))
        );
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchResultClick = (result) => {
    const { lat, lng, label, place_id, address } = result;
    setSearchQuery('');
    setSearchResults([]);
    setResolvedLabel(label);

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 17);
      
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng], {
          icon: goldIcon,
          draggable: true,
        }).addTo(mapRef.current);

        markerRef.current.on('dragend', (e) => {
          const newPos = e.target.getLatLng();
          reverseGeocode(newPos.lat, newPos.lng);
        });
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }
    }

    onPositionChange(
      { lat, lng },
      {
        formatted_address: label,
        address_components: address,
        place_id: place_id,
      }
    );
  };

  // Get user location using standard Geolocation API
  const locateUser = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsLocating(false);
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 17);
        }
        reverseGeocode(lat, lng);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setIsLocating(false);
        alert('Could not retrieve your location. Please check your browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      {/* Styles to dark-theme Leaflet's UI widgets */}
      <style>{`
        .leaflet-container {
          background: #121212 !important;
        }
        .leaflet-control-zoom a {
          background-color: #1f1f1f !important;
          color: #D4AF37 !important;
          border-bottom: 1px solid #2e2e2e !important;
          transition: all 0.2s ease;
        }
        .leaflet-control-zoom a:hover {
          background-color: #D4AF37 !important;
          color: #121212 !important;
        }
        .leaflet-bar {
          border: 1px solid rgba(212,175,55,0.3) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
        }
        .leaflet-control-zoom-in {
          border-top-left-radius: 4px !important;
          border-top-right-radius: 4px !important;
        }
        .leaflet-control-zoom-out {
          border-bottom-left-radius: 4px !important;
          border-bottom-right-radius: 4px !important;
        }
      `}</style>

      {/* Header with Search and Current Location button */}
      <div className="flex flex-col sm:flex-row gap-2 p-3 bg-primary-black border-b border-dark-border shrink-0 z-[101]">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40 z-10 pointer-events-none" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults.length > 0) {
                e.preventDefault();
                handleSearchResultClick(searchResults[0]);
              }
            }}
            placeholder="Search street, sector, or landmark in Pakistan…"
            className="w-full bg-charcoal border border-dark-border rounded-[4px] pl-10 pr-10 py-3 text-cream font-body text-sm focus:border-gold-500 outline-none"
          />
          {isSearching && (
            <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500 animate-spin" size={14} />
          )}

          {/* Autocomplete Dropdown List */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-charcoal border border-dark-border rounded-[4px] shadow-2xl z-[999] max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full text-left px-4 py-3 text-xs text-cream hover:bg-gold-500/10 hover:text-gold-500 border-b border-dark-border last:border-b-0 transition-all font-body"
                >
                  {result.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={locateUser}
          disabled={isLocating}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-charcoal border border-gold-500/40 text-gold-500 text-[11px] uppercase tracking-wider font-bold hover:bg-gold-500/10 transition-colors shrink-0 disabled:opacity-55 cursor-pointer"
        >
          {isLocating ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaLocationArrow />
          )}
          {isLocating ? 'Locating...' : 'Use my location'}
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-1 min-h-[55vh] relative z-10">
        <div ref={mapContainerRef} className="w-full h-full min-h-[55vh]" />
        <p className="absolute bottom-3 left-3 right-3 z-[100] pointer-events-none text-center text-[10px] text-cream/80 bg-primary-black/85 backdrop-blur-sm py-2 px-3 rounded-sm border border-dark-border">
          Tap the map or drag the pin to set your exact delivery point
        </p>
      </div>

      {/* Footer Address Display */}
      {resolvedLabel && (
        <div className="shrink-0 p-3 bg-charcoal border-t border-dark-border">
          <p className="text-[10px] text-gold-500 uppercase tracking-widest font-bold mb-1">Selected Location</p>
          <p className="text-sm text-cream/90 font-body leading-relaxed">{resolvedLabel}</p>
        </div>
      )}
    </div>
  );
}
