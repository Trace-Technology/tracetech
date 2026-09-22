import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Quotation } from "@/models/Quotation";

const orderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  serviceType: z.enum(["pcb", "solar", "battery"]),
  requirement: z.string().min(1, "Requirement is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  monthlyBill: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = orderSchema.parse(body);

    await connectDB();
    const quotation = await Quotation.create({
      name: validated.name,
      phone: validated.phone,
      email: validated.email,
      address: validated.address,
      // Service is auto-detected from the quote-request tab the user applied from.
      service: validated.serviceType,
      requirement: validated.requirement,
      deliveryDate: validated.deliveryDate,
      monthlyBill: validated.monthlyBill || undefined,
      status: "unopened",
    });

    return NextResponse.json(
      { success: true, message: "Order submitted successfully", quotationId: quotation._id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit order. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({});
}
