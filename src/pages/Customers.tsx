import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  User,
  Phone,
  Building2,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  MapPin,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  aadhaarNumber: string;
  panNumber: string;
  company: string;
  totalRentals: number;
  activeRentals: number;
  totalSpent: number;
  lastRental?: string;
  address?: string;
}

const sampleCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@construction.com",
    aadhaarNumber: "XXXX XXXX 1234",
    panNumber: "ABCDE1234F",
    company: "Rajesh Construction Co.",
    totalRentals: 24,
    activeRentals: 2,
    totalSpent: 485000,
    lastRental: "2025-12-26",
    address: "Andheri East, Mumbai",
  },
  {
    id: "CUST-002",
    name: "Vikram Sharma",
    phone: "+91 87654 32109",
    email: "vikram@metrobuilders.com",
    aadhaarNumber: "XXXX XXXX 5678",
    panNumber: "FGHIJ5678K",
    company: "Metro Builders Pvt Ltd",
    totalRentals: 18,
    activeRentals: 1,
    totalSpent: 725000,
    lastRental: "2025-12-25",
    address: "BKC, Mumbai",
  },
  {
    id: "CUST-003",
    name: "Priya Sharma",
    phone: "+91 76543 21098",
    aadhaarNumber: "XXXX XXXX 9012",
    panNumber: "LMNOP9012Q",
    company: "Sharma Developers",
    totalRentals: 8,
    activeRentals: 1,
    totalSpent: 125000,
    lastRental: "2025-12-24",
    address: "Thane West",
  },
  {
    id: "CUST-004",
    name: "Arun Mehta",
    phone: "+91 65432 10987",
    email: "arun@buildright.com",
    aadhaarNumber: "XXXX XXXX 3456",
    panNumber: "RSTUV3456W",
    company: "BuildRight Infrastructure",
    totalRentals: 12,
    activeRentals: 1,
    totalSpent: 280000,
    lastRental: "2025-12-27",
    address: "Powai, Mumbai",
  },
  {
    id: "CUST-005",
    name: "Sunita Patel",
    phone: "+91 54321 09876",
    aadhaarNumber: "XXXX XXXX 7890",
    panNumber: "XYZAB7890C",
    company: "Patel Construction",
    totalRentals: 32,
    activeRentals: 0,
    totalSpent: 890000,
    lastRental: "2025-12-25",
    address: "Navi Mumbai",
  },
];

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers] = useState<Customer[]>(sampleCustomers);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  return (
    <MainLayout>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer information and documents
          </p>
        </div>
        <button className="btn-accent">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, company, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Documents</th>
                <th>Rentals</th>
                <th>Total Spent</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{customer.company}</p>
                        {customer.address && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {customer.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p>Aadhaar: {customer.aadhaarNumber}</p>
                        <p>PAN: {customer.panNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-semibold">{customer.totalRentals}</p>
                      {customer.activeRentals > 0 && (
                        <p className="text-xs text-success">
                          {customer.activeRentals} active
                        </p>
                      )}
                    </div>
                  </td>
                  <td>
                    <p className="font-bold text-accent">
                      ₹{customer.totalSpent.toLocaleString()}
                    </p>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <User className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No customers found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria
          </p>
          <button className="btn-accent">
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Customers;
