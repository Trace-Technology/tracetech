/* Shared solar calculator logic — used by the quote-request page
   (inputs + live estimate) and the admin panel (read-only replica).
   Keep the math identical everywhere: it is the quotation basis. */

export type Tariff = {
  label: string;
  range: string;
  from: number;
  to: number;
  rate: number;
};

export const standardTariffs: Tariff[] = [
  { label: "Lifeline", range: "0-50 units", from: 0, to: 50, rate: 4.63 },
  { label: "1st slab", range: "0-75 units", from: 0, to: 75, rate: 5.26 },
  { label: "2nd slab", range: "76-200 units", from: 76, to: 200, rate: 7.2 },
  { label: "3rd slab", range: "201-300 units", from: 201, to: 300, rate: 7.59 },
  { label: "4th slab", range: "301-400 units", from: 301, to: 400, rate: 8.02 },
  { label: "5th slab", range: "401-600 units", from: 401, to: 600, rate: 12.67 },
  { label: "6th slab", range: "Above 600 units", from: 601, to: Infinity, rate: 14.61 },
];

export const cityCorporationTariffs: Tariff[] = [
  { label: "Lifeline", range: "0-50 units", from: 0, to: 50, rate: 4.63 },
  { label: "1st step", range: "0-75 units", from: 0, to: 75, rate: 5.26 },
  { label: "2nd step", range: "76-200 units", from: 76, to: 200, rate: 8.5 },
  { label: "3rd step", range: "201-300 units", from: 201, to: 300, rate: 9.1 },
  { label: "4th step", range: "301-400 units", from: 301, to: 400, rate: 9.62 },
  { label: "5th step", range: "401-600 units", from: 401, to: 600, rate: 15.01 },
  { label: "6th step", range: "Above 600 units", from: 601, to: Infinity, rate: 17.35 },
];

export const VAT_RATE = 0.05;

export function billForUnits(units: number, tariffs: Tariff[]) {
  const usage = Math.max(0, units);
  const slab = tariffs.find((tariff) => usage <= tariff.to) ?? tariffs.at(-1)!;
  return usage * slab.rate;
}

export function unitsForBill(bill: number, tariffs: Tariff[]) {
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
  return Math.abs(billForUnits(lowerUnits, tariffs) - bill) <=
    Math.abs(billForUnits(upperUnits, tariffs) - bill)
    ? lowerUnits
    : upperUnits;
}

const weightedUnitPoints = [
  { units: 14, adjustment: -4 },
  { units: 264, adjustment: -13 },
  { units: 304, adjustment: 32 },
];

export function weightedUnitAdjustment(units: number) {
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

export type SolarEstimate = {
  grossAverageBill: number;
  estimatedVat: number;
  averageUnits: number;
  solarUnits: number;
  remainingUnits: number;
  estimatedNewBill: number;
  billSavingsPercent: number;
  oldSlab: number;
  newSlab: number;
  estimatedNewGrossBill: number;
  area: number;
};

/* Full bill → estimate pipeline, mirroring the quote-request page. */
export function solarEstimateForBills(
  bills: number[],
  tariffs: Tariff[],
  solarPercent: number
): SolarEstimate | null {
  const valid = bills.filter((bill) => bill > 0);
  if (!valid.length) return null;

  const grossAverageBill = valid.reduce((sum, bill) => sum + bill, 0) / valid.length;
  const billAfterVat = grossAverageBill / (1 + VAT_RATE);
  const estimatedVat = grossAverageBill - billAfterVat;
  const rawAverageUnits = unitsForBill(billAfterVat, tariffs);
  const averageUnits = Math.max(
    0,
    Math.round(rawAverageUnits + weightedUnitAdjustment(rawAverageUnits))
  );
  const solarUnits = Math.round((averageUnits * solarPercent) / 100);
  const remainingUnits = Math.max(0, averageUnits - solarUnits);
  const estimatedNewBill = billForUnits(remainingUnits, tariffs);
  const billSavingsPercent = billAfterVat
    ? ((billAfterVat - estimatedNewBill) / billAfterVat) * 100
    : 0;
  const oldSlab = tariffs.findIndex((slab) => averageUnits <= slab.to);
  const newSlab = tariffs.findIndex((slab) => remainingUnits <= slab.to);

  return {
    grossAverageBill,
    estimatedVat,
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
}

export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}
