import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Dashboard
import LiveShipmentMap from "./pages/dashboard/LiveShipmentMap";
import FleetStatus from "./pages/dashboard/FleetStatus";

// Shipments
import AllShipments from "./pages/shipments/AllShipments";
import TrackShipment from "./pages/shipments/TrackShipment";
import CreateShipment from "./pages/shipments/CreateShipment";
import DelayedShipments from "./pages/shipments/DelayedShipments";

// Fleet
import VehicleList from "./pages/fleet/VehicleList";
import MaintenanceLogs from "./pages/fleet/MaintenanceLogs";
import DriverAssignments from "./pages/fleet/DriverAssignments";

// Warehouses
import WarehouseLocations from "./pages/warehouses/WarehouseLocations";
import InventoryLevels from "./pages/warehouses/InventoryLevels";
import RestockRequests from "./pages/warehouses/RestockRequests";

// Vendors & Clients
import VendorDirectory from "./pages/vendors/VendorDirectory";
import AddVendor from "./pages/vendors/AddVendor";
import ClientsList from "./pages/clients/ClientsList";
import ClientFeedback from "./pages/clients/ClientFeedback";

// Orders
import AllOrders from "./pages/orders/AllOrders";
import ScheduledDeliveries from "./pages/orders/ScheduledDeliveries";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Index />} />
          
          {/* Dashboard */}
          <Route path="/dashboard/map" element={<LiveShipmentMap />} />
          <Route path="/dashboard/fleet-status" element={<FleetStatus />} />
          
          {/* Shipments */}
          <Route path="/shipments" element={<AllShipments />} />
          <Route path="/shipments/track" element={<TrackShipment />} />
          <Route path="/shipments/create" element={<CreateShipment />} />
          <Route path="/shipments/delayed" element={<DelayedShipments />} />
          
          {/* Fleet */}
          <Route path="/fleet/vehicles" element={<VehicleList />} />
          <Route path="/fleet/maintenance" element={<MaintenanceLogs />} />
          <Route path="/fleet/drivers" element={<DriverAssignments />} />
          
          {/* Warehouses */}
          <Route path="/warehouses" element={<WarehouseLocations />} />
          <Route path="/warehouses/inventory" element={<InventoryLevels />} />
          <Route path="/warehouses/restock" element={<RestockRequests />} />
          
          {/* Vendors & Clients */}
          <Route path="/vendors" element={<VendorDirectory />} />
          <Route path="/vendors/add" element={<AddVendor />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/feedback" element={<ClientFeedback />} />
          
          {/* Orders */}
          <Route path="/orders" element={<AllOrders />} />
          <Route path="/orders/scheduled" element={<ScheduledDeliveries />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
