"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  X,
  Eye,
  Trash2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface Quotation {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  requirement: string;
  deliveryDate: string;
  monthlyBill?: string;
  status: string;
  createdAt: string;
  batteryType?: string;
  grade?: string;
  cellCapacity?: string;
  bms?: string;
  enclosure?: string;
  dimensions?: string;
  waterproof?: string;
  quantity?: string;
}

const statusColors: Record<string, string> = {
  unopened: "bg-zinc-100 text-zinc-600 border-zinc-200",
  contacted: "bg-violet-50 text-violet-700 border-violet-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  work_in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  shipped: "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const statusLabels: Record<string, string> = {
  unopened: "Unopened",
  contacted: "Contacted",
  confirmed: "Confirmed",
  work_in_progress: "Work in Progress",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const serviceLabels: Record<string, string> = {
  pcb: "PCB Design",
  solar: "Solar",
  battery: "Battery",
};

const serviceColors: Record<string, string> = {
  pcb: "bg-red-50 text-red-700 border-red-200",
  solar: "bg-amber-50 text-amber-700 border-amber-200",
  battery: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const allStatuses = [
  "all",
  "unopened",
  "contacted",
  "confirmed",
  "work_in_progress",
  "shipped",
  "delivered",
  "cancelled",
];

const allServices = ["all", "pcb", "solar", "battery"];

export default function AdminQuotationsPage() {
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Quotation | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchQuotations = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (serviceFilter !== "all") params.set("service", serviceFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/quotations?${params}`);
      if (res.status === 401) {
        const slug = window.location.pathname.split("/")[1];
        router.push(`/${slug}`);
        return;
      }
      const data = await res.json();
      setQuotations(data.quotations ?? []);
      setPagination(data.pagination ?? { total: 0, page: 1, limit: 10, pages: 1 });
    } catch {
      console.error("Failed to fetch quotations");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, serviceFilter, search, router]);

  useEffect(() => {
    // Initial load from the API (external system).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQuotations(1);
  }, [fetchQuotations]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/quotations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setQuotations((prev) =>
          prev.map((q) => (q._id === id ? { ...q, status: newStatus } : q))
        );
        if (selected?._id === id) {
          setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch {
      console.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quotation? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/quotations/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setQuotations((prev) => prev.filter((q) => q._id !== id));
        setSelected(null);
      }
    } catch {
      console.error("Failed to delete quotation");
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Quotations</h1>
          <p className="text-sm text-zinc-500">
            {pagination.total} total quotations
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:outline-none w-48"
            />
          </div>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-red-500 focus:outline-none"
          >
            {allServices.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Services" : serviceLabels[s]}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-red-500 focus:outline-none"
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : statusLabels[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotations table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase hidden md:table-cell">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    Loading...
                  </td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    No quotations found
                  </td>
                </tr>
              ) : (
                quotations.map((q) => (
                  <tr
                    key={q._id}
                    className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer"
                    onClick={() => setSelected(q)}
                  >
                    <td className="px-4 py-3 text-zinc-900 font-medium">
                      {q.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          serviceColors[q.service] ?? "bg-zinc-100 text-zinc-600 border-zinc-200"
                        )}
                      >
                        {serviceLabels[q.service] ?? q.service}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 hidden sm:table-cell">
                      {q.email}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 hidden md:table-cell">
                      {q.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          statusColors[q.status]
                        )}
                      >
                        {statusLabels[q.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 hidden lg:table-cell">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(q);
                          }}
                          className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(q._id);
                          }}
                          className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchQuotations(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 disabled:opacity-30 hover:bg-zinc-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => fetchQuotations(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 disabled:opacity-30 hover:bg-zinc-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quotation Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Quotation Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Name", value: selected.name },
                { label: "Email", value: selected.email },
                { label: "Phone", value: selected.phone },
                { label: "Address", value: selected.address },
                {
                  label: "Service",
                  value: serviceLabels[selected.service] ?? selected.service,
                },
                ...(selected.monthlyBill
                  ? [{ label: "Monthly Bill (BDT)", value: selected.monthlyBill }]
                  : []),
                { label: "Requirements", value: selected.requirement },
                { label: "Delivery Date", value: selected.deliveryDate },
                {
                  label: "Submitted",
                  value: new Date(selected.createdAt).toLocaleString(),
                },
              ].map((field) => (
                <div key={field.label} className="group">
                  <label className="text-xs font-semibold text-zinc-400 uppercase">
                    {field.label}
                  </label>
                  <div className="mt-1 flex items-start gap-2">
                    <p className="flex-1 text-sm text-zinc-900 break-words whitespace-pre-wrap">
                      {field.value}
                    </p>
                    <button
                      onClick={() => handleCopy(field.value, field.label)}
                      className="shrink-0 rounded p-1 text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-900 transition-opacity"
                      title="Copy"
                    >
                      {copiedField === field.label ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* Status */}
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase">
                  Status
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allStatuses.filter((s) => s !== "all").map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusChange(selected._id, status)
                      }
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                        selected.status === status
                          ? statusColors[status]
                          : "border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600"
                      )}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selected._id)}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
