import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db, generateId } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

// Simple hash function (in production, use bcrypt)
function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(36)}_${password.length}`;
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" }, // 'login' or 'register'
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password, action, name } = credentials;

        // Registration
        if (action === "register") {
          // Check if user exists
          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (existingUser) {
            throw new Error("User already exists");
          }

          // Create new user
          const userId = generateId();
          const hashedPassword = hashPassword(password);
          const userName = name || email.split("@")[0];
          
          await db.insert(users).values({
            id: userId,
            email,
            password: hashedPassword,
            name: userName,
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          return {
            id: userId,
            email,
            name: userName,
            role: "user",
          };
        }

        // Login
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        if (!verifyPassword(password, user.password)) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email.split("@")[0],
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // We'll handle sign in on the main page with modals
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

// Type augmentation for next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "guest" | "user" | "admin";
    };
  }
  
  interface User {
    id: string;
    email: string;
    name: string;
    role: "guest" | "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "guest" | "user" | "admin";
  }
}
