import { SafeAccount } from "../models/account.model";

export interface DashboardResponse {
  bvn: string;            // masked, e.g. "********432"
  accountName: string;    // holder name shared across the linked accounts
  accounts: SafeAccount[]; // each account (masked)
  totalBalance: number;   // sum of every account's balance
  currency: string;       // ISO 4217, e.g. "NGN"
  accountCount: number;   // number of accounts linked to the BVN
}
