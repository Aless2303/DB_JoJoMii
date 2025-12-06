// Script to create an initial admin user
// Run with: npx tsx scripts/seed-admin.ts

import { db, generateId } from "../lib/db";
import { users } from "../lib/db/schema";

async function seedAdmin() {
  const email = "admin@db.com";
  const password = "admin123";
  const name = "Admin";
  
  // Simple hash (same as in auth.ts)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hashedPassword = `hash_${Math.abs(hash).toString(36)}_${password.length}`;
  
  const userId = generateId();
  
  try {
    await db.insert(users).values({
      id: userId,
      email,
      password: hashedPassword,
      name,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log("✅ Admin user created successfully!");
    console.log("   Email:", email);
    console.log("   Password:", password);
    console.log("   Role: admin");
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      console.log("⚠️  Admin user already exists");
    } else {
      console.error("❌ Error creating admin:", error);
    }
  }
  
  process.exit(0);
}

seedAdmin();
