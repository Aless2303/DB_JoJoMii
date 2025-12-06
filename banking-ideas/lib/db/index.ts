import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create postgres connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Helper to generate unique IDs
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to get next available page number
export async function getNextPageNumber(): Promise<number> {
  const result = await db.query.ideas.findFirst({
    orderBy: (ideas, { desc }) => [desc(ideas.pageNumber)],
  });
  
  // Start from page 110 for ideas (100-109 reserved for system pages)
  return result?.pageNumber ? result.pageNumber + 10 : 110;
}
