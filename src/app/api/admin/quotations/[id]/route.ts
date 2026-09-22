import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Quotation, QuotationStatus } from "@/models/Quotation";
import { verifyAdmin } from "@/app/api/admin/auth/verify/route";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    const validStatuses: QuotationStatus[] = [
      "unopened",
      "contacted",
      "confirmed",
      "work_in_progress",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const quotation = await Quotation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json({ quotation });
  } catch (error) {
    console.error("Update quotation error:", error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;

    const quotation = await Quotation.findByIdAndDelete(id);
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quotation deleted" });
  } catch (error) {
    console.error("Delete quotation error:", error);
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 }
    );
  }
}
