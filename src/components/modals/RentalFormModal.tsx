import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Upload, Image, FileText, MapPin, Trash2 } from "lucide-react";
import { useCreateRental, uploadRentalFile } from "@/hooks/useRentals";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useVehicles, useDrivers } from "@/hooks/useFleet";
import { toast } from "sonner";

interface RentalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductSelection {
  product_id: string;
  quantity: number;
}

// Popular locations for quick selection
const SITE_LOCATIONS = [
  { name: "Andheri East, Mumbai", lat: 19.1136, lng: 72.8697 },
  { name: "Bandra West, Mumbai", lat: 19.0596, lng: 72.8295 },
  { name: "Powai, Mumbai", lat: 19.1176, lng: 72.9060 },
  { name: "Thane West", lat: 19.2183, lng: 72.9781 },
  { name: "Navi Mumbai", lat: 19.0330, lng: 73.0297 },
  { name: "Pune - Hinjewadi", lat: 18.5904, lng: 73.7389 },
  { name: "Pune - Kharadi", lat: 18.5535, lng: 73.9442 },
  { name: "Nashik", lat: 19.9975, lng: 73.7898 },
];

export function RentalFormModal({ isOpen, onClose }: RentalFormModalProps) {
  const createRental = useCreateRental();
  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts();
  const { data: vehicles = [] } = useVehicles();
  const { data: drivers = [] } = useDrivers();

  const documentInputRef = useRef<HTMLInputElement>(null);
  const loadPhotoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    customer_id: "",
    location: "",
    location_lat: null as number | null,
    location_lng: null as number | null,
    start_date: "",
    return_date: "",
    advance_percent: 10,
    vehicle_id: "",
    driver_id: "",
    driver_name: "",
    driver_phone: "",
  });

  const [selectedProducts, setSelectedProducts] = useState<ProductSelection[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [loadPhoto, setLoadPhoto] = useState<File | null>(null);
  const [loadPhotoPreview, setLoadPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total based on selected products, quantities, and duration
  useEffect(() => {
    if (formData.start_date && formData.return_date && selectedProducts.length > 0) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.return_date);
      const hours = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60)));

      const total = selectedProducts.reduce((sum, selection) => {
        const product = products.find((p) => p.id === selection.product_id);
        return sum + (product?.rent_per_hour || 0) * hours * selection.quantity;
      }, 0);

      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  }, [formData.start_date, formData.return_date, selectedProducts, products]);

  const advanceAmount = Math.round((totalAmount * formData.advance_percent) / 100);
  const remainingAmount = totalAmount - advanceAmount;

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = documents.length;
    const maxFiles = 10;
    const minFiles = 4;
    
    if (currentCount + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} documents allowed`);
      return;
    }
    
    setDocuments([...documents, ...files]);
  };

  const handleLoadPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoadPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoadPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (location: typeof SITE_LOCATIONS[0]) => {
    setFormData({
      ...formData,
      location: location.name,
      location_lat: location.lat,
      location_lng: location.lng,
    });
  };

  const handleProductToggle = (productId: string) => {
    const existing = selectedProducts.find(p => p.product_id === productId);
    if (existing) {
      setSelectedProducts(selectedProducts.filter(p => p.product_id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, { product_id: productId, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setSelectedProducts(selectedProducts.map(p => {
      if (p.product_id === productId) {
        const newQuantity = Math.max(1, Math.min(product.available_count, p.quantity + delta));
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    if (documents.length < 4) {
      toast.error("Please upload at least 4 document pages");
      return;
    }

    if (documents.length > 10) {
      toast.error("Maximum 10 document pages allowed");
      return;
    }

    setIsUploading(true);

    try {
      // Upload documents
      const documentUrls: string[] = [];
      for (const doc of documents) {
        const url = await uploadRentalFile(doc, 'documents');
        documentUrls.push(url);
      }

      // Upload load photo if exists
      let loadPhotoUrl: string | null = null;
      if (loadPhoto) {
        loadPhotoUrl = await uploadRentalFile(loadPhoto, 'load-photos');
      }

      await createRental.mutateAsync({
        rental: {
          customer_id: formData.customer_id,
          location: formData.location || null,
          location_lat: formData.location_lat,
          location_lng: formData.location_lng,
          start_date: new Date(formData.start_date).toISOString(),
          return_date: new Date(formData.return_date).toISOString(),
          advance_percent: formData.advance_percent,
          advance_amount: advanceAmount,
          total_amount: totalAmount,
          remaining_amount: remainingAmount,
          vehicle_id: formData.vehicle_id || null,
          driver_id: formData.driver_id || null,
          driver_name: formData.driver_name || null,
          driver_phone: formData.driver_phone || null,
          load_photo_url: loadPhotoUrl,
          document_urls: documentUrls,
          status: "pending",
        },
        productItems: selectedProducts,
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating rental:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: "",
      location: "",
      location_lat: null,
      location_lng: null,
      start_date: "",
      return_date: "",
      advance_percent: 10,
      vehicle_id: "",
      driver_id: "",
      driver_name: "",
      driver_phone: "",
    });
    setSelectedProducts([]);
    setDocuments([]);
    setLoadPhoto(null);
    setLoadPhotoPreview(null);
  };

  const availableProducts = products.filter((p) => p.available_count > 0);
  const totalProductsSelected = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl border border-border shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-xl font-bold">Create New Rental</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer *
                </label>
                <select
                  required
                  value={formData.customer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_id: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.company}
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Documents (4-10 pages) *
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <input
                    ref={documentInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <div className="text-center mb-3">
                    <button
                      type="button"
                      onClick={() => documentInputRef.current?.click()}
                      className="btn-secondary inline-flex items-center gap-2"
                      disabled={documents.length >= 10}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Documents
                    </button>
                    <p className="text-sm text-muted-foreground mt-1">
                      {documents.length}/10 pages uploaded (minimum 4 required)
                    </p>
                  </div>
                  {documents.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {documents.map((doc, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {doc.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Driver Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    value={formData.driver_name}
                    onChange={(e) =>
                      setFormData({ ...formData, driver_name: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter driver name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Driver Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.driver_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, driver_phone: e.target.value })
                    }
                    className="input-field"
                    placeholder="e.g., 9876543210"
                  />
                </div>
              </div>

              {/* Load Photo */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Image className="w-4 h-4 inline mr-2" />
                  Photo with Load
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <input
                    ref={loadPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLoadPhotoUpload}
                    className="hidden"
                  />
                  {loadPhotoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={loadPhotoPreview}
                        alt="Load preview"
                        className="max-h-40 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLoadPhoto(null);
                          setLoadPhotoPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => loadPhotoInputRef.current?.click()}
                      className="btn-secondary inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Load Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Site Location Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Site Location
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {SITE_LOCATIONS.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => handleLocationSelect(loc)}
                      className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                        formData.location === loc.name
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-muted border-border hover:border-accent"
                      }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value, location_lat: null, location_lng: null })
                  }
                  className="input-field"
                  placeholder="Or enter custom location"
                />
              </div>

              {/* Products Selection with Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Equipment Selection * ({totalProductsSelected} items selected)
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-border rounded-lg p-3">
                  {availableProducts.map((product) => {
                    const selection = selectedProducts.find(p => p.product_id === product.id);
                    const isSelected = !!selection;
                    
                    return (
                      <div
                        key={product.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isSelected ? "bg-accent/10 border border-accent" : "hover:bg-muted border border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleProductToggle(product.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <div className="flex-1">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({product.size_value} {product.size_unit})
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ₹{product.rent_per_hour}/hr
                        </span>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, -1)}
                              className="p-1 rounded bg-muted hover:bg-muted/80"
                              disabled={selection.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {selection.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, 1)}
                              className="p-1 rounded bg-muted hover:bg-muted/80"
                              disabled={selection.quantity >= product.available_count}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <span className="text-xs badge badge-success">
                          {product.available_count} avail
                        </span>
                      </div>
                    );
                  })}
                  {availableProducts.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No products available
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Return Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.return_date}
                    onChange={(e) =>
                      setFormData({ ...formData, return_date: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              {/* Vehicle & Driver Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Vehicle
                  </label>
                  <select
                    value={formData.vehicle_id}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle_id: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Select vehicle</option>
                    {vehicles
                      .filter((v) => v.status === "available")
                      .map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicle_number} - {vehicle.vehicle_type}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Assign Driver (from fleet)
                  </label>
                  <select
                    value={formData.driver_id}
                    onChange={(e) =>
                      setFormData({ ...formData, driver_id: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Select driver</option>
                    {drivers
                      .filter((d) => d.status === "available")
                      .map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} - {driver.phone}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Payment */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Advance Percentage
                </label>
                <div className="flex gap-2">
                  {[10, 20, 30, 50].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, advance_percent: percent })
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.advance_percent === percent
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {totalAmount > 0 && (
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Products Selected</span>
                    <span className="font-medium">{totalProductsSelected} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Advance ({formData.advance_percent}%)
                    </span>
                    <span className="font-medium text-success">
                      ₹{advanceAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-bold text-accent">
                      ₹{remainingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRental.isPending || isUploading}
                  className="flex-1 btn-accent"
                >
                  {isUploading ? "Uploading..." : createRental.isPending ? "Creating..." : "Create Rental"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}