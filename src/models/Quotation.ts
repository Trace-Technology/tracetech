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
