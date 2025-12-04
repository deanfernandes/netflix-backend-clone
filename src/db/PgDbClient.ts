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

  async getAccountMembershipById(id: string) {
    const query = `
    SELECT
      id,
      start_date,
      end_date,
      status,
      auto_renew,
      account_id,
      account_membership_plan_id,
      account_membership_price
    FROM account_memberships
    WHERE id = $1
    LIMIT 1;
  `;

    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) return null;

    return result.rows[0];
  }

  async getAccountMembershipsByAccountId(accountId: string) {
    const query = `
    SELECT
      id,
      start_date,
      end_date,
      status,
      auto_renew,
      account_id,
      account_membership_plan_id,
      account_membership_price
    FROM account_memberships
    WHERE account_id = $1;
  `;

    const result = await this.pool.query(query, [accountId]);
    return result.rows;
  }

  async getAccountMembershipPlanById(id: string) {
    const result = await this.pool.query(
      `SELECT id, name, monthly_price FROM account_membership_plans WHERE id = $1 LIMIT 1;`,
      [id]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
  }
}
