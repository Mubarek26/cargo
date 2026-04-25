import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle, Polygon, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { getRoadDistance } from "@/utils/distance";

// Custom icons for pickup and delivery
const pickupIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #3b82f6; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const deliveryIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #22c55e; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const truckIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #f59e0b; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

interface RouteMapProps {
  pickup: { lat: number; lng: number; address?: string };
  delivery: { lat: number; lng: number; address?: string };
  currentLocation?: { lat: number; lng: number };
  geofences?: any[];
  className?: string;
  onRouteCalculated?: (data: { distanceKm: number; durationMin: number }) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

function MapEvents({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onClick) onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

export function RouteMap({ pickup, delivery, currentLocation, geofences, className = "h-[300px] w-full", onRouteCalculated, onMapClick }: RouteMapProps) {
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const pickupPos: [number, number] = [pickup.lat, pickup.lng];
  const deliveryPos: [number, number] = [delivery.lat, delivery.lng];
  const currentPos: [number, number] | null = currentLocation ? [currentLocation.lat, currentLocation.lng] : null;
  
  const bounds = L.latLngBounds([pickupPos, deliveryPos]);
  if (currentPos) bounds.extend(currentPos);

  useEffect(() => {
    let isMounted = true;
    const fetchRoute = async () => {
      setIsLoading(true);
      const data = await getRoadDistance(pickup.lat, pickup.lng, delivery.lat, delivery.lng);
      if (isMounted && data) {
        setRouteGeometry(data.geometry);
        if (onRouteCalculated) {
          onRouteCalculated({ 
            distanceKm: data.distanceKm, 
            durationMin: data.durationMin 
          });
        }
      }
      if (isMounted) setIsLoading(false);
    };

    fetchRoute();
    return () => { isMounted = false; };
  }, [pickup.lat, pickup.lng, delivery.lat, delivery.lng]);

  return (
    <div className={`${className} rounded-xl border border-border overflow-hidden relative group`}>
      <MapContainer 
        bounds={bounds}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={pickupPos} icon={pickupIcon}>
          <Popup>
            <div className="font-semibold text-primary">Pickup Location</div>
            <div className="text-xs text-muted-foreground">{pickup.address}</div>
          </Popup>
        </Marker>

        {currentPos && (
          <Marker position={currentPos} icon={truckIcon}>
            <Popup>
              <div className="font-semibold text-warning text-center">Your Current Position</div>
              <div className="text-[10px] text-muted-foreground text-center">Updating via GPS...</div>
            </Popup>
          </Marker>
        )}
        
        <Marker position={deliveryPos} icon={deliveryIcon}>
          <Popup>
            <div className="font-semibold text-success">Delivery Destination</div>
            <div className="text-xs text-muted-foreground">{delivery.address}</div>
          </Popup>
        </Marker>

        {geofences?.map((gf) => (
          gf.geometry?.type === "Point" ? (
            <Circle 
              key={gf._id}
              center={[gf.geometry.coordinates[1], gf.geometry.coordinates[0]]}
              radius={gf.radius || 500}
              pathOptions={{ 
                color: gf.type === 'restricted' ? '#ef4444' : '#3b82f6',
                fillColor: gf.type === 'restricted' ? '#ef4444' : '#3b82f6',
                fillOpacity: 0.2,
                dashArray: gf.type === 'restricted' ? '5, 5' : '0'
              }}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-xs">{gf.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{gf.type} Zone</p>
                </div>
              </Popup>
            </Circle>
          ) : gf.geometry?.type === "Polygon" ? (
            <Polygon
              key={gf._id}
              positions={gf.geometry.coordinates[0].map((coord: [number, number]) => [coord[1], coord[0]])}
              pathOptions={{ 
                color: gf.type === 'restricted' ? '#ef4444' : '#3b82f6',
                fillOpacity: 0.2
              }}
            >
              <Popup>{gf.name}</Popup>
            </Polygon>
          ) : null
        ))}
        
        {routeGeometry.length > 0 ? (
          <Polyline 
            positions={routeGeometry} 
            color="#3b82f6" 
            weight={5}
            opacity={0.7}
          />
        ) : !isLoading && (
          // Fallback to straight line if routing fails
          <Polyline 
            positions={[pickupPos, deliveryPos]} 
            color="#94a3b8" 
            dashArray="10, 10" 
            weight={3}
          />
        )}
        
        <ChangeView bounds={bounds} />
        <MapEvents onClick={onMapClick} />
      </MapContainer>
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-[1000]">
          <div className="bg-background/80 px-4 py-2 rounded-full border border-border shadow-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]" />
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]" />
            <span className="text-xs font-medium">Calculating best route...</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm p-3 rounded-xl border border-border shadow-xl text-xs flex flex-col gap-2 transition-transform group-hover:scale-105">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-500 border-2 border-white" />
          <span className="font-medium text-foreground">Your Location (Live)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
          <span className="font-medium text-foreground">Pickup Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
          <span className="font-medium text-foreground">Delivery Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500 border-2 border-white border-dashed" />
          <span className="font-medium text-foreground">Restricted Zone</span>
        </div>
        <div className="pt-2 mt-1 border-t border-border flex items-center gap-2 text-primary font-bold">
          <div className="h-1 w-4 bg-primary rounded-full opacity-70" />
          <span>Optimal Road Route</span>
        </div>
      </div>
    </div>
  );
}
