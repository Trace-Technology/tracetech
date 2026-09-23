"use client";



import Link from "next/link";

import { useMemo, useState } from "react";

import { ArrowRight, Plus, Trash2, Sun } from "lucide-react";

import FadeIn from "@/components/ui/FadeIn";



const standardTariffs = [

  { label: "Lifeline", range: "0-50 units", from: 0, to: 50, rate: 4.63 },

  { label: "1st slab", range: "0-75 units", from: 0, to: 75, rate: 5.26 },

  { label: "2nd slab", range: "76-200 units", from: 76, to: 200, rate: 7.2 },

  { label: "3rd slab", range: "201-300 units", from: 201, to: 300, rate: 7.59 },

  { label: "4th slab", range: "301-400 units", from: 301, to: 400, rate: 8.02 },

  { label: "5th slab", range: "401-600 units", from: 401, to: 600, rate: 12.67 },

  { label: "6th slab", range: "Above 600 units", from: 601, to: Infinity, rate: 14.61 },

];



const cityCorporationTariffs = [

  { label: "Lifeline", range: "0-50 units", from: 0, to: 50, rate: 4.63 },

  { label: "1st step", range: "0-75 units", from: 0, to: 75, rate: 5.26 },

  { label: "2nd step", range: "76-200 units", from: 76, to: 200, rate: 8.5 },

  { label: "3rd step", range: "201-300 units", from: 201, to: 300, rate: 9.1 },

  { label: "4th step", range: "301-400 units", from: 301, to: 400, rate: 9.62 },

  { label: "5th step", range: "401-600 units", from: 401, to: 600, rate: 15.01 },

  { label: "6th step", range: "Above 600 units", from: 601, to: Infinity, rate: 17.35 },

];



const initialMonths = [{ id: 1, bill: "" }];

const VAT_RATE = 0.05;



function billForUnits(units: number, tariffs: typeof standardTariffs) {

  const usage = Math.max(0, units);

  const slab = tariffs.find((tariff) => usage <= tariff.to) ?? tariffs.at(-1)!;

  return usage * slab.rate;

}



function unitsForBill(bill: number, tariffs: typeof standardTariffs) {

  if (bill <= 0) return 0;



  let low = 0;

  let high = Math.max(100, bill / 4.63 + 1);

  while (billForUnits(high, tariffs) < bill) high *= 2;



  for (let i = 0; i < 50; i += 1) {

    const middle = (low + high) / 2;

    if (billForUnits(middle, tariffs) < bill) low = middle;

    else high = middle;

  }



  const lowerUnits = Math.floor(low);

  const upperUnits = Math.ceil(high);

  return Math.abs(billForUnits(lowerUnits, tariffs) - bill) <= Math.abs(billForUnits(upperUnits, tariffs) - bill)

    ? lowerUnits

    : upperUnits;

}



const weightedUnitPoints = [

  { units: 14, adjustment: -4 },

  { units: 264, adjustment: -13 },

  { units: 304, adjustment: 32 },

];



function weightedUnitAdjustment(units: number) {

  const firstPoint = weightedUnitPoints[0];

  const middlePoint = weightedUnitPoints[1];

  const lastPoint = weightedUnitPoints[2];

  const clampedUnits = Math.min(Math.max(units, firstPoint.units), lastPoint.units);



  const firstWeight =

    ((clampedUnits - middlePoint.units) * (clampedUnits - lastPoint.units)) /

    ((firstPoint.units - middlePoint.units) * (firstPoint.units - lastPoint.units));

  const middleWeight =

    ((clampedUnits - firstPoint.units) * (clampedUnits - lastPoint.units)) /

    ((middlePoint.units - firstPoint.units) * (middlePoint.units - lastPoint.units));

  const lastWeight =

    ((clampedUnits - firstPoint.units) * (clampedUnits - middlePoint.units)) /

    ((lastPoint.units - firstPoint.units) * (lastPoint.units - middlePoint.units));



  return (

    firstWeight * firstPoint.adjustment +

    middleWeight * middlePoint.adjustment +

    lastWeight * lastPoint.adjustment

  );

}



