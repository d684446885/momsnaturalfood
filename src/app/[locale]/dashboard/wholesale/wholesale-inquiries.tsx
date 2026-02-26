"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

interface WholesaleProduct {
  id: string;
  productId: string;
  quantity: number;
}

interface WholesaleInquiry {
  id: string;
  fullName: string;
  contact: string;
  email: string | null;
  address: string;
  description: string | null;
  status: string;
  createdAt: string;
  products: WholesaleProduct[];
}

export default function WholesaleInquiries() {
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<WholesaleInquiry | null>(null);
  const [productNames, setProductNames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInquiries();
    fetchProducts();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/wholesale");
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      const names: Record<string, string> = {};
      data.products?.forEach((p: any) => {
        names[p.id] = p.name;
      });
      setProductNames(names);
    } catch (error) {
      console.error("Failed to load products");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/wholesale/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Status updated");
        fetchInquiries();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/admin/wholesale/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Inquiry deleted");
        fetchInquiries();
      } else {
        toast.error("Failed to delete inquiry");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Wholesale Inquiries</h1>
        <p className="text-muted-foreground">Manage wholesale inquiry submissions</p>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Products</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    No inquiries yet
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{inquiry.fullName}</td>
                    <td className="p-4">{inquiry.contact}</td>
                    <td className="p-4">{inquiry.email || "-"}</td>
                    <td className="p-4">{inquiry.products.length} items</td>
                    <td className="p-4">
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                        className={`px-2 py-1 rounded text-sm ${getStatusColor(inquiry.status)}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm">
                      {format(new Date(inquiry.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="p-2 hover:bg-muted rounded"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInquiry && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Inquiry Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="font-semibold">Full Name:</label>
                <p>{selectedInquiry.fullName}</p>
              </div>
              
              <div>
                <label className="font-semibold">Contact:</label>
                <p>{selectedInquiry.contact}</p>
              </div>
              
              {selectedInquiry.email && (
                <div>
                  <label className="font-semibold">Email:</label>
                  <p>{selectedInquiry.email}</p>
                </div>
              )}
              
              <div>
                <label className="font-semibold">Address:</label>
                <p>{selectedInquiry.address}</p>
              </div>
              
              {selectedInquiry.description && (
                <div>
                  <label className="font-semibold">Description:</label>
                  <p>{selectedInquiry.description}</p>
                </div>
              )}
              
              <div>
                <label className="font-semibold">Products:</label>
                <ul className="mt-2 space-y-2">
                  {selectedInquiry.products.map((p) => (
                    <li key={p.id} className="flex justify-between bg-muted p-2 rounded">
                      <span>{productNames[p.productId] || p.productId}</span>
                      <span className="font-semibold">Qty: {p.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <label className="font-semibold">Status:</label>
                <p className={`inline-block px-3 py-1 rounded mt-1 ${getStatusColor(selectedInquiry.status)}`}>
                  {selectedInquiry.status}
                </p>
              </div>
              
              <div>
                <label className="font-semibold">Submitted:</label>
                <p>{format(new Date(selectedInquiry.createdAt), "PPpp")}</p>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedInquiry(null)}
              className="mt-6 w-full py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
