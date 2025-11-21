import type { AccountMembershipStatus } from "./AccountMembershipStatus";

export interface AccountMembership {
  id: string;
  start_date: Date;
  end_date: Date;
  status: AccountMembershipStatus;
  auto_renew: boolean;
  account_id: string;
  account_membership_plan_id: string;
  account_membership_price: string;
}
