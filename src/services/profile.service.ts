import { Profile, SafeProfile } from "../models/profile.model";
import { createProfile, findProfileByUserId, updateProfile } from "../data/profile.store";
import {
  isValidBVN,
  isValidDOB,
  isValidNIN,
  isValidPhone,
} from "../utils/validators";

import { BadRequestError } from "../errors/badRequest.error";
import { NotFoundError } from "../errors/notFound.error";
import { UpdateProfileInput } from "../interfaces/profile.interface";

export class ProfileService {
  // GET — return current user's profile (masked)
  static getProfile(userId: string): SafeProfile {
    const profile = findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Profile not found");
    }
    return ProfileService.toSafe(profile);
  }

  // POST — create a new profile for the authenticated user
  static createProfile(userId: string, input: UpdateProfileInput): SafeProfile {
    if (findProfileByUserId(userId)) {
      throw new BadRequestError("Profile already exists — use PATCH to update");
    }

    ProfileService.validate(input);

    const created = createProfile({ userId, ...input });
    return ProfileService.toSafe(created);
  }

  // PATCH — upsert: create if missing, update if it exists
  static upsertProfile(userId: string, input: UpdateProfileInput): SafeProfile {
    ProfileService.validate(input);

    const existing = findProfileByUserId(userId);
    const result = existing
      ? updateProfile(userId, input)!
      : createProfile({ userId, ...input });

    return ProfileService.toSafe(result);
  }

  // ---- helpers -------------------------------------------------------

  private static validate(input: UpdateProfileInput): void {
    if (input.phoneNumber && !isValidPhone(input.phoneNumber)) {
      throw new BadRequestError("Invalid Nigerian phone number");
    }
    if (input.nin && !isValidNIN(input.nin)) {
      throw new BadRequestError("NIN must be exactly 11 digits");
    }
    if (input.bvn && !isValidBVN(input.bvn)) {
      throw new BadRequestError("BVN must be exactly 11 digits");
    }
    if (input.dateOfBirth && !isValidDOB(input.dateOfBirth)) {
      throw new BadRequestError("Date of birth is invalid or under 18");
    }
  }

  // Mask sensitive fields before returning to the client.
  private static toSafe(profile: Profile): SafeProfile {
    return {
      ...profile,
      nin: profile.nin ? "********" + profile.nin.slice(-3) : undefined,
      bvn: profile.bvn ? "********" + profile.bvn.slice(-3) : undefined,
    };
  }
}