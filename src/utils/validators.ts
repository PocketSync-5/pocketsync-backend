// +234803... or 0803... followed by 10 digits
const PHONE_REGEX = /^(\+234|0)\d{10}$/;

// NIN and BVN are both exactly 11 digits (Nigeria)
const NIN_REGEX = /^\d{11}$/;
const BVN_REGEX = /^\d{11}$/;

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function isValidNIN(nin: string): boolean {
  return NIN_REGEX.test(nin);
}

export function isValidBVN(bvn: string): boolean {
  return BVN_REGEX.test(bvn);
}

// Must be a valid past date and user must be at least 18 years old.
export function isValidDOB(iso: string): boolean {
  const dob = new Date(iso);
  if (isNaN(dob.getTime())) return false;

  const now = new Date();
  if (dob >= now) return false; // not in the past

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(now.getFullYear() - 18);
  return dob <= eighteenYearsAgo;
}