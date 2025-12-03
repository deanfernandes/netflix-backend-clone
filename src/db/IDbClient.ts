import { Account } from "./models/Account.js";
import { AccountProfile } from "./models/AccountProfile.js";

export default interface IDbClient {
  getAccountById(id: string): Promise<Account | null>;
  getAccounts(limit?: number, offset?: number): Promise<Account[]>;

  getAccountProfileById(id: string): Promise<AccountProfile | null>;
  getAccountProfilesByAccountId(accountId: string): Promise<AccountProfile[]>;
}
