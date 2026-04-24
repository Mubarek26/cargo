import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompanyAdminRequest from "./pages/CompanyAdminRequest";
import CompanyAdminReview from "./pages/CompanyAdminReview";
import DriverApplication from "./pages/DriverApplication";
import VendorApplication from "./pages/VendorApplication";
import DriverApplicationReview from "./pages/DriverApplicationReview";
import VendorApplicationReview from "./pages/VendorApplicationReview";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboard
import LiveShipmentMap from "./pages/dashboard/LiveShipmentMap";
import FleetStatus from "./pages/dashboard/FleetStatus";

// Shipments
import AllShipments from "./pages/shipments/AllShipments";
import TrackShipment from "./pages/shipments/TrackShipment";
import CreateShipment from "./pages/shipments/CreateShipment";
import DelayedShipments from "./pages/shipments/DelayedShipments";
import TripDetails from "./pages/trips/TripDetails";

// Fleet
import VehicleList from "./pages/fleet/VehicleList";
import MaintenanceLogs from "./pages/fleet/MaintenanceLogs";
import DriverList from "./pages/fleet/DriverList";

// Warehouses
import WarehouseLocations from "./pages/warehouses/WarehouseLocations";
import InventoryLevels from "./pages/warehouses/InventoryLevels";
import RestockRequests from "./pages/warehouses/RestockRequests";

// Vendors & Clients
import VendorDirectory from "./pages/vendors/VendorDirectory";
import AddVendor from "./pages/vendors/AddVendor";
import ClientsList from "./pages/clients/ClientsList";
import ClientFeedback from "./pages/clients/ClientFeedback";
import CompanyDirectory from "./pages/companies/CompanyDirectory";
import Profile from "./pages/Profile";
import ApplicationsReview from "./pages/admin/ApplicationsReview";
import UserManagement from "./pages/admin/UserManagement";
import VendorContracts from "./pages/vendors/VendorContracts";
import CompanyContracts from "./pages/companies/CompanyContracts";
import OpenMarketplace from "./pages/marketplace/OpenMarketplace";
import MarketplaceOrderDetails from "./pages/marketplace/MarketplaceOrderDetails";

// Orders
import AllOrders from "./pages/orders/AllOrders";
import OrderDetails from "./pages/orders/OrderDetails";
import ScheduledDeliveries from "./pages/orders/ScheduledDeliveries";
import DriverTrips from "./pages/driver/DriverTrips";
import DriverTripDetails from "./pages/driver/DriverTripDetails";

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
          <Route path="/company-admin-request" element={<CompanyAdminRequest />} />
          <Route path="/company-admin-review" element={<CompanyAdminReview />} />
          <Route path="/driver-application" element={<DriverApplication />} />
          <Route path="/vendor-application" element={<VendorApplication />} />
          <Route path="/driver-application-review" element={<DriverApplicationReview />} />
          <Route path="/vendor-application-review" element={<VendorApplicationReview />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Index />} />
            <Route path="/profile" element={<Profile />} />

            {/* Dashboard */}
            <Route
              element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER", "DRIVER"]} />}
            >
              <Route path="/dashboard/map" element={<LiveShipmentMap />} />
              <Route path="/dashboard/fleet-status" element={<FleetStatus />} />
            </Route>

            {/* Shipments */}
            <Route
              element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER", "DRIVER", "VENDOR"]} />}
            >
              <Route path="/shipments" element={<AllShipments />} />
              <Route path="/trips/:tripId" element={<TripDetails />} />
              <Route path="/shipments/track" element={<TrackShipment />} />
              <Route path="/shipments/create" element={<CreateShipment />} />
              <Route path="/shipments/delayed" element={<DelayedShipments />} />
            </Route>

            {/* Fleet */}
            <Route
              element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "DRIVER"]} />}
            >
              <Route path="/fleet/vehicles" element={<VehicleList />} />
              <Route path="/fleet/maintenance" element={<MaintenanceLogs />} />
              <Route path="/fleet/drivers" element={<DriverList />} />
            </Route>

            {/* Warehouses */}
            <Route
              element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER"]} />}
            >
              <Route path="/warehouses" element={<WarehouseLocations />} />
              <Route path="/warehouses/inventory" element={<InventoryLevels />} />
              <Route path="/warehouses/restock" element={<RestockRequests />} />
            </Route>

            {/* Vendors & Clients */}
            <Route
              element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "VENDOR"]} />}
            >
              <Route path="/vendors" element={<VendorDirectory />} />
              <Route path="/vendors/add" element={<AddVendor />} />
              <Route path="/vendors/contracts" element={<VendorContracts />} />
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/feedback" element={<ClientFeedback />} />
            </Route>

            {/* Companies */}
            <Route
              element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]} />}
            >
              <Route path="/companies" element={<CompanyDirectory />} />
              <Route path="/companies/contracts" element={<CompanyContracts />} />
            </Route>

            {/* Applications */}
            <Route
              element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}
            >
              <Route path="/applications" element={<ApplicationsReview />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>

            {/* Orders */}
            <Route
              element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER", "VENDOR"]} />}
            >
              <Route path="/orders" element={<AllOrders />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/orders/scheduled" element={<ScheduledDeliveries />} />
              <Route path="/marketplace" element={<OpenMarketplace />} />
              <Route path="/marketplace/orders/:orderId" element={<MarketplaceOrderDetails />} />
            </Route>

            <Route
              element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "DRIVER", "PRIVATE_TRANSPORTER"]} />}
            >
              <Route path="/driver/trips" element={<DriverTrips />} />
              <Route path="/driver/trips/:tripId" element={<DriverTripDetails />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
