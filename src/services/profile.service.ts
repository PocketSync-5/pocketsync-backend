import { Profile, SafeProfile } from "../models/profile.model";
import { Account, SafeAccount } from "../models/account.model";
import { createProfile, findProfileByUserId, updateProfile } from "../data/profile.store";
import { findAccountsByBvn } from "../data/account.store";
import { getSelection } from "../data/selection.store";
import {
  isValidBVN,
  isValidDOB,
  isValidNIN,
  isValidPhone,
} from "../utils/validators";

import { BadRequestError } from "../errors/badRequest.error";
import { NotFoundError } from "../errors/notFound.error";
import {
  ProfileResponse,
  UpdateProfileInput,
} from "../interfaces/profile.interface";

export class ProfileService {
  // GET — return current user's profile (masked), with accounts if a BVN is set
  static getProfile(userId: string): ProfileResponse {
    const profile = findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Profile not found");
    }
    return ProfileService.buildResponse(profile);
  }

  // POST — create a new profile for the authenticated user
  static createProfile(userId: string, input: UpdateProfileInput): ProfileResponse {
    if (findProfileByUserId(userId)) {
      throw new BadRequestError("Profile already exists — use PATCH to update");
    }

    ProfileService.validate(input);

    const created = createProfile({ userId, ...input });
    return ProfileService.buildResponse(created);
  }

  // PATCH — upsert: create if missing, update if it exists
  static upsertProfile(userId: string, input: UpdateProfileInput): ProfileResponse {
    ProfileService.validate(input);

    const existing = findProfileByUserId(userId);
    const result = existing
      ? updateProfile(userId, input)!
      : createProfile({ userId, ...input });

    return ProfileService.buildResponse(result);
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

  // Mask sensitive profile fields before returning to the client.
  private static toSafe(profile: Profile): SafeProfile {
    return {
      ...profile,
      nin: profile.nin ? "********" + profile.nin.slice(-3) : undefined,
      bvn: profile.bvn ? "********" + profile.bvn.slice(-3) : undefined,
    };
  }

  // Build the full profile response. When a BVN is present, the linked
  // accounts (masked) are attached so the client can render the account
  // selection screen immediately. `selectedAccountIds` reflects the user's
  // saved selection, defaulting to ALL accounts when none is saved yet.
  private static buildResponse(profile: Profile): ProfileResponse {
    const safeProfile = ProfileService.toSafe(profile);

    if (!profile.bvn) {
      return { profile: safeProfile };
    }

    const universe = findAccountsByBvn(profile.bvn);
    const allIds = universe.map((a) => a.id);
    const savedSelection = getSelection(profile.userId);
    const selectedIds = savedSelection ?? allIds;

    return {
      profile: safeProfile,
      accounts: universe.map(ProfileService.toSafeAccount),
      selectedAccountIds: selectedIds,
    };
  }

  // Mask an account's sensitive fields (mirrors the dashboard service masking).
  private static toSafeAccount(account: Account): SafeAccount {
    return {
      ...account,
      bvn: "********" + account.bvn.slice(-3),
      accountNumber: "******" + account.accountNumber.slice(-4),
    };
  }
}
