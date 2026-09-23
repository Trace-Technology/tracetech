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
import {
  standardTariffs,
  cityCorporationTariffs,
  solarEstimateForBills,
  formatNumber,
} from "@/lib/solar";

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
  monthlyBills?: string[];
  cityCorporation?: boolean;
  solarPercent?: number;
  status: string;
  createdAt: string;
  batteryType?: string;
  grade?: string;
  cellCapacity?: string;
  bms?: string;
  enclosure?: string;
  dimLength?: string;
  dimWidth?: string;
  dimHeight?: string;
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

/* Detail modal shows every submitted field generically — no handpicking. */
const detailFieldLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  address: "Address",
  service: "Service",
  monthlyBill: "Monthly Bill (BDT)",
  monthlyBills: "Monthly Bills (BDT)",
  cityCorporation: "City Corporation Area",
  solarPercent: "Solar Offset Target",
  requirement: "Requirements",
  deliveryDate: "Delivery Date",
  batteryType: "Battery Type",
  grade: "Cell Grade",
  cellCapacity: "Cell Capacity",
  bms: "BMS",
  enclosure: "Enclosure",
  dimLength: "Length (mm)",
  dimWidth: "Width (mm)",
  dimHeight: "Height (mm)",
  dimensions: "Dimensions",
  waterproof: "Waterproof",
  quantity: "Quantity",
};

/* Internal / separately-rendered keys never listed as submission fields. */

function detailLabel(key: string) {
  return (
    detailFieldLabels[key] ??
    key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
  );
}

function detailValue(key: string, value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const str = String(value);
  if (key === "service") return serviceLabels[str] ?? str;
  if (key === "solarPercent") return `${str}%`;
  return str;
}

/* Keys rendered by the read-only form mirror below (plus internal keys).
   Anything else on the record falls through to "Additional details". */
const coveredDetailKeys = new Set([
  "_id",
  "__v",
  "status",
  "createdAt",
  "updatedAt",
  "name",
  "phone",
  "email",
  "address",
  "service",
  "requirement",
  "deliveryDate",
  "monthlyBill",
  "monthlyBills",
  "cityCorporation",
  "solarPercent",
  "batteryType",
  "grade",
  "cellCapacity",
  "bms",
  "enclosure",
  "dimLength",
  "dimWidth",
  "dimHeight",
  "dimensions",
  "waterproof",
  "quantity",
]);

function batteryQtyText(qty?: string) {
  const raw = qty ?? "1";
  const n = parseInt(raw, 10);
  return `${raw}${Number.isNaN(n) || n <= 1 ? " pc" : " pcs"}`;
}

/* Read-only mirror of the get-quote form controls. */
function ReadonlyField({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="group">
      <label className="text-xs font-semibold text-zinc-400 uppercase">{label}</label>
      <div className="mt-1 flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="flex-1 text-sm text-zinc-900 break-words whitespace-pre-wrap">
          {value}
        </p>
        <button
          onClick={onCopy}
          className="shrink-0 rounded p-1 text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-900 transition-opacity"
          title="Copy"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="shrink-0 font-medium text-zinc-700">{value}</dd>
    </div>
  );
}

