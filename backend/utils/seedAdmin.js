const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function ensureAdminAccount() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "System Admin";

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await User.create({
    fullName: adminName,
    email: adminEmail.toLowerCase(),
    passwordHash,
    role: "admin",
    isActive: true,
  });

  console.log("Admin account created from environment variables.");
}

module.exports = { ensureAdminAccount };
