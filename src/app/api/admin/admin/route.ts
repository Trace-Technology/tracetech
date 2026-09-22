import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { verifyAdmin } from "@/app/api/admin/auth/verify/route";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const admins = await Admin.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Fetch admins error:", error);
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters" },
        { status: 400 }
      );
    }

    const existing = await Admin.findOne({ username });
    if (existing) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Admin created", admin: { id: newAdmin._id, username: newAdmin.username } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    // Prevent deleting yourself
    if (id === admin.id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Admin deleted" });
  } catch (error) {
    console.error("Delete admin error:", error);
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}
