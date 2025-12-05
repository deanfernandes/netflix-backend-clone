import IDbClient from "./IDbClient.js";
import { Pool } from "pg";
import { Account } from "./models/Account.js";
import { AccountProfile } from "./models/AccountProfile.js";
import { Film } from "./models/Film.js";
import { AccountMembership } from "./models/AccountMembership.js";
import { AccountMembershipPlan } from "./models/AccountMembershipPlan.js";

export default class PgDbClient implements IDbClient {
  private pool: Pool;

  constructor() {
    this.pool = new Pool();
  }

  async getAccounts(
    limit: number = 50,
    offset: number = 0
  ): Promise<Account[]> {
    const res = await this.pool.query(
      `SELECT * FROM accounts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.rows.map((row) => ({
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      mobileNumber: row.mobile_number,
      createdAt: row.created_at,
    }));
  }

  async getAccountById(id: string): Promise<Account | null> {
    const res = await this.pool.query(`SELECT * FROM accounts WHERE id = $1`, [
      id,
    ]);
    const row = res.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      mobileNumber: row.mobile_number,
      createdAt: row.created_at,
    };
  }

  async getAccountProfileById(id: string): Promise<AccountProfile | null> {
    const res = await this.pool.query(
      `SELECT * FROM account_profiles WHERE id = $1`,
      [id]
    );
    const row = res.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      profileImageUrl: row.profile_image_url ?? null,
      pinHash: row.pin_hash ?? null,
      accountId: row.account_id,
    };
  }

  async getAccountProfilesByAccountId(
    accountId: string
  ): Promise<AccountProfile[]> {
    const res = await this.pool.query(
      `SELECT * FROM account_profiles WHERE account_id = $1`,
      [accountId]
    );

    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      profileImageUrl: row.profile_image_url ?? null,
      pinHash: row.pin_hash ?? null,
      accountId: row.account_id,
    }));
  }

  async getAccountMembershipById(
    id: string
  ): Promise<AccountMembership | null> {
    const res = await this.pool.query(
      `
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
      LIMIT 1
      `,
      [id]
    );

    const row = res.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      autoRenew: row.auto_renew,
      accountId: row.account_id,
      accountMembershipPlanId: row.account_membership_plan_id,
      accountMembershipPrice: row.account_membership_price,
    };
  }

  async getAccountMembershipsByAccountId(
    accountId: string
  ): Promise<AccountMembership[]> {
    const res = await this.pool.query(
      `
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
      WHERE account_id = $1
      `,
      [accountId]
    );

    return res.rows.map((row) => ({
      id: row.id,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      autoRenew: row.auto_renew,
      accountId: row.account_id,
      accountMembershipPlanId: row.account_membership_plan_id,
      accountMembershipPrice: row.account_membership_price,
    }));
  }

  async getAccountMembershipPlanById(
    id: string
  ): Promise<AccountMembershipPlan | null> {
    const res = await this.pool.query(
      `SELECT id, name, monthly_price FROM account_membership_plans WHERE id = $1 LIMIT 1`,
      [id]
    );

    const row = res.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      monthlyPrice: row.monthly_price,
    };
  }

  async getFilmById(id: string): Promise<Film | null> {
    const res = await this.pool.query(
      `
      SELECT
        id,
        title,
        synopsis,
        release_year,
        age_rating,
        created_at
      FROM films
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    const row = res.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      synopsis: row.synopsis,
      releaseYear: row.release_year,
      ageRating: row.age_rating,
      createdAt: row.created_at,
    };
  }
}
