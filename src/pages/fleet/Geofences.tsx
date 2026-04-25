import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MapPin, Plus, Trash2, Shield, Map as MapIcon, Loader2, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { geofenceService } from "@/services/geofenceService";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";

const typeColors = {
  start: "bg-blue-500",
  destination: "bg-green-500",
  restricted: "bg-red-500",
  corridor: "bg-amber-500",
};

export default function Geofences() {
  const [geofences, setGeofences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create mode state
  const [isCreating, setIsCreating] = useState(false);
  const [newGf, setNewGf] = useState({
    name: "",
    type: "restricted",
    radius: 500,
    coordinates: [38.74, 9.03] as [number, number], // lon, lat
  });

  useEffect(() => {
    fetchGeofences();
  }, []);

  const fetchGeofences = async () => {
    try {
      const res = await geofenceService.getAllGeofences();
      if (res.status === "success") {
        setGeofences(res.data);
      }
    } catch (err) {
      toast.error("Failed to load geofences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this geofence?")) return;
    try {
      await geofenceService.deleteGeofence(id);
      toast.success("Geofence deleted");
      setGeofences(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      toast.error("Failed to delete geofence");
    }
  };

  const handleCreate = async () => {
    if (!newGf.name) return toast.error("Please provide a name");
    setIsSaving(true);
    try {
      const payload = {
        name: newGf.name,
        type: newGf.type,
        radius: newGf.radius,
        geometry: {
          type: "Point",
          coordinates: newGf.coordinates, // [lon, lat]
        },
      };
      await geofenceService.createGeofence(payload);
      toast.success("Geofence created successfully");
      setIsCreating(false);
      setNewGf({ name: "", type: "restricted", radius: 500, coordinates: [38.74, 9.03] });
      fetchGeofences();
    } catch (err) {
      toast.error("Failed to create geofence");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredGf = geofences.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Geofence Management</h1>
          <p className="text-muted-foreground">Define safety zones and route corridors</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          {isCreating ? "Cancel Creation" : "Create Geofence"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-border/50 shadow-xl h-[600px] flex flex-col">
            <div className="relative flex-1">
              <MapContainer 
                center={[9.03, 38.74]} 
                zoom={12} 
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {geofences.map((gf) => (
                  gf.geometry?.type === "Point" && (
                    <Circle 
                      key={gf._id}
                      center={[gf.geometry.coordinates[1], gf.geometry.coordinates[0]]}
                      radius={gf.radius || 500}
                      pathOptions={{ 
                        color: gf.type === 'restricted' ? '#ef4444' : '#3b82f6',
                        fillColor: gf.type === 'restricted' ? '#ef4444' : '#3b82f6',
                        fillOpacity: 0.2
                      }}
                    >
                      <Popup>
                        <div className="p-1">
                          <p className="font-bold">{gf.name}</p>
                          <p className="text-xs text-muted-foreground uppercase">{gf.type} Zone</p>
                        </div>
                      </Popup>
                    </Circle>
                  )
                ))}

                {isCreating && (
                  <Marker 
                    position={[newGf.coordinates[1], newGf.coordinates[0]]}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const marker = e.target;
                        const position = marker.getLatLng();
                        setNewGf(prev => ({ ...prev, coordinates: [position.lng, position.lat] }));
                      },
                    }}
                  />
                )}
                
                {isCreating && (
                   <Circle 
                    center={[newGf.coordinates[1], newGf.coordinates[0]]}
                    radius={newGf.radius}
                    pathOptions={{ color: '#f59e0b', dashArray: '5, 10' }}
                   />
                )}
              </MapContainer>
              
              {isCreating && (
                <div className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-md p-4 rounded-xl border border-border shadow-2xl w-72 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-warning">
                    <AlertCircle className="h-4 w-4" /> New Geofence
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Name</label>
                      <Input 
                        placeholder="Warehouse A Restricted..." 
                        className="h-8 text-xs"
                        value={newGf.name}
                        onChange={e => setNewGf(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Type</label>
                      <select 
                        className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                        value={newGf.type}
                        onChange={e => setNewGf(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="restricted">Restricted Zone</option>
                        <option value="start">Start Location</option>
                        <option value="destination">Destination</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Radius (meters): {newGf.radius}</label>
                      <input 
                        type="range" min="100" max="5000" step="100"
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        value={newGf.radius}
                        onChange={e => setNewGf(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="pt-2">
                      <Button className="w-full h-9 gap-2" onClick={handleCreate} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                        Save Geofence
                      </Button>
                      <p className="text-[9px] text-center mt-2 text-muted-foreground">Drag the blue marker to set center</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* List Section */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-xl h-[600px] flex flex-col">
            <CardHeader className="pb-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Geofence Inventory</CardTitle>
                  <CardDescription>Total: {geofences.length}</CardDescription>
                </div>
                <MapIcon className="h-5 w-5 text-primary/40" />
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search geofences..." 
                  className="pl-9 h-9 text-sm bg-background"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0 divide-y divide-border">
              {isLoading ? (
                <div className="py-20 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Syncing safety zones...</p>
                </div>
              ) : filteredGf.length === 0 ? (
                <div className="py-20 text-center px-6">
                  <Shield className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">No geofences found</p>
                  <p className="text-xs text-muted-foreground mt-1">Create your first safety zone to start monitoring</p>
                </div>
              ) : (
                filteredGf.map((gf) => (
                  <div key={gf._id} className="p-4 hover:bg-secondary/30 transition-colors group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${typeColors[gf.type as keyof typeof typeColors] || 'bg-primary'}`} />
                        <h4 className="font-bold text-sm text-foreground">{gf.name}</h4>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(gf._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <Badge variant="outline" className="text-[8px] font-bold h-4 uppercase">{gf.type}</Badge>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> 
                        {gf.radius}m Radius
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
