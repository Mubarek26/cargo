import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Package, MapPin, User, Scale, Calendar, FileText, ArrowRight, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orderService, CreateOrderPayload } from "@/services/orderService";
import { getCompanies } from "@/services/companyService";
import { contractService } from "@/services/contractService";
import { toast } from "sonner";
import { LocationPicker } from "@/components/LocationPicker";
import { getLandingPage } from "@/lib/auth-utils";

export default function CreateShipment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignmentMode: "OPEN_MARKETPLACE" as any,
    targetCompanyId: "",
    pickupAddress: "",
    pickupCity: "",
    pickupContactName: "",
    pickupContactPhone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryContactName: "",
    deliveryContactPhone: "",
    cargoType: "",
    cargoDescription: "",
    weightKg: "",
    quantity: "1",
    unit: "ITEM",
    vehicleType: "",
    pickupDate: "",
    deliveryDeadline: "",
    proposedBudget: "",
    currency: "ETB",
    paymentMethod: "BANK_TRANSFER",
    specialInstructions: "",
    pickupLat: null as number | null,
    pickupLng: null as number | null,
    deliveryLat: null as number | null,
    deliveryLng: null as number | null,
  });

  const [isPickupPickerOpen, setIsPickupPickerOpen] = useState(false);
  const [isDeliveryPickerOpen, setIsDeliveryPickerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");
      if (token) {
        try {
          if (userRole === "VENDOR") {
            const contractRes = await contractService.getVendorContracts();
            if (contractRes.status === "success") {
              const activeCompanies = contractRes.data.contracts
                .filter((c: any) => c.status === "ACCEPTED")
                .map((c: any) => c.transporterCompanyId)
                .filter(Boolean);
              setCompanies(activeCompanies);
            }
          } else {
            const res = await getCompanies(token);
            if (res.ok && res.data && (res.data as any).data) {
              setCompanies((res.data as any).data.companies || []);
            }
          }
        } catch (error) {
          console.error("Failed to fetch companies", error);
        }
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.pickupAddress || !formData.deliveryAddress || !formData.pickupDate || !formData.proposedBudget) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.pickupLat || !formData.pickupLng) {
      toast.error("Please select the pickup location from the map");
      return;
    }

    if (!formData.deliveryLat || !formData.deliveryLng) {
      toast.error("Please select the delivery location from the map");
      return;
    }

    setIsLoading(true);

    const payload: CreateOrderPayload = {
      title: formData.title,
      description: formData.description,
      assignmentMode: formData.assignmentMode,
      targetCompanyId: formData.assignmentMode === 'DIRECT_COMPANY' ? formData.targetCompanyId : undefined,
      pickupDate: formData.pickupDate,
      deliveryDeadline: formData.deliveryDeadline || undefined,
      proposedBudget: Number(formData.proposedBudget),
      currency: formData.currency,
      paymentMethod: formData.paymentMethod as any,
      pickupLocation: {
        address: formData.pickupAddress,
        city: formData.pickupCity,
        contactName: formData.pickupContactName,
        contactPhone: formData.pickupContactPhone,
        latitude: formData.pickupLat || undefined,
        longitude: formData.pickupLng || undefined,
      },
      deliveryLocation: {
        address: formData.deliveryAddress,
        city: formData.deliveryCity,
        contactName: formData.deliveryContactName,
        contactPhone: formData.deliveryContactPhone,
        latitude: formData.deliveryLat || undefined,
        longitude: formData.deliveryLng || undefined,
      },
      cargo: {
        type: formData.cargoType,
        description: formData.cargoDescription,
        weightKg: Number(formData.weightKg),
        quantity: Number(formData.quantity),
        unit: formData.unit as any,
      },
      vehicleRequirements: {
        vehicleType: formData.vehicleType,
      },
      specialInstructions: formData.specialInstructions,
    };

    try {
      await orderService.createOrder(payload);
      toast.success("Order created successfully");
      const userRole = localStorage.getItem("userRole");
      navigate(getLandingPage(userRole));
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Create Shipment</h1>
        <p className="text-muted-foreground">Enter shipment details to create a new order</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <FileText className="h-5 w-5 text-primary" />
              General Information
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Order Title *</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Weekly Food Distribution" 
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Additional details about the shipment..." 
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Assignment Mode</Label>
                  <Select 
                    value={formData.assignmentMode} 
                    onValueChange={(v) => handleSelectChange("assignmentMode", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN_MARKETPLACE">Open Marketplace</SelectItem>
                      <SelectItem value="DIRECT_COMPANY">Direct Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.assignmentMode === 'DIRECT_COMPANY' && (
                  <div className="space-y-2">
                    <Label>Target Company</Label>
                    <Select 
                      value={formData.targetCompanyId} 
                      onValueChange={(v) => handleSelectChange("targetCompanyId", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              Route Details
            </h3>
            <div className="grid gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Pickup Location</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pickupAddress" className="flex justify-between">
                      Address *
                      <Button 
                        type="button" 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-primary flex items-center gap-1"
                        onClick={() => setIsPickupPickerOpen(true)}
                      >
                        <MapPin className="h-3 w-3" />
                        {formData.pickupLat ? "Location Set" : "Pick from Map *"}
                      </Button>
                    </Label>
                    <Input 
                      id="pickupAddress" 
                      placeholder="Street address" 
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupCity">City</Label>
                    <Input 
                      id="pickupCity" 
                      placeholder="City" 
                      value={formData.pickupCity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupContactName">Contact Name</Label>
                    <Input 
                      id="pickupContactName" 
                      placeholder="Name" 
                      value={formData.pickupContactName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupContactPhone">Contact Phone</Label>
                    <Input 
                      id="pickupContactPhone" 
                      placeholder="Phone" 
                      value={formData.pickupContactPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Delivery Location</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress" className="flex justify-between">
                      Address *
                      <Button 
                        type="button" 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-primary flex items-center gap-1"
                        onClick={() => setIsDeliveryPickerOpen(true)}
                      >
                        <MapPin className="h-3 w-3" />
                        {formData.deliveryLat ? "Location Set" : "Pick from Map *"}
                      </Button>
                    </Label>
                    <Input 
                      id="deliveryAddress" 
                      placeholder="Street address" 
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryCity">City</Label>
                    <Input 
                      id="deliveryCity" 
                      placeholder="City" 
                      value={formData.deliveryCity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryContactName">Contact Name</Label>
                    <Input 
                      id="deliveryContactName" 
                      placeholder="Name" 
                      value={formData.deliveryContactName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryContactPhone">Contact Phone</Label>
                    <Input 
                      id="deliveryContactPhone" 
                      placeholder="Phone" 
                      value={formData.deliveryContactPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <Package className="h-5 w-5 text-primary" />
              Cargo Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="cargoType">Cargo Type</Label>
                <Input 
                  id="cargoType" 
                  placeholder="e.g. Perishables" 
                  value={formData.cargoType}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightKg">Weight (Kg)</Label>
                <Input 
                  id="weightKg" 
                  type="number" 
                  placeholder="0" 
                  value={formData.weightKg}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(v) => handleSelectChange("unit", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ITEM">Item</SelectItem>
                    <SelectItem value="BOX">Box</SelectItem>
                    <SelectItem value="PALLET">Pallet</SelectItem>
                    <SelectItem value="TON">Ton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cargoDescription">Contents Description</Label>
                <Input 
                  id="cargoDescription" 
                  placeholder="Brief description of contents" 
                  value={formData.cargoDescription}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="1" 
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Requirements */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <Scale className="h-5 w-5 text-primary" />
              Vehicle Requirements
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Required Vehicle Type</Label>
                <Input 
                  id="vehicleType" 
                  placeholder="e.g. Refrigerated Truck" 
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Dates */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <DollarSign className="h-5 w-5 text-primary" />
              Pricing & Schedule
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="proposedBudget">Proposed Budget *</Label>
                <Input 
                  id="proposedBudget" 
                  type="number" 
                  placeholder="0.00" 
                  value={formData.proposedBudget}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(v) => handleSelectChange("currency", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">ETB</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupDate">Pickup Date *</Label>
                <Input 
                  id="pickupDate" 
                  type="date" 
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDeadline">Delivery Deadline</Label>
                <Input 
                  id="deliveryDeadline" 
                  type="date" 
                  value={formData.deliveryDeadline}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea 
                  id="specialInstructions" 
                  placeholder="Any special handling requirements..." 
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={3} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-card-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Route</span>
                <span className="text-card-foreground font-medium text-xs text-right max-w-[150px] truncate">
                  {formData.pickupCity || "--"} <ArrowRight className="inline h-3 w-3" /> {formData.deliveryCity || "--"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Weight</span>
                <span className="text-card-foreground">{formData.weightKg || "0"} Kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Mode</span>
                <span className="text-card-foreground text-xs">{formData.assignmentMode.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-semibold">
                <span className="text-card-foreground">Budget</span>
                <span className="text-primary">{formData.proposedBudget || "0.00"} {formData.currency}</span>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full mt-4" 
              size="lg" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Create Shipment
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full mt-2" type="button" onClick={() => navigate("/orders")}>
              Cancel
            </Button>
          </div>
        </div>
      </form>

      <LocationPicker 
        isOpen={isPickupPickerOpen}
        onClose={() => setIsPickupPickerOpen(false)}
        onSelect={(lat, lng) => setFormData(prev => ({ ...prev, pickupLat: lat, pickupLng: lng }))}
        title="Pick Pickup Location"
        initialLocation={formData.pickupLat && formData.pickupLng ? { lat: formData.pickupLat, lng: formData.pickupLng } : undefined}
      />

      <LocationPicker 
        isOpen={isDeliveryPickerOpen}
        onClose={() => setIsDeliveryPickerOpen(false)}
        onSelect={(lat, lng) => setFormData(prev => ({ ...prev, deliveryLat: lat, deliveryLng: lng }))}
        title="Pick Delivery Location"
        initialLocation={formData.deliveryLat && formData.deliveryLng ? { lat: formData.deliveryLat, lng: formData.deliveryLng } : undefined}
      />
    </DashboardLayout>
  );
}
