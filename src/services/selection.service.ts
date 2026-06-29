import { findProfileByUserId } from "../data/profile.store";
import { findAccountsByBvn } from "../data/account.store";
import { setSelection } from "../data/selection.store";

import { BadRequestError } from "../errors/badRequest.error";
import { SelectionResponse } from "../interfaces/selection.interface";

export class SelectionService {
  // PATCH — persist the set of account IDs the user wants on their dashboard.
  static setSelection(
    userId: string,
    input: { accountIds?: unknown }
  ): SelectionResponse {
    const raw = input.accountIds;

    if (!Array.isArray(raw)) {
      throw new BadRequestError("accountIds must be an array of strings");
    }

    // Coerce + de-duplicate the incoming IDs.
    const ids = [...new Set(raw.map((id) => String(id)))];

    // Ownership guard: the user must have a profile + BVN, and every ID they
    // send must belong to one of their OWN accounts. This keeps a user from
    // surfacing someone else's account on their dashboard.
    const profile = findProfileByUserId(userId);
    if (!profile || !profile.bvn) {
      throw new BadRequestError("Add your BVN to your profile first");
    }

    const validIds = new Set(findAccountsByBvn(profile.bvn).map((a) => a.id));
    const invalid = ids.filter((id) => !validIds.has(id));
    if (invalid.length > 0) {
      throw new BadRequestError(
        "One or more account IDs are invalid or don't belong to you"
      );
    }

    setSelection(userId, ids);
    return { accountIds: ids };
  }
}
