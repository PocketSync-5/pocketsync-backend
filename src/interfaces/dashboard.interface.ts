import { SafeAccount } from "../models/account.model";

export interface DashboardResponse {
  bvn: string;                  // masked, e.g. "********432"
  accountName: string;          // holder name shared across the linked accounts
  accounts: SafeAccount[];      // only the accounts the user has chosen to show
  totalBalance: number;         // sum of the DISPLAYED accounts (filtered set)
  currency: string;             // ISO 4217, e.g. "NGN"
  accountCount: number;         // number of accounts DISPLAYED
  selectedAccountIds: string[]; // effective selection (saved, or all by default)
}
