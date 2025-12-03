import IDbClient from "./IDbClient.js";
import { Pool } from "pg";
import { Account } from "./models/Account.js";
import { AccountProfile } from "./models/AccountProfile.js";

export default class PgDbClient implements IDbClient {
  private pool: Pool;

  constructor() {
    this.pool = new Pool();
  }
  async getAccounts(
    limit: number = 50,
    offset: number = 0
  ): Promise<Account[]> {
    const res = await this.pool.query<Account>(
      `
    SELECT * FROM accounts
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `,
      [limit, offset]
    );

    return res.rows;
  }
  async getAccountById(id: string): Promise<Account | null> {
    const res = await this.pool.query<Account>(
      `SELECT * FROM accounts
       WHERE id = $1`,
      [id]
    );
    return res.rows[0] || null;
  }

  async getAccountProfileById(id: string): Promise<AccountProfile | null> {
    const res = await this.pool.query<AccountProfile>(
      `SELECT * FROM account_profiles WHERE id = $1`,
      [id]
    );
    return res.rows[0] || null;
  }

  async getAccountProfilesByAccountId(
    accountId: string
  ): Promise<AccountProfile[]> {
    const res = await this.pool.query<AccountProfile>(
      `SELECT * FROM account_profiles WHERE account_id = $1`,
      [accountId]
    );
    return res.rows;
  }
}
