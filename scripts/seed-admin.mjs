/**
 * Create the first admin user.
 *
 * Usage:
 *   $env:MONGODB_URI="mongodb+srv://..."; $env:ADMIN_USERNAME="admin"; $env:ADMIN_PASSWORD="secret"; node scripts/seed-admin.mjs
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error("Set MONGODB_URI, ADMIN_USERNAME and ADMIN_PASSWORD environment variables first.");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "tracetech" });
    console.log("Connected to MongoDB");

    const existing = await Admin.findOne({ username: ADMIN_USERNAME });
    if (existing) {
      console.log(`Admin '${ADMIN_USERNAME}' already exists`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({ username: ADMIN_USERNAME, password: hashedPassword });

    console.log(`Admin '${ADMIN_USERNAME}' created successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
