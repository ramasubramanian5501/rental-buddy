import { motion } from "framer-motion";
import { Clock, MapPin, MoreVertical } from "lucide-react";

const rentals = [
  {
    id: "RNT-001",
    customer: "Rajesh Construction Co.",
    product: "JCB Excavator 3DX",
    startDate: "Dec 26, 2025",
    returnDate: "Dec 30, 2025",
    status: "active",
    location: "Andheri East, Mumbai",
    amount: "₹24,000",
  },
  {
    id: "RNT-002",
    customer: "Metro Builders Pvt Ltd",
    product: "Tower Crane TC-500",
    startDate: "Dec 25, 2025",
    returnDate: "Jan 05, 2026",
    status: "active",
    location: "BKC, Mumbai",
    amount: "₹1,85,000",
  },
  {
    id: "RNT-003",
    customer: "Sharma Developers",
    product: "Concrete Mixer CM-100",
    startDate: "Dec 24, 2025",
    returnDate: "Dec 28, 2025",
    status: "overdue",
    location: "Thane West",
    amount: "₹8,500",
  },
  {
    id: "RNT-004",
    customer: "BuildRight Infrastructure",
    product: "Boom Lift 60ft",
    startDate: "Dec 27, 2025",
    returnDate: "Dec 29, 2025",
    status: "pending",
    location: "Powai, Mumbai",
    amount: "₹15,000",
  },
];

const statusStyles = {
  active: "badge-success",
  overdue: "badge-destructive",
  pending: "badge-warning",
  completed: "badge-primary",
};

export function RecentRentals() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg">Recent Rentals</h2>
        <button className="text-sm text-accent hover:underline font-medium">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rental ID</th>
              <th>Customer</th>
              <th>Equipment</th>
              <th>Duration</th>
              <th>Location</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental, index) => (
              <motion.tr
                key={rental.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              >
                <td className="font-medium text-accent">{rental.id}</td>
                <td className="font-medium">{rental.customer}</td>
                <td className="text-muted-foreground">{rental.product}</td>
                <td>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {rental.startDate} - {rental.returnDate}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{rental.location}</span>
                  </div>
                </td>
                <td className="font-semibold">{rental.amount}</td>
                <td>
                  <span className={`badge ${statusStyles[rental.status as keyof typeof statusStyles]}`}>
                    {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                  </span>
                </td>
                <td>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
