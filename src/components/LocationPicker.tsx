import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, AlertCircle, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Fix for default marker icon in Leaflet + Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Ethiopia Geographical Bounding Box
const ETHIOPIA_BOUNDS = {
  minLat: 3.3896,
  maxLat: 15.0000,
  minLng: 32.9977,
  maxLng: 48.0000
};

const isInsideEthiopia = (lat: number, lng: number) => {
  return lat >= ETHIOPIA_BOUNDS.minLat && 
         lat <= ETHIOPIA_BOUNDS.maxLat && 
         lng >= ETHIOPIA_BOUNDS.minLng && 
         lng <= ETHIOPIA_BOUNDS.maxLng;
};

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
  title?: string;
}

// Component to programmatically control the map
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

function MapEvents({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({ isOpen, onClose, onSelect, initialLocation, title = "Select Location" }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [9.03, 38.74]
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [9.03, 38.74]
  );
  const [mapZoom, setMapZoom] = useState(initialLocation ? 13 : 6);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      const pos: [number, number] = [initialLocation.lat, initialLocation.lng];
      setPosition(pos);
      setMapCenter(pos);
      setMapZoom(13);
    }
  }, [initialLocation]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Restricted to Ethiopia (countrycodes=et)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=et&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
        
        if (isInsideEthiopia(newPos[0], newPos[1])) {
          setPosition(newPos);
          setMapCenter(newPos);
          setMapZoom(14);
          toast.success("Location found", {
            description: `Moved map to ${data[0].display_name.split(',')[0]}`
          });
        } else {
          toast.error("Location found outside Ethiopia", {
            description: "Please search for a location within Ethiopian borders."
          });
        }
      } else {
        toast.error("Location not found", {
          description: "Try a different city or place name in Ethiopia."
        });
      }
    } catch (error) {
      toast.error("Search failed", {
        description: "An error occurred while searching. Please try again."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = () => {
    if (position) {
      const [lat, lng] = position;
      
      if (!isInsideEthiopia(lat, lng)) {
        toast.error("Invalid Location", {
          description: "Please select a location within Ethiopia's borders.",
          duration: 4000,
        });
        return;
      }

      onSelect(lat, lng);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden border-none bg-transparent">
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 pb-4">
            <div className="flex items-center justify-between gap-6">
              <DialogTitle className="flex items-center gap-3 text-2xl font-black text-slate-900 shrink-0">
                <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                {title}
              </DialogTitle>

              {/* Search Bar */}
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </div>
                <Input
                  className="pl-12 pr-4 h-12 bg-slate-50 border-slate-100 rounded-2xl focus-visible:ring-primary focus-visible:bg-white transition-all font-medium text-slate-900"
                  placeholder="Search city, town, or place in Ethiopia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute right-2 top-1.5 h-9 rounded-xl text-xs font-bold text-primary hover:bg-primary/5"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  Find
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-8 pt-2">
            <div className="h-[450px] w-full rounded-[2rem] border-4 border-slate-50 overflow-hidden shadow-inner relative group">
              <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={mapCenter} zoom={mapZoom} />
                <MapEvents onClick={(lat, lng) => setPosition([lat, lng])} />
                {position && <Marker position={position} />}
              </MapContainer>

              {/* Ethiopia Region Indicator */}
              <div className="absolute top-6 right-6 z-[1000] bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Ethiopia Service Zone</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
              <div className="text-sm">
                {position ? (
                  <div className="space-y-1">
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Active Coordinates</p>
                    <p className="text-slate-900 font-black font-mono text-base">
                      {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-500 font-bold">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Click map or search above
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <Button variant="ghost" className="rounded-2xl font-black h-12 px-6" onClick={onClose}>Cancel</Button>
                <Button 
                  onClick={handleSave} 
                  disabled={!position}
                  className="rounded-2xl h-12 px-10 shadow-xl shadow-primary/25 font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirm Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
