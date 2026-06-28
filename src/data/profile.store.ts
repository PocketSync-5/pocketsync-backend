import { Profile } from "../models/profile.model";

// ─────────────────────────────────────────────────────────────
// In-memory profile store (placeholder).
// Replace this with a real DB (Prisma/Mongoose/SQL) later — the
// ProfileService only depends on the helpers below, so swapping the
// source is easy.
// ─────────────────────────────────────────────────────────────

export const profiles: Profile[] = [];

// Simple auto-increment counter for new profile IDs.
let nextId = 1;

// Look up a profile by the owning user's id.
export function findProfileByUserId(userId: string): Profile | undefined {
  return profiles.find((p) => p.userId === userId);
}

/**
 * Create a new profile linked to a user.
 * All fields are optional except userId — the user can fill them in later.
 */
export function createProfile(input: {
  userId: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  nin?: string;
  bvn?: string;
}): Profile {
  const now = new Date().toISOString();

  const newProfile: Profile = {
    id: String(nextId++),
    userId: input.userId,
    dateOfBirth: input.dateOfBirth,
    phoneNumber: input.phoneNumber,
    nin: input.nin,
    bvn: input.bvn,
    ninVerified: false,
    bvnVerified: false,
    phoneVerified: false,
    createdAt: now,
    updatedAt: now,
  };

  profiles.push(newProfile);
  return newProfile;
}

/**
 * Update an existing profile (partial patch).
 * Only the provided fields are touched — omitted fields stay unchanged.
 * Verification flags are intentionally NOT editable here; they change only
 * via a future verification flow.
 */
export function updateProfile(
  userId: string,
  patch: Partial<Pick<Profile, "dateOfBirth" | "phoneNumber" | "nin" | "bvn">>
): Profile | undefined {
  const profile = findProfileByUserId(userId);
  if (!profile) return undefined;

  if (patch.dateOfBirth !== undefined) profile.dateOfBirth = patch.dateOfBirth;
  if (patch.phoneNumber !== undefined) profile.phoneNumber = patch.phoneNumber;
  if (patch.nin !== undefined) profile.nin = patch.nin;
  if (patch.bvn !== undefined) profile.bvn = patch.bvn;

  profile.updatedAt = new Date().toISOString();
  return profile;
}