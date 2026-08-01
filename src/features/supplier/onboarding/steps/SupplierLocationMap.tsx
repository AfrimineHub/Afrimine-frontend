import { useEffect } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

import { supplierMarkerIcon } from './leaflet';

interface SupplierLocationMapProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (latitude: number, longitude: number) => void;
}

const DEFAULT_POSITION: LatLngExpression = [6.5244, 3.3792];

interface MapClickHandlerProps {
  onLocationChange: (
    latitude: number,
    longitude: number,
  ) => void;
}

function MapClickHandler({onLocationChange,}:MapClickHandlerProps) {
  useMapEvents({
    click(event) {
      onLocationChange(
        event.latlng.lat,
        event.latlng.lng,
      );
    },
  });

  return null;
}


function MapCenterUpdater({
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }

    map.flyTo(
      [latitude, longitude],
      15,
      {
        animate: true,
        duration: 1,
      },
    );
  }, [latitude, longitude, map]);

  return null;
}


export function SupplierLocationMap({
  latitude,
  longitude,
  onLocationChange,
}: SupplierLocationMapProps) {
  const position: LatLngExpression =
    latitude != null && longitude != null
      ? [latitude, longitude]
      : DEFAULT_POSITION;


  return (
    <div className="h-72 overflow-hidden rounded-xl border border-slate-300">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onLocationChange={onLocationChange}
        />

        <MapCenterUpdater
          latitude={latitude}
          longitude={longitude}
        />

        {latitude != null && longitude != null && (
          <Marker
            position={[
              latitude,
              longitude,
            ]}
            icon={supplierMarkerIcon}
            draggable
            eventHandlers={{
              dragend(event) {
                const marker =
                  event.target;

                const location =
                  marker.getLatLng();

                onLocationChange(
                  location.lat,
                  location.lng,
                );
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}