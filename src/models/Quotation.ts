import mongoose, { Schema, Document, Model } from "mongoose";

export type QuotationService = "pcb" | "solar" | "battery";

export type QuotationStatus =
  | "unopened"
  | "contacted"
  | "confirmed"
  | "work_in_progress"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IQuotation extends Document {
  name: string;
  phone: string;
  email: string;
  address: string;
  /** Auto-detected from the quote-request tab the user submitted from. */
  service: QuotationService;
  requirement: string;
  deliveryDate: string;
  monthlyBill?: string;
  /* Solar calculator inputs — present when service is solar. */
  monthlyBills?: string[];
  cityCorporation?: boolean;
  solarPercent?: number;
  /* Battery builder inputs — present when service is battery. */
  batteryType?: string;
  grade?: string;
  cellCapacity?: string;
  bms?: string;
  enclosure?: string;
  dimLength?: string;
  dimWidth?: string;
  dimHeight?: string;
  waterproof?: string;
  quantity?: string;
  status: QuotationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const QuotationSchema = new Schema<IQuotation>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    service: {
      type: String,
      enum: ["pcb", "solar", "battery"],
      required: true,
      default: "pcb",
    },
    requirement: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    monthlyBill: { type: String, trim: true },
    monthlyBills: { type: [String], default: undefined },
    cityCorporation: { type: Boolean, default: undefined },
    solarPercent: { type: Number, default: undefined },
    batteryType: { type: String, trim: true },
    grade: { type: String, trim: true },
    cellCapacity: { type: String, trim: true },
    bms: { type: String, trim: true },
    enclosure: { type: String, trim: true },
    dimLength: { type: String, trim: true },
    dimWidth: { type: String, trim: true },
    dimHeight: { type: String, trim: true },
    waterproof: { type: String, trim: true },
    quantity: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        "unopened",
        "contacted",
        "confirmed",
        "work_in_progress",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "unopened",
    },
  },
  { timestamps: true }
);

export const Quotation: Model<IQuotation> =
  mongoose.models.Quotation || mongoose.model<IQuotation>("Quotation", QuotationSchema);
