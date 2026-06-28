export interface Profile {
  id: string;
  userId: string;          // FK → User.id
  dateOfBirth?: string;    // ISO date string
  phoneNumber?: string;    // e.g. +2348031234567
  nin?: string;            // 11 digits
  bvn?: string;            // 11 digits
  ninVerified: boolean;
  bvnVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Safe shape returned to clients — sensitive values are masked by the service.
export type SafeProfile = Omit<Profile, "nin" | "bvn"> & {
  nin?: string;   // masked, e.g. "********567"
  bvn?: string;   // masked, e.g. "********432"
};