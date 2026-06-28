import { SafeProfile } from "../models/profile.model";

export interface UpdateProfileInput {
  dateOfBirth?: string;
  phoneNumber?: string;
  nin?: string;
  bvn?: string;
}

export interface ProfileResponse {
  profile: SafeProfile;
}