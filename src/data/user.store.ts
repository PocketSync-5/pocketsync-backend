import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

// Demo credentials: email "johndoe@example.com" / password "password123"
const SEED_PASSWORD_HASH = bcrypt.hashSync("password123", 20);

export const users: User[] = [
  {
    id: "1",
    fullname: "John Doe",
    email: "johndoe@example.com",
    password: SEED_PASSWORD_HASH,
    createdAt: new Date().toISOString(),
  },
];

// Helper so other code never mutates the array directly in surprising ways.
export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}