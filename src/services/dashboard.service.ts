import { Account, SafeAccount } from "../models/account.model";
import { findAccountsByBvn } from "../data/account.store";

import { BadRequestError } from "../errors/badRequest.error";
import { NotFoundError } from "../errors/notFound.error";
import { isValidBVN } from "../utils/validators";
import { DashboardResponse } from "../interfaces/dashboard.interface";

export class DashboardService {
  // GET — aggregated view of every account linked to the given BVN.
  static getDashboard(bvn: string): DashboardResponse {
    // The bvn comes from the URL param, so validate it before doing anything.
    if (!bvn || !isValidBVN(bvn)) {
      throw new BadRequestError("BVN must be exactly 11 digits");
    }

    const accounts = findAccountsByBvn(bvn);

    // No accounts = nothing to aggregate. 404 is more accurate than an empty 200.
    if (accounts.length === 0) {
      throw new NotFoundError("No accounts found for this BVN");
    }

    // totalBalance is COMPUTED here from each account's balance — it is never
    // stored, so it is always in sync with the underlying accounts.
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    return {
      bvn: DashboardService.maskBvn(bvn),
      accountName: accounts[0].accountName, // accounts share a bvn → same holder
      accounts: accounts.map(DashboardService.toSafe),
      totalBalance,
      currency: accounts[0].currency,
      accountCount: accounts.length,
    };
  }

  // ---- helpers -------------------------------------------------------

  // Mask BVN the same way the profile service does: show the last 3 digits.
  private static maskBvn(bvn: string): string {
    return "********" + bvn.slice(-3);
  }

  // Mask account number: show only the last 4 digits (e.g. "******1234").
  private static maskAccountNumber(accountNumber: string): string {
    return "******" + accountNumber.slice(-4);
  }

  // Mask sensitive fields before returning an account to the client.
  private static toSafe(account: Account): SafeAccount {
    return {
      ...account,
      bvn: DashboardService.maskBvn(account.bvn),
      accountNumber: DashboardService.maskAccountNumber(account.accountNumber),
    };
  }
}
