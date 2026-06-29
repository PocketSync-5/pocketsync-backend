// ─────────────────────────────────────────────────────────────
// In-memory account-selection store (placeholder).
// Keyed by userId → the account IDs the user has chosen to show.
// A user with NO saved entry is treated as "all accounts selected"
// by the dashboard service, so the very first dashboard view is
// never empty (all-selected-by-default).
// ─────────────────────────────────────────────────────────────

const selections = new Map<string, string[]>();

// Returns undefined when the user has never saved a selection.
export function getSelection(userId: string): string[] | undefined {
  return selections.get(userId);
}

export function setSelection(userId: string, accountIds: string[]): void {
  selections.set(userId, accountIds);
}
