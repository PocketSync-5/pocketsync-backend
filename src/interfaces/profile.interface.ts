import { SafeProfile } from "../models/profile.model";
import { SafeAccount } from "../models/account.model";

export interface UpdateProfileInput {
  dateOfBirth?: string;
  phoneNumber?: string;
  nin?: string;
  bvn?: string;
}

// `accounts` + `selectedAccountIds` are attached ONLY when the profile has a
// BVN set, so the client can render the "choose your accounts" screen right
// after onboarding — no extra round-trip needed.
export interface ProfileResponse {
  profile: SafeProfile;
  accounts?: SafeAccount[];
  selectedAccountIds?: string[];
}
