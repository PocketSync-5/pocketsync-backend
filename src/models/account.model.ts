// Type of bank account — affects how the balance behaves on a dashboard.
// savings      → everyday account, usually interest-bearing
// current      → checking account, typically no interest
// fixed        → locked term deposit
// domiciliary  → foreign-currency account (USD/GBP/EUR)
export type AccountType = "savings" | "current" | "fixed" | "domiciliary";

export interface Account {
  id: string;
  bvn: string;            // join key — stored raw so lookups can match; never the PK
  accountName: string;    // account holder name, e.g. "JOHN DOE"
  bankName: string;       // institution, e.g. "Access Bank"
  accountNumber: string;  // 10-digit NUBAN
  accountType?: AccountType;
  balance: number;        // per-account balance (whole currency units, e.g. Naira)
  currency: string;       // ISO 4217, e.g. "NGN"
  createdAt: string;      // ISO date string
  updatedAt: string;      // ISO date string
}

// Safe shape returned to clients — sensitive values are masked by the service.
export type SafeAccount = Omit<Account, "bvn" | "accountNumber"> & {
  bvn: string;            // masked, e.g. "********432"
  accountNumber: string;  // masked, e.g. "******1234"
};