function EstimateMetric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold ${highlight ? "text-emerald-700" : "text-zinc-900"}`}
      >
        {value}
      </p>
    </div>
  );
}

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

  /* Read-only mirror of the get-quote sections for the open quotation. */
  const solarView = selected?.service === "solar";
  const batteryView = selected?.service === "battery";
  const solarEstimate =
    selected && solarView
      ? solarEstimateForBills(
          (selected.monthlyBills ?? []).map(Number),
          selected.cityCorporation ? cityCorporationTariffs : standardTariffs,
          selected.solarPercent ?? 50
        )
      : null;
  const extraEntries = selected
    ? Object.entries(selected).filter(
        ([key, value]) =>
          !coveredDetailKeys.has(key) &&
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
      )
    : [];

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
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    serviceColors[selected.service] ??
                      "bg-zinc-100 text-zinc-600 border-zinc-200"
                  )}
                >
                  {serviceLabels[selected.service] ?? selected.service}
                </span>
                <h3 className="mt-2 text-lg font-bold text-zinc-900">
                  Quotation Details
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Submitted {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Solar calculator section — as filled on the get-quote page */}
              {solarView && (
                <>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                    <h4 className="text-xl font-bold text-zinc-900">
                      Your monthly bills
                    </h4>
                    {(selected.monthlyBills?.length ?? 0) > 0 ? (
                      <div className="mt-4 space-y-2">
                        {selected.monthlyBills!.map((bill, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm"
                          >
                            <span className="font-medium text-zinc-700">
                              Month {i + 1}
                            </span>
                            <span className="font-semibold text-zinc-900">
                              ৳{bill}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-zinc-500">
                        No bills entered.
                      </p>
                    )}
                    <dl className="mt-4 space-y-2 border-t border-zinc-200 pt-4">
                      <ConfigRow
                        label="City corporation area"
                        value={
                          selected.cityCorporation === undefined
                            ? "—"
                            : selected.cityCorporation
                              ? "Yes, city corporation rates"
                              : "No, standard rates"
                        }
                      />
                      <ConfigRow
                        label="Solar offset target"
                        value={
                          selected.solarPercent === undefined
                            ? "—"
                            : `${selected.solarPercent}%`
                        }
                      />
                    </dl>
                  </div>

                  <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6">
                    <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
                      Your estimate
                    </p>
                    {solarEstimate ? (
                      <>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <EstimateMetric
                            label="Average bill"
                            value={`৳${formatNumber(solarEstimate.grossAverageBill)}`}
                          />
                          <EstimateMetric
                            label="Est. VAT included"
                            value={`৳${formatNumber(solarEstimate.estimatedVat)}`}
                          />
                          <EstimateMetric
                            label="Estimated usage"
                            value={`${formatNumber(solarEstimate.averageUnits)} units`}
                          />
                          <EstimateMetric
                            label="Solar generation"
                            value={`${formatNumber(solarEstimate.solarUnits)} units`}
                          />
                          <EstimateMetric
                            label="Roof area needed"
                            value={`${formatNumber(solarEstimate.area, 1)} m²`}
                          />
                          <EstimateMetric
                            label="Bill reduction"
                            value={`${formatNumber(solarEstimate.billSavingsPercent, 1)}%`}
                            highlight
                          />
                        </div>
                        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
                          <div className="flex justify-between gap-4">
                            <span className="text-zinc-500">
                              Estimated bill after solar
                            </span>
                            <span className="font-semibold text-zinc-900">
                              ৳{formatNumber(solarEstimate.estimatedNewGrossBill)}
                            </span>
                          </div>
                          {solarEstimate.newSlab < solarEstimate.oldSlab && (
                            <p className="mt-3 border-t border-zinc-100 pt-3 text-red-700">
                              Target moves down{" "}
                              {solarEstimate.oldSlab - solarEstimate.newSlab} tariff
                              level
                              {solarEstimate.oldSlab - solarEstimate.newSlab > 1
                                ? "s"
                                : ""}
                              .
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="mt-4 text-sm text-zinc-500">
                        Add at least one bill to see your estimated usage, savings,
                        and roof area.
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Battery builder section — as configured on the get-quote page */}
              {batteryView && (
                <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6">
                  <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
                    Your configuration
                  </p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <ConfigRow label="Type" value={selected.batteryType ?? "—"} />
                    <ConfigRow label="Grade" value={selected.grade ?? "—"} />
                    <ConfigRow label="Cell" value={selected.cellCapacity ?? "—"} />
                    <ConfigRow label="BMS" value={selected.bms ?? "—"} />
                    <ConfigRow label="Enclosure" value={selected.enclosure ?? "—"} />
                    <ConfigRow
                      label="Dimension"
                      value={
                        selected.dimLength &&
                        selected.dimWidth &&
                        selected.dimHeight
                          ? `${selected.dimLength} × ${selected.dimWidth} × ${selected.dimHeight} mm`
                          : "not given"
                      }
                    />
                    <ConfigRow label="Waterproof" value={selected.waterproof ?? "—"} />
                    <ConfigRow
                      label="Quantity"
                      value={batteryQtyText(selected.quantity)}
                    />
                  </dl>
                </div>
              )}

              {/* Contact + project details — the quote form, all services */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h4 className="text-xl font-bold text-zinc-900">Your details</h4>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <ReadonlyField
                    label="Full Name"
                    value={selected.name}
                    copied={copiedField === "Full Name"}
                    onCopy={() => handleCopy(selected.name, "Full Name")}
                  />
                  <ReadonlyField
                    label="Phone Number"
                    value={selected.phone}
                    copied={copiedField === "Phone Number"}
                    onCopy={() => handleCopy(selected.phone, "Phone Number")}
                  />
                  <ReadonlyField
                    label="Email Address"
                    value={selected.email}
                    copied={copiedField === "Email Address"}
                    onCopy={() => handleCopy(selected.email, "Email Address")}
                  />
                  <ReadonlyField
                    label="Address"
                    value={selected.address}
                    copied={copiedField === "Address"}
                    onCopy={() => handleCopy(selected.address, "Address")}
                  />
                  {selected.monthlyBill && (
                    <ReadonlyField
                      label="Current Monthly Bill (BDT)"
                      value={selected.monthlyBill}
                      copied={copiedField === "Current Monthly Bill (BDT)"}
                      onCopy={() =>
                        handleCopy(
                          selected.monthlyBill!,
                          "Current Monthly Bill (BDT)"
                        )
                      }
                    />
                  )}
                  <ReadonlyField
                    label="Delivery Date"
                    value={selected.deliveryDate}
                    copied={copiedField === "Delivery Date"}
                    onCopy={() =>
                      handleCopy(selected.deliveryDate, "Delivery Date")
                    }
                  />
                  {selected.requirement.trim() !== "" && (
                    <div className="sm:col-span-2">
                      <ReadonlyField
                        label={batteryView ? "Additional Note" : "Requirements"}
                        value={selected.requirement}
                        copied={
                          copiedField ===
                          (batteryView ? "Additional Note" : "Requirements")
                        }
                        onCopy={() =>
                          handleCopy(
                            selected.requirement,
                            batteryView ? "Additional Note" : "Requirements"
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Anything on the record outside the form sections */}
              {extraEntries.length > 0 && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                  <h4 className="text-xl font-bold text-zinc-900">
                    Additional details
                  </h4>
                  <div className="mt-4 space-y-4">
                    {extraEntries.map(([key, value]) => {
                      const label = detailLabel(key);
                      const display = detailValue(key, value);
                      return (
                        <div key={key} className="group">
                          <label className="text-xs font-semibold text-zinc-400 uppercase">
                            {label}
                          </label>
                          <div className="mt-1 flex items-start gap-2">
                            <p className="flex-1 text-sm text-zinc-900 break-words whitespace-pre-wrap">
                              {display}
                            </p>
                            <button
                              onClick={() => handleCopy(display, label)}
                              className="shrink-0 rounded p-1 text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-900 transition-opacity"
                              title="Copy"
                            >
                              {copiedField === label ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
