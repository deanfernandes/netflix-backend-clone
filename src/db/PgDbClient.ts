import IDbClient from "./IDbClient.js";
import { Pool } from "pg";
import { Account } from "./models/Account.js";

export default class PgDbClient implements IDbClient {
  private pool: Pool;

  constructor() {
    this.pool = new Pool();
  }
  async getAccountById(id: string): Promise<Account | null> {
    const res = await this.pool.query<Account>(
      `SELECT * FROM accounts
       WHERE id = $1`,
      [id]
    );
    return res.rows[0] || null;
  }
}
