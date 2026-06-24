import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

// ─────────────────────────────────────────────────────────────
// In-memory user store (placeholder).
// Replace this with a real DB (Prisma/Mongoose/SQL) later — the
// AuthService only depends on the helpers below, so swapping the
// source is easy.
// ─────────────────────────────────────────────────────────────

// Hash seed passwords synchronously so the example user is always valid.
// Demo credentials: email "johndoe@example.com" / password "password123"
// Cost factor 10 = industry standard (~0.1s per hash). DO NOT use 20+.
const SEED_PASSWORD_HASH = bcrypt.hashSync("password123", 10);

export const users: User[] = [
  {
    id: "1",
    fullname: "John Doe",
    email: "johndoe@example.com",
    password: SEED_PASSWORD_HASH,
    createdAt: new Date().toISOString(),
  },
];

// Simple auto-increment counter for new user IDs.
// Starting at 1 accounts for the seed user above.
let nextId = 2;

// Look up a user by email (case-insensitive).
export function findUserByEmail(email: string): User | undefined {
  const normalized = email.toLowerCase().trim();
  return users.find((u) => u.email === normalized);
}

/**
 * Create a new user with a hashed password.
 * Returns the created user (without exposing the hash to the caller's logic).
 * Throws ConflictError via the caller if the email already exists.
 */
export function createUser(input: {
  fullname: string;
  email: string;
  password: string; // plaintext — will be hashed here
}): User {
  const normalizedEmail = input.email.toLowerCase().trim();
  const trimmedName = input.fullname.trim();

  const newUser: User = {
    id: String(nextId++),
    fullname: trimmedName,
    email: normalizedEmail,
    password: bcrypt.hashSync(input.password, 10),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return newUser;
}