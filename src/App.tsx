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
import VerifyEmail from "./pages/VerifyEmail";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import { ThemeProvider } from "./components/theme-provider";
import PaymentSuccess from "./pages/PaymentSuccess";

// Dashboard
import LiveShipmentMap from "./pages/dashboard/LiveShipmentMap";
import FleetStatus from "./pages/dashboard/FleetStatus";

// Shipments
import AllShipments from "./pages/shipments/AllShipments";
import TrackShipment from "./pages/shipments/TrackShipment";
import CreateShipment from "./pages/shipments/CreateShipment";
import DelayedShipments from "./pages/shipments/DelayedShipments";
import ShipperOrders from "./pages/shipper/ShipperOrders";
import ShipperOrderDetails from "./pages/shipper/ShipperOrderDetails";
import TripDetails from "./pages/trips/TripDetails";

// Fleet
import VehicleList from "./pages/fleet/VehicleList";
import MaintenanceLogs from "./pages/fleet/MaintenanceLogs";
import DriverList from "./pages/fleet/DriverList";
import Geofences from "./pages/fleet/Geofences";
import IdleDetection from "./pages/fleet/IdleDetection";


// Vendors & Clients
import VendorDirectory from "./pages/vendors/VendorDirectory";
import AddVendor from "./pages/vendors/AddVendor";
import ClientsList from "./pages/clients/ClientsList";
import ClientFeedback from "./pages/clients/ClientFeedback";
import CompanyDirectory from "./pages/companies/CompanyDirectory";
import Profile from "./pages/Profile";
import ApplicationsReview from "./pages/admin/ApplicationsReview";
import UserManagement from "./pages/admin/UserManagement";
import PricingConfig from "./pages/admin/PricingConfig";
import CommissionConfig from "./pages/admin/CommissionConfig";
import VendorContracts from "./pages/vendors/VendorContracts";
import CompanyContracts from "./pages/companies/CompanyContracts";
import CompanyDriverWallets from "./pages/admin/CompanyDriverWallets";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import OpenMarketplace from "./pages/marketplace/OpenMarketplace";
import MarketplaceOrderDetails from "./pages/marketplace/MarketplaceOrderDetails";

// Orders
import AllOrders from "./pages/orders/AllOrders";
import OrderDetails from "./pages/orders/OrderDetails";
import ScheduledDeliveries from "./pages/orders/ScheduledDeliveries";
import DriverTrips from "./pages/driver/DriverTrips";
import DriverTripDetails from "./pages/driver/DriverTripDetails";
import DriverWallet from "./pages/driver/DriverWallet";
import DriverReports from "./pages/driver/DriverReports";
import Transactions from "./pages/transactions/Transactions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="cargo-theme">
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
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />

            <Route element={<ProtectedRoute />}>
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "VENDOR"]} />}
              >
                <Route path="/home" element={<Index />} />
              </Route>

              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER", "DRIVER", "VENDOR"]} />}
              >
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Dashboard */}
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]} />}
              >
                <Route path="/dashboard/map" element={<LiveShipmentMap />} />
                <Route path="/dashboard/fleet-status" element={<FleetStatus />} />
              </Route>

              {/* Shipments */}
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER", "VENDOR"]} />}
              >
                <Route path="/shipments" element={<AllShipments />} />
                <Route path="/shipper/orders" element={<ShipperOrders />} />
                <Route path="/shipper/orders/:orderId" element={<ShipperOrderDetails />} />
                <Route path="/trips/:tripId" element={<TripDetails />} />
                <Route path="/shipments/track" element={<TrackShipment />} />
                <Route path="/shipments/create" element={<CreateShipment />} />
                <Route path="/shipments/delayed" element={<DelayedShipments />} />
              </Route>

              {/* Fleet */}
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]} />}
              >
                <Route path="/fleet/vehicles" element={<VehicleList />} />
                <Route path="/fleet/maintenance" element={<MaintenanceLogs />} />
                <Route path="/fleet/drivers" element={<DriverList />} />
                <Route path="/fleet/geofences" element={<Geofences />} />
                <Route path="/fleet/idle" element={<IdleDetection />} />
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
                <Route path="/analytics" element={<AnalyticsDashboard />} />
              </Route>

              {/* Companies */}
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]} />}
              >
                <Route path="/companies" element={<CompanyDirectory />} />
                <Route path="/companies/contracts" element={<CompanyContracts />} />
                <Route path="/company/drivers/wallets" element={<CompanyDriverWallets />} />
              </Route>

              {/* Applications */}
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}
              >
                <Route path="/applications" element={<ApplicationsReview />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/pricing-config" element={<PricingConfig />} />
                <Route path="/admin/commission-config" element={<CommissionConfig />} />
              </Route>

              {/* Marketplace */}
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER", "VENDOR", "DRIVER"]} />}
              >
                <Route path="/marketplace" element={<OpenMarketplace />} />
                <Route path="/marketplace/orders/:orderId" element={<MarketplaceOrderDetails />} />
              </Route>

              {/* Orders */}
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "VENDOR"]} />}
              >
                <Route path="/orders" element={<AllOrders />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
                <Route path="/orders/scheduled" element={<ScheduledDeliveries />} />
              </Route>

              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "DRIVER"]} />}
              >
                <Route path="/driver/trips" element={<DriverTrips />} />
                <Route path="/driver/trips/:tripId" element={<DriverTripDetails />} />
                <Route path="/driver/wallet" element={<DriverWallet />} />
                <Route path="/driver/reports" element={<DriverReports />} />
              </Route>

              {/* Transactions */}
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "SHIPPER"]} />}
              >
                <Route path="/transactions" element={<Transactions />} />
              </Route>

              {/* Payments */}
              <Route path="/payment/success" element={<PaymentSuccess />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
