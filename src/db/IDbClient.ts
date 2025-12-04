import { Account } from "./models/Account.js";
import { AccountProfile } from "./models/AccountProfile.js";
import { AccountMembership } from "./models/AccountMembership.js";
import { AccountMembershipPlan } from "./models/AccountMembershipPlan.js";

export default interface IDbClient {
  getAccountById(id: string): Promise<Account | null>;
  getAccounts(limit?: number, offset?: number): Promise<Account[]>;

  getAccountProfileById(id: string): Promise<AccountProfile | null>;
  getAccountProfilesByAccountId(accountId: string): Promise<AccountProfile[]>;

  getAccountMembershipById(id: string): Promise<AccountMembership | null>;
  getAccountMembershipsByAccountId(
    accountId: string
  ): Promise<AccountMembership[]>;

  getAccountMembershipPlanById(
    id: string
  ): Promise<AccountMembershipPlan | null>;
}
