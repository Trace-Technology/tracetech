"use client";

import { Suspense, useMemo, useState } from "react";
import {
  Send,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Sun,
  ArrowRight,
  Calculator,
  BatteryCharging,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import FadeIn from "@/components/ui/FadeIn";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  standardTariffs,
  cityCorporationTariffs,
  VAT_RATE,
  billForUnits,
  unitsForBill,
  weightedUnitAdjustment,
  formatNumber,
} from "@/lib/solar";

type ServiceType = "pcb" | "solar" | "battery";

type FormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceType: ServiceType;
  monthlyBill?: string;
  requirement: string;
  deliveryDate: string;
};

/* Solar calculator logic lives in @/lib/solar (shared with admin). */
/* Battery builder options (same flow as the Palki battery builder)    */
/* ------------------------------------------------------------------ */

type BatteryOption = { value: string; title: string; desc: string };

const batteryTypes: BatteryOption[] = [
  { value: "LiFePO4 (LFP)", title: "LiFePO₄ (LFP)", desc: "Most requested · 3000+ cycles" },
  { value: "Li-ion (NMC)", title: "Li-ion (NMC)", desc: "Light and compact · high energy" },
  { value: "Lead Acid", title: "Lead Acid", desc: "Lowest cost · heaviest" },
];

const batteryGrades: BatteryOption[] = [
  { value: "Grade A", title: "Grade A", desc: "Fresh, matched cells · full warranty" },
  { value: "Grade B", title: "Grade B", desc: "Minor capacity variation" },
  { value: "Grade C", title: "Grade C", desc: "Budget / backup use" },
];

const batteryCells: BatteryOption[] = [
  { value: "100 Ah", title: "100 Ah", desc: "Light load" },
  { value: "125 Ah", title: "125 Ah", desc: "Most popular" },
  { value: "150 Ah", title: "150 Ah", desc: "Long range" },
  { value: "200 Ah", title: "200 Ah", desc: "Heavy duty" },
];

const batteryBms: BatteryOption[] = [
  { value: "JK BMS (smart)", title: "JK BMS", desc: "Smart · active balancing" },
  { value: "Daly", title: "Daly", desc: "Reliable · widely serviced" },
  { value: "Seplos", title: "Seplos", desc: "CAN / RS485 communication" },
  { value: "Customer's choice", title: "Other", desc: "Name it in the note below" },
];

const batteryBoxes: BatteryOption[] = [
  { value: "Rectangular", title: "Rectangular", desc: "Standard box" },
  { value: "Square", title: "Square", desc: "Equal width and depth" },
  { value: "Customized", title: "Customized", desc: "Built to your dimensions" },
];

const batteryWp: BatteryOption[] = [
  { value: "Yes — IP65 sealed", title: "Yes", desc: "IP65 sealed enclosure" },
  { value: "No", title: "No", desc: "Standard enclosure" },
];

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";
const labelClass = "block text-sm font-semibold text-zinc-900 mb-2";

