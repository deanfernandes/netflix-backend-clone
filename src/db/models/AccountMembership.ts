import type { AccountMembershipStatus } from "./AccountMembershipStatus.js";

export interface AccountMembership {
  id: string;
  startDate: Date;
  endDate: Date;
  status: AccountMembershipStatus;
  autoRenew: boolean;
  accountId: string;
  accountMembershipPlanId: string;
  accountMembershipPrice: string;
}
