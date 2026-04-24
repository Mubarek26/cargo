import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
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

interface RouteMapProps {
  pickup: { lat: number; lng: number; address?: string };
  delivery: { lat: number; lng: number; address?: string };
  className?: string;
  onRouteCalculated?: (data: { distanceKm: number; durationMin: number }) => void;
}

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

export function RouteMap({ pickup, delivery, className = "h-[300px] w-full", onRouteCalculated }: RouteMapProps) {
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const pickupPos: [number, number] = [pickup.lat, pickup.lng];
  const deliveryPos: [number, number] = [delivery.lat, delivery.lng];
  const bounds = L.latLngBounds([pickupPos, deliveryPos]);

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
        scrollWheelZoom={false}
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
        
        <Marker position={deliveryPos} icon={deliveryIcon}>
          <Popup>
            <div className="font-semibold text-success">Delivery Destination</div>
            <div className="text-xs text-muted-foreground">{delivery.address}</div>
          </Popup>
        </Marker>
        
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
          <div className="h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
          <span className="font-medium text-foreground">Pickup Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
          <span className="font-medium text-foreground">Delivery Location</span>
        </div>
        <div className="pt-2 mt-1 border-t border-border flex items-center gap-2 text-primary font-bold">
          <div className="h-1 w-4 bg-primary rounded-full opacity-70" />
          <span>Optimal Road Route</span>
        </div>
      </div>
    </div>
  );
}
