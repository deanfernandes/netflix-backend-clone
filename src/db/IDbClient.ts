import { Account } from "./models/Account.js";

export default interface IDbClient {
  getAccountById(id: string): Promise<Account | null>;
}
