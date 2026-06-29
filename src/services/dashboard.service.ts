import { Account, SafeAccount } from "../models/account.model";
import { findAccountsByBvn } from "../data/account.store";
import { findProfileByUserId } from "../data/profile.store";
import { getSelection } from "../data/selection.store";

import { BadRequestError } from "../errors/badRequest.error";
import { NotFoundError } from "../errors/notFound.error";
import { DashboardResponse } from "../interfaces/dashboard.interface";

export class DashboardService {
  // GET — aggregated view of the logged-in user's SELECTED accounts.
  // The BVN is derived from the user's profile (never from the request), so a
  // user can only ever see accounts that belong to them. If the user hasn't
  // explicitly chosen a subset, ALL their accounts are shown by default.
  static getDashboard(userId: string): DashboardResponse {
    const profile = findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Profile not found — create a profile first");
    }
    if (!profile.bvn) {
      throw new BadRequestError("Add your BVN to your profile to view your dashboard");
    }

    // universe = every account linked to this user's BVN (raw bvn, from storage)
    const universe = findAccountsByBvn(profile.bvn);
    if (universe.length === 0) {
      throw new NotFoundError("No accounts found for this BVN");
    }

    // No saved selection → treat as "all selected" so the first view isn't empty.
    const allIds = universe.map((a) => a.id);
    const savedSelection = getSelection(userId);
    const selectedIds = savedSelection ?? allIds;

    // Defensive: drop any IDs that aren't in the current universe (e.g. the
    // user changed their BVN). Always re-validate ownership on read.
    const displayed = universe.filter((a) => selectedIds.includes(a.id));

    // totalBalance reflects ONLY the displayed (selected) accounts.
    const totalBalance = displayed.reduce((sum, a) => sum + a.balance, 0);

    return {
      bvn: DashboardService.maskBvn(profile.bvn),
      accountName: universe[0].accountName,
      accounts: displayed.map(DashboardService.toSafe),
      totalBalance,
      currency: universe[0].currency,
      accountCount: displayed.length,
      selectedAccountIds: selectedIds.filter((id) => allIds.includes(id)),
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