function formatNumber(value: number, digits = 0) {

  return new Intl.NumberFormat("en-BD", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);

}



export default function SolarCalculatorPage() {

  const [months, setMonths] = useState(initialMonths);

  const [solarPercent, setSolarPercent] = useState(50);

  const [isCityCorporation, setIsCityCorporation] = useState(false);

  const tariffs = isCityCorporation ? cityCorporationTariffs : standardTariffs;



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

    const tariff = tariffs[oldSlab] ?? tariffs[0];

    return {

      grossAverageBill,

      billAfterVat,

      estimatedVat,

      estimatedVatAndDemandCharge: estimatedVat,

      averageBill,

      rawAverageUnits,

      weightedAdjustment,

      averageUnits,

      solarUnits,

      remainingUnits,

      estimatedNewBill,

      billSavingsPercent,

      oldSlab,

      newSlab,

      tariff,

      estimatedNewGrossBill: estimatedNewBill * (1 + VAT_RATE),

      area: solarUnits * 0.2,

    };

  }, [months, solarPercent, tariffs]);



  function updateBill(id: number, bill: string) {

    setMonths((current) => current.map((month) => (month.id === id ? { ...month, bill } : month)));

  }



  const quoteHref = "/quote-request?service=solar";



  return (

    <div className="py-20 px-6">

      <div className="mx-auto max-w-7xl">

        <FadeIn>

          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-red-500">Solar planning tool</span>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Turn your electricity bill into a solar plan.</h1>

          <p className="mt-4 max-w-2xl text-lg text-navy-400">Add one or more recent bills. We remove 5% VAT from the average bill before estimating your monthly units.</p>

        </FadeIn>



        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_420px]">

          <FadeIn delay={0.1}>

            <section className="rounded-xl border border-white/10 bg-white/3 p-6 sm:p-8">

              <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-white">Your monthly bills</h2><p className="mt-1 text-sm text-navy-400">Enter the total bill in BDT.</p></div><Sun className="h-7 w-7 shrink-0 text-red-500" /></div>

              <div className="mt-8 space-y-3">

                {months.map((month, index) => <div key={month.id} className="flex items-end gap-3"><label className="flex-1 text-sm font-medium text-navy-300">Month {index + 1}<div className="mt-2 flex items-center rounded-lg border border-white/10 bg-white/5 focus-within:border-solar"><span className="pl-4 text-navy-500">à§³</span><input value={month.bill} onChange={(event) => updateBill(month.id, event.target.value)} type="number" min="0" step="0.01" placeholder="5000" className="w-full bg-transparent px-3 py-3 text-white outline-none placeholder:text-navy-600" /></div></label><button type="button" onClick={() => setMonths((current) => current.length === 1 ? current : current.filter((item) => item.id !== month.id))} aria-label={`Remove month ${index + 1}`} className="mb-0.5 rounded-lg p-3 text-navy-500 transition-colors hover:bg-white/5 hover:text-red-400"><Trash2 className="h-5 w-5" /></button></div>)}

              </div>

              <button type="button" onClick={() => setMonths((current) => [...current, { id: Date.now(), bill: "" }])} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-500-light"><Plus className="h-4 w-4" /> Add another month</button>

              <div className="mt-8 border-t border-white/10 pt-8">

                <label className="block text-sm font-medium text-navy-300" htmlFor="city-corporation">

                  Is your property inside a city corporation area?

                </label>

                <select

                  id="city-corporation"

                  value={isCityCorporation ? "yes" : "no"}

                  onChange={(event) => setIsCityCorporation(event.target.value === "yes")}

                  className="mt-2 w-full rounded-lg border border-solar/50 bg-navy-800 px-4 py-3 text-red-500 focus:border-solar focus:outline-none"

                >

                  <option value="no" className="bg-navy-800 text-red-500">No, use standard rates</option>

                  <option value="yes" className="bg-navy-800 text-red-500">Yes, use city corporation rates</option>

                </select>

                <p className="mt-2 text-xs text-navy-500">

                  {isCityCorporation ? "City corporation rates are applied to your estimate." : "Standard rates are applied to your estimate."}

                </p>

              </div>

              <div className="mt-10 border-t border-white/10 pt-8"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold text-white">How much solar do you want?</h2><p className="mt-1 text-sm text-navy-400">Choose the share of your current usage to generate.</p></div><span className="text-2xl font-bold text-red-500">{solarPercent}%</span></div><input type="range" min="0" max="100" step="5" value={solarPercent} onChange={(event) => setSolarPercent(Number(event.target.value))} className="mt-6 w-full accent-solar" aria-label="Solar generation target" /><div className="mt-2 flex justify-between text-xs text-navy-500"><span>0% offset</span><span>100% offset</span></div></div>

            </section>

          </FadeIn>



          <FadeIn delay={0.2} className="hidden lg:block">

            <section className="h-fit rounded-xl border border-solar/30 bg-solar/[0.07] p-6 sm:p-8 lg:sticky lg:top-24"><p className="text-sm font-semibold uppercase tracking-widest text-red-500">Your estimate</p>{result ? <><div className="mt-6 grid grid-cols-2 gap-5"><Metric label="Average bill" value={`à§³${formatNumber(result.grossAverageBill)}`} /><Metric label={`VAT + estimated demand charge (${formatNumber(result.estimatedVatAndDemandCharge / result.grossAverageBill * 100, 1)}%)`} value={`à§³${formatNumber(result.estimatedVatAndDemandCharge)}`} /><Metric label="Estimated usage" value={`${formatNumber(result.averageUnits)} units`} /><Metric label="Solar generation" value={`${formatNumber(result.solarUnits)} units`} /><Metric label="Roof area needed" value={`${formatNumber(result.area, 1)} mÂ²`} /></div><div className="mt-8 rounded-lg border border-white/10 bg-navy-950/40 p-4"><div className="flex justify-between gap-4 text-sm"><span className="text-navy-400">Estimated bill after solar</span><span className="font-semibold text-white">à§³{formatNumber(result.estimatedNewGrossBill)}</span></div><div className="mt-3 flex justify-between gap-4 text-sm"><span className="text-navy-400">Estimated bill reduction</span><span className="font-semibold text-accent-green">{formatNumber(result.billSavingsPercent, 1)}%</span></div>{result.newSlab < result.oldSlab && <p className="mt-4 border-t border-white/10 pt-4 text-sm text-red-500">Your target moves you down {result.oldSlab - result.newSlab} tariff level{result.oldSlab - result.newSlab > 1 ? "s" : ""}.</p>}</div><Link href={quoteHref} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-solar px-6 py-3 font-semibold text-navy-950 transition-all hover:bg-solar-dark hover:shadow-lg hover:shadow-solar/20">Book a free quotation <ArrowRight className="h-4 w-4" /></Link></> : <p className="mt-6 text-navy-300">Add at least one bill to see your estimated usage, savings, and roof area.</p>}<p className="mt-5 text-xs leading-5 text-navy-500">Usage estimation removes 5% VAT first, then applies a weighted demand charge from 5% to 15% based on the post-VAT bill before applying electricity rates. Planning estimate: 1 unit of monthly generation uses approximately 0.2 mÂ² of roof area. Final sizing depends on your roof, shade, panel choice, and site survey.</p></section>

          </FadeIn>

        </div>



        <FadeIn delay={0.15} className="hidden lg:block"><section className="mt-12 border-t border-white/10 pt-10"><h2 className="text-xl font-semibold text-white">Bangladesh electricity usage rates</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{tariffs.map((tariff) => <div key={tariff.label} className="rounded-lg border border-white/5 bg-white/2 p-4"><p className="text-sm text-navy-400">{tariff.label}</p><p className="mt-1 font-medium text-white">{tariff.range}</p><p className="mt-2 text-sm text-red-500">à§³{tariff.rate.toFixed(2)} / unit</p></div>)}</div></section></FadeIn>

      </div>

    </div>

  );

}



function Metric({ label, value }: { label: string; value: string }) {

  return <div><p className="text-xs text-navy-400">{label}</p><p className="mt-1 text-lg font-semibold text-white">{value}</p></div>;

}