function QuoteRequestInner() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") as ServiceType | null;
  const initialService: ServiceType =
    serviceParam === "solar" || serviceParam === "battery" ? serviceParam : "pcb";

  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    serviceType: initialService,
    monthlyBill: "",
    requirement: "",
    deliveryDate: "",
  });
  /* Sync service tabs when ?service= changes via client-side navigation (no reload). */
  const [lastParam, setLastParam] = useState<string | null>(serviceParam);
  if (serviceParam !== lastParam) {
    setLastParam(serviceParam);
    if (serviceParam === "pcb" || serviceParam === "solar" || serviceParam === "battery") {
      const next = serviceParam;
      setForm((prev) => (prev.serviceType === next ? prev : { ...prev, serviceType: next }));
    }
  }
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  /* Solar calculator state */
  const [months, setMonths] = useState([{ id: 1, bill: "" }]);
  const [solarPercent, setSolarPercent] = useState(50);
  const [isCityCorporation, setIsCityCorporation] = useState(false);
  const tariffs = isCityCorporation ? cityCorporationTariffs : standardTariffs;

  /* Battery builder state (Palki flow: type → grade → cell → BMS → enclosure → waterproof) */
  const [packType, setPackType] = useState("LiFePO4 (LFP)");
  const [grade, setGrade] = useState("Grade A");
  const [cell, setCell] = useState("125 Ah");
  const [bms, setBms] = useState("JK BMS (smart)");
  const [box, setBox] = useState("Rectangular");
  const [wp, setWp] = useState("Yes — IP65 sealed");
  const [dimLen, setDimLen] = useState("");
  const [dimWid, setDimWid] = useState("");
  const [dimHgt, setDimHgt] = useState("");
  const [qty, setQty] = useState("1");

  const isSolar = form.serviceType === "solar";
  const isBattery = form.serviceType === "battery";

  const result = useMemo(() => {
    const bills = months.map((month) => Number(month.bill)).filter((bill) => bill > 0);
    if (!bills.length) return null;
    const grossAverageBill = bills.reduce((sum, bill) => sum + bill, 0) / bills.length;
    const billAfterVat = grossAverageBill / (1 + VAT_RATE);
    const estimatedVat = grossAverageBill - billAfterVat;
    const averageBill = billAfterVat;
    const rawAverageUnits = unitsForBill(averageBill, tariffs);
    const weightedAdjustment = weightedUnitAdjustment(rawAverageUnits);
    const averageUnits = Math.max(0, Math.round(rawAverageUnits + weightedAdjustment));
    const solarUnits = Math.round((averageUnits * solarPercent) / 100);
    const remainingUnits = Math.max(0, averageUnits - solarUnits);
    const estimatedNewBill = billForUnits(remainingUnits, tariffs);
    const billSavingsPercent = averageBill ? ((averageBill - estimatedNewBill) / averageBill) * 100 : 0;
    const oldSlab = tariffs.findIndex((slab) => averageUnits <= slab.to);
    const newSlab = tariffs.findIndex((slab) => remainingUnits <= slab.to);
    return {
      grossAverageBill,
      estimatedVat,
      averageBill,
      averageUnits,
      solarUnits,
      remainingUnits,
      estimatedNewBill,
      billSavingsPercent,
      oldSlab,
      newSlab,
      estimatedNewGrossBill: estimatedNewBill * (1 + VAT_RATE),
      area: solarUnits * 0.2,
    };
  }, [months, solarPercent, tariffs]);

  /* Monthly-bill field falls back to the calculator average until the user types. */
  const autoBill = isSolar && result ? String(Math.round(result.grossAverageBill)) : "";
  const monthlyBillValue = form.monthlyBill !== "" ? form.monthlyBill : autoBill;

  /* Live battery configuration summary (Palki aside) */
  const dimsComplete = dimLen !== "" && dimWid !== "" && dimHgt !== "";
  const dimText = dimsComplete ? `${dimLen} × ${dimWid} × ${dimHgt} mm` : "not given";
  const protection = wp.startsWith("Yes") ? "IP65" : "Standard";
  const qtyNum = parseInt(qty, 10);
  const qtyText = `${qty || "1"}${qtyNum > 1 ? " pcs" : " pc"}`;

  const handleServiceChange = (type: ServiceType) => {
    setForm((prev) => ({ ...prev, serviceType: type }));
    window.history.replaceState(null, "", `/quote-request?service=${type}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function updateBill(id: number, bill: string) {
    setMonths((current) => current.map((month) => (month.id === id ? { ...month, bill } : month)));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    /* Attach the live solar estimate to the requirement so sales sees it */
    let requirement = form.requirement;
    if (isSolar && result) {
      requirement +=
        `\n\n[Solar estimate — avg bill ৳${formatNumber(result.grossAverageBill)}, ` +
        `usage ${formatNumber(result.averageUnits)} units, ` +
        `solar ${formatNumber(result.solarUnits)} units (${solarPercent}%), ` +
        `roof ~${formatNumber(result.area, 1)} m², ` +
        `est. new bill ৳${formatNumber(result.estimatedNewGrossBill)}]`;
    }

    /* Build the full battery pack specification ticket (Palki flow) */
    if (isBattery) {
      const dimLine = dimsComplete ? `${dimLen} x ${dimWid} x ${dimHgt} mm` : "to be advised";
      requirement =
        `[Battery pack — Type: ${packType}; Grade: ${grade}; Cell: ${cell}; BMS: ${bms}; ` +
        `Enclosure: ${box}; Dimensions: ${dimLine}; Waterproof: ${wp}; Quantity: ${qty || "1"}]` +
        (form.requirement.trim() ? `\nNote: ${form.requirement.trim()}` : "");
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          serviceType: form.serviceType,
          requirement,
          deliveryDate: form.deliveryDate,
          monthlyBill: isSolar ? monthlyBillValue : form.monthlyBill,
          ...(isSolar
            ? {
                monthlyBills: months.map((month) => month.bill),
                cityCorporation: isCityCorporation,
                solarPercent,
              }
            : {}),
          ...(isBattery
            ? {
                batteryType: packType,
                grade,
                cellCapacity: cell,
                bms,
                enclosure: box,
                dimLength: dimLen,
                dimWidth: dimWid,
                dimHeight: dimHgt,
                waterproof: wp,
                quantity: qty,
              }
            : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong");
        setModal("error");
        return;
      }

      setModal("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        serviceType: form.serviceType,
        monthlyBill: "",
        requirement: "",
        deliveryDate: "",
      });
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setModal("error");
    } finally {
      setLoading(false);
    }
  };

  const serviceTabs: { value: ServiceType; label: string }[] = [
    { value: "pcb", label: "PCB Design" },
    { value: "solar", label: "Solar Calculator" },
    { value: "battery", label: "Battery Builder" },
  ];

  return (
    <div className="bg-white py-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header — same color scheme as Our Work */}
        <FadeIn>
          <span className="mb-4 inline-block rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-700">
            Get a quote
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            {isSolar ? "Build your solar plan" : isBattery ? "Build your battery" : "Get a Quote"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-500">
            {isSolar
              ? "Add your recent electricity bills below — we estimate your usage, savings, and roof area, then send you a detailed quotation."
              : isBattery
                ? "Pick your type, grade, cell capacity, BMS, enclosure and dimensions. Submit and the full specification goes straight to our engineering team."
                : "Tell us about your project. We'll review your requirements and get back to you within 1 business day."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {serviceTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleServiceChange(tab.value)}
                className={`rounded-lg border px-6 py-3 font-semibold transition-all ${
                  form.serviceType === tab.value
                    ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* ---- Solar calculator (full-width, Solaris behavior, TraceTech light theme) ---- */}
        {isSolar && (
          <div className="mt-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
              <FadeIn delay={0.1}>
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900">Your monthly bills</h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        Enter the total bill in BDT. We remove 5% VAT before estimating your monthly units.
                      </p>
                    </div>
                    <Sun className="h-7 w-7 shrink-0 text-red-600" />
                  </div>

                  <div className="mt-8 space-y-3">
                    {months.map((month, index) => (
                      <div key={month.id} className="flex items-end gap-3">
                        <label className="flex-1 text-sm font-medium text-zinc-700">
                          Month {index + 1}
                          <div className="mt-2 flex items-center rounded-lg border border-zinc-200 bg-zinc-50 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
                            <span className="pl-4 text-zinc-400">৳</span>
                            <input
                              value={month.bill}
                              onChange={(event) => updateBill(month.id, event.target.value)}
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="5000"
                              className="w-full bg-transparent px-3 py-3 text-zinc-900 outline-none placeholder:text-zinc-400"
                            />
                          </div>
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setMonths((current) =>
                              current.length === 1
                                ? current
                                : current.filter((item) => item.id !== month.id)
                            )
                          }
                          aria-label={`Remove month ${index + 1}`}
                          className="mb-0.5 rounded-lg p-3 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setMonths((current) => [...current, { id: Date.now(), bill: "" }])}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    <Plus className="h-4 w-4" /> Add another month
                  </button>

                  <div className="mt-8 border-t border-zinc-200 pt-8">
                    <label
                      className="block text-sm font-medium text-zinc-700"
                      htmlFor="city-corporation"
                    >
                      Is your property inside a city corporation area?
                    </label>
                    <select
                      id="city-corporation"
                      value={isCityCorporation ? "yes" : "no"}
                      onChange={(event) => setIsCityCorporation(event.target.value === "yes")}
                      className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="no">No, use standard rates</option>
                      <option value="yes">Yes, use city corporation rates</option>
                    </select>
                    <p className="mt-2 text-xs text-zinc-500">
                      {isCityCorporation
                        ? "City corporation rates are applied to your estimate."
                        : "Standard rates are applied to your estimate."}
                    </p>
                  </div>

                  <div className="mt-10 border-t border-zinc-200 pt-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-zinc-900">How much solar do you want?</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                          Choose the share of your current usage to generate.
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-red-600">{solarPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={solarPercent}
                      onChange={(event) => setSolarPercent(Number(event.target.value))}
                      className="mt-6 w-full accent-red-600"
                      aria-label="Solar generation target"
                    />
                    <div className="mt-2 flex justify-between text-xs text-zinc-500">
                      <span>0% offset</span>
                      <span>100% offset</span>
                    </div>
                  </div>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2} className="hidden lg:block">
                <div className="h-fit rounded-2xl border border-red-200 bg-red-50/60 p-6 sm:p-8 lg:sticky lg:top-24">
                  <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-red-700">
                    <Calculator className="h-4 w-4" /> Your estimate
                  </p>
                  {result ? (
                    <>
                      <div className="mt-6 grid grid-cols-2 gap-5">
                        <Metric label="Average bill" value={`৳${formatNumber(result.grossAverageBill)}`} />
                        <Metric label="Est. VAT included" value={`৳${formatNumber(result.estimatedVat)}`} />
                        <Metric label="Estimated usage" value={`${formatNumber(result.averageUnits)} units`} />
                        <Metric label="Solar generation" value={`${formatNumber(result.solarUnits)} units`} />
                        <Metric label="Roof area needed" value={`${formatNumber(result.area, 1)} m²`} />
                        <Metric
                          label="Bill reduction"
                          value={`${formatNumber(result.billSavingsPercent, 1)}%`}
                          highlight
                        />
                      </div>
                      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-zinc-500">Estimated bill after solar</span>
                          <span className="font-semibold text-zinc-900">
                            ৳{formatNumber(result.estimatedNewGrossBill)}
                          </span>
                        </div>
                        {result.newSlab < result.oldSlab && (
                          <p className="mt-3 border-t border-zinc-100 pt-3 text-sm text-red-700">
                            Your target moves you down {result.oldSlab - result.newSlab} tariff level
                            {result.oldSlab - result.newSlab > 1 ? "s" : ""}.
                          </p>
                        )}
                      </div>
                      <a
                        href="#solar-quote-form"
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20"
                      >
                        Continue to quotation <ArrowRight className="h-4 w-4" />
                      </a>
                    </>
                  ) : (
                    <p className="mt-6 text-zinc-500">
                      Add at least one bill to see your estimated usage, savings, and roof area.
                    </p>
                  )}
                  <p className="mt-5 text-xs leading-5 text-zinc-500">
                    Planning estimate: 1 unit of monthly generation uses approximately 0.2 m² of
                    roof area. Final sizing depends on your roof, shade, panel choice, and site
                    survey.
                  </p>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.15} className="hidden lg:block">
              <section className="mt-12 border-t border-zinc-200 pt-10">
                <h2 className="text-xl font-bold text-zinc-900">Electricity usage rates</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {tariffs.map((tariff) => (
                    <div key={tariff.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-sm text-zinc-500">{tariff.label}</p>
                      <p className="mt-1 font-medium text-zinc-900">{tariff.range}</p>
                      <p className="mt-2 text-sm font-semibold text-red-700">
                        ৳{tariff.rate.toFixed(2)} / unit
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>
          </div>
        )}

        {/* ---- Battery builder (Palki flow, TraceTech light theme) ---- */}
        {isBattery && (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_400px]">
            <FadeIn delay={0.1}>
              <div className="space-y-6">
                <BuilderStep index="01" title="Battery Type">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {batteryTypes.map((opt) => (
                      <BatteryOpt
                        key={opt.value}
                        name="pack-type"
                        title={opt.title}
                        desc={opt.desc}
                        checked={packType === opt.value}
                        onChange={() => setPackType(opt.value)}
                      />
                    ))}
                  </div>
                </BuilderStep>

                <BuilderStep index="02" title="Cell Grade">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {batteryGrades.map((opt) => (
                      <BatteryOpt
                        key={opt.value}
                        name="grade"
                        title={opt.title}
                        desc={opt.desc}
                        checked={grade === opt.value}
                        onChange={() => setGrade(opt.value)}
                      />
                    ))}
                  </div>
                </BuilderStep>

                <BuilderStep index="03" title="Cell Capacity" sub="per cell, Ah">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {batteryCells.map((opt) => (
                      <BatteryOpt
                        key={opt.value}
                        name="cell"
                        title={opt.title}
                        desc={opt.desc}
                        checked={cell === opt.value}
                        onChange={() => setCell(opt.value)}
                      />
                    ))}
                  </div>
                </BuilderStep>

                <BuilderStep index="04" title="BMS Brand">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {batteryBms.map((opt) => (
                      <BatteryOpt
                        key={opt.value}
                        name="bms"
                        title={opt.title}
                        desc={opt.desc}
                        checked={bms === opt.value}
                        onChange={() => setBms(opt.value)}
                      />
                    ))}
                  </div>
                </BuilderStep>

                <BuilderStep index="05" title="Enclosure & Size">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {batteryBoxes.map((opt) => (
                      <BatteryOpt
                        key={opt.value}
                        name="box"
                        title={opt.title}
                        desc={opt.desc}
                        checked={box === opt.value}
                        onChange={() => setBox(opt.value)}
                      />
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block font-mono text-xs tracking-wide text-zinc-500" htmlFor="dim-len">
                        LENGTH (mm)
                      </label>
                      <input
                        id="dim-len"
                        type="number"
                        min="1"
                        value={dimLen}
                        onChange={(e) => setDimLen(e.target.value)}
                        placeholder="480"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-mono text-xs tracking-wide text-zinc-500" htmlFor="dim-wid">
                        WIDTH (mm)
                      </label>
                      <input
                        id="dim-wid"
                        type="number"
                        min="1"
                        value={dimWid}
                        onChange={(e) => setDimWid(e.target.value)}
                        placeholder="230"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-mono text-xs tracking-wide text-zinc-500" htmlFor="dim-hgt">
                        HEIGHT (mm)
                      </label>
                      <input
                        id="dim-hgt"
                        type="number"
                        min="1"
                        value={dimHgt}
                        onChange={(e) => setDimHgt(e.target.value)}
                        placeholder="260"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-zinc-500">
                    Leave the dimensions blank if you are not sure — we will suggest a size for
                    your vehicle or application.
                  </p>
                </BuilderStep>

                <BuilderStep index="06" title="Waterproofing">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {batteryWp.map((opt) => (
                      <BatteryOpt
                        key={opt.value}
                        name="wp"
                        title={opt.title}
                        desc={opt.desc}
                        checked={wp === opt.value}
                        onChange={() => setWp(opt.value)}
                      />
                    ))}
                  </div>
                </BuilderStep>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="h-fit rounded-2xl border border-red-200 bg-red-50/60 p-6 sm:p-8 lg:sticky lg:top-24">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-red-700">
                  <BatteryCharging className="h-4 w-4" /> Your configuration
                </p>
                <p className="mt-1 text-sm text-zinc-500">Updates as you choose</p>
                <dl className="mt-6 space-y-3 text-sm">
                  <SummaryRow label="Type" value={packType} />
                  <SummaryRow label="Grade" value={grade} />
                  <SummaryRow label="Cell" value={cell} />
                  <SummaryRow label="BMS" value={bms} />
                  <SummaryRow label="Enclosure" value={box} />
                  <SummaryRow label="Dimension" value={dimText} />
                  <SummaryRow label="Waterproof" value={wp} />
                  <SummaryRow label="Quantity" value={qtyText} strong />
                </dl>
                <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-3 text-sm text-zinc-500">
                  Protection rating: <strong className="font-mono text-amber-700">{protection}</strong> ·
                  price and warranty confirmed by our team.
                </div>
                <a
                  href="#battery-quote-form"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20"
                >
                  Continue to quotation <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeIn>
          </div>
        )}

        {/* ---- Quote form — full-width grid (form + sidebar), all services ---- */}
        <div
          id={isSolar ? "solar-quote-form" : isBattery ? "battery-quote-form" : undefined}
          className="mt-12 grid scroll-mt-24 gap-8 lg:grid-cols-[1fr_400px]"
        >
          <FadeIn>
            <Card>
              <h2 className="text-xl font-bold text-zinc-900">
                {isSolar
                  ? "Your details for the quotation"
                  : isBattery
                    ? "Your contact & delivery"
                    : "Project details"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {isSolar && result
                  ? `Based on ৳${formatNumber(result.grossAverageBill)}/mo average — ${formatNumber(result.averageUnits)} units, ${formatNumber(result.solarUnits)} units solar.`
                  : isBattery
                    ? `Requesting ${qtyText} — ${packType}, ${cell}, ${bms}. Add your contact details below.`
                    : "Fill in your contact and project information."}
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="+880 1XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="City, Country"
                  />
                </div>

                {isSolar && (
                  <div>
                    <label className={labelClass}>Current Monthly Electricity Bill (BDT) *</label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="monthlyBill"
                        value={monthlyBillValue}
                        onChange={(e) => setForm({ ...form, monthlyBill: e.target.value })}
                        required
                        className={inputClass}
                        placeholder="e.g., 15000"
                      />
                      {result && (
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, monthlyBill: "" }))}
                          className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                        >
                          Use average
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-zinc-500">
                      {result
                        ? `Calculator average: ৳${formatNumber(result.grossAverageBill)}/mo — we use this to size your system.`
                        : "We use this to estimate your solar generation needs and potential savings."}
                    </p>
                  </div>
                )}

                {!isBattery && (
                  <div>
                    <label className={labelClass}>
                      {isSolar ? "Solar Project Requirements *" : "Project Requirements *"}
                    </label>
                    <textarea
                      name="requirement"
                      value={form.requirement}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder={
                        isSolar
                          ? "Describe your solar project — system type, power requirements, location, roof details, etc."
                          : "Describe your project — what you need designed, any existing files, technical requirements, constraints..."
                      }
                    />
                  </div>
                )}

                {isBattery && (
                  <div>
                    <label className={labelClass}>Additional Note</label>
                    <textarea
                      name="requirement"
                      value={form.requirement}
                      onChange={handleChange}
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="e.g. 60V system, charger included, delivery within 15 days…"
                    />
                  </div>
                )}

                <div className={isBattery ? "grid gap-6 sm:grid-cols-2" : undefined}>
                  {isBattery && (
                    <div>
                      <label className={labelClass}>Quantity *</label>
                      <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        required
                        className={inputClass}
                        placeholder="1"
                      />
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Approximate Delivery Date *</label>
                    <input
                      type="text"
                      name="deliveryDate"
                      value={form.deliveryDate}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="e.g., Within 2 weeks, End of March 2026, etc."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-red-600 px-6 py-4 text-base font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Get a Quotation
                    </>
                  )}
                </button>
              </form>
            </Card>
          </FadeIn>

          {/* Sidebar — fills the full-width layout */}
          <FadeIn delay={0.15}>
            <div className="space-y-6 lg:sticky lg:top-24">
              {isSolar && result ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <h3 className="font-bold text-zinc-900">Quotation summary</h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    <SummaryRow label="Avg. monthly bill" value={`৳${formatNumber(result.grossAverageBill)}`} />
                    <SummaryRow label="Est. monthly usage" value={`${formatNumber(result.averageUnits)} units`} />
                    <SummaryRow
                      label={`Solar offset (${solarPercent}%)`}
                      value={`${formatNumber(result.solarUnits)} units`}
                    />
                    <SummaryRow label="Roof area needed" value={`~${formatNumber(result.area, 1)} m²`} />
                    <SummaryRow
                      label="Est. bill after solar"
                      value={`৳${formatNumber(result.estimatedNewGrossBill)}`}
                      strong
                    />
                    <SummaryRow
                      label="Est. bill reduction"
                      value={`${formatNumber(result.billSavingsPercent, 1)}%`}
                      strong
                    />
                  </dl>
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <h3 className="font-bold text-zinc-900">What happens next</h3>
                  <ol className="mt-4 space-y-3 text-sm text-zinc-600">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">1</span>
                      We review your requirements within 1 business day.
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">2</span>
                      You receive a detailed quotation with timeline and pricing.
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">3</span>
                      On approval, we start design and keep you updated at every step.
                    </li>
                  </ol>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant="red">
                      {isBattery ? "Battery Builder" : "PCB Design"}
                    </Badge>
                    <Badge>Response in 1 day</Badge>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h3 className="font-bold text-zinc-900">Contact info</h3>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <div className="text-zinc-500">Phone</div>
                      <div className="font-medium text-zinc-900">+880 1XXXXXXXXX</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <div className="text-zinc-500">Email</div>
                      <div className="font-medium text-zinc-900">info@tracetech.bd</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <div className="text-zinc-500">Office</div>
                      <div className="font-medium text-zinc-900">Dhaka, Bangladesh</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Success / error modal — light theme */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-6">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-2xl">
              <button
                onClick={() => setModal(null)}
                aria-label="Close"
                className="ml-auto block rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X className="h-5 w-5" />
              </button>
              {modal === "success" ? (
                <>
                  <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
                  <h3 className="mt-4 text-xl font-bold text-zinc-900">Request submitted</h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    Thanks for reaching out. We&apos;ll contact you within 1 business day.
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
                  <h3 className="mt-4 text-xl font-bold text-zinc-900">Something went wrong</h3>
                  <p className="mt-2 text-sm text-zinc-500">{errorMsg}</p>
                </>
              )}
              <button
                onClick={() => setModal(null)}
                className="mt-6 w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BuilderStep({
  index,
  title,
  sub,
  children,
}: {
  index: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded border border-red-200 bg-red-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-red-700">
          {index}
        </span>
        <h3 className="font-bold text-zinc-900">{title}</h3>
        {sub && <span className="text-sm text-zinc-500">{sub}</span>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function BatteryOpt({
  name,
  title,
  desc,
  checked,
  onChange,
}: {
  name: string;
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="relative block cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <span
        className={`flex h-full flex-col gap-1 rounded-lg border p-3 transition-all ${
          checked
            ? "border-red-500 bg-red-50"
            : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
        }`}
      >
        <span className="text-sm font-semibold text-zinc-900">
          {title}
          {checked && <span className="text-red-600"> ✓</span>}
        </span>
        <span className="text-xs leading-snug text-zinc-500">{desc}</span>
      </span>
    </label>
  );
}

function Metric({
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
      <p className={`mt-1 text-lg font-semibold ${highlight ? "text-emerald-700" : "text-zinc-900"}`}>
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-zinc-500">{label}</dt>
      <dd className={`shrink-0 ${strong ? "font-bold text-zinc-900" : "font-medium text-zinc-700"}`}>
        {value}
      </dd>
    </div>
  );
}

export default function QuoteRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white py-24 px-6 min-h-screen">
          <div className="mx-auto max-w-7xl">
            <p className="text-zinc-500">Loading…</p>
          </div>
        </div>
      }
    >
      <QuoteRequestInner />
    </Suspense>
  );
}
