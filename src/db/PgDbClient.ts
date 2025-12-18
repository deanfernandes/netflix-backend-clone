import IDbClient from "./IDbClient.js";
import { Pool } from "pg";
import { Account } from "./models/Account.js";
import { AccountProfile } from "./models/AccountProfile.js";
import { Film } from "./models/Film.js";
import { AccountMembership } from "./models/AccountMembership.js";
import { AccountMembershipPlan } from "./models/AccountMembershipPlan.js";
import { Genre } from "./models/Genre.js";
import { CastMember } from "./models/CastMember.js";
import { Series } from "./models/Series.js";
import { ContentAgeRating, ContentRating } from "./models/Content.js";
import { Season } from "./models/Season.js";
import { Episode } from "./models/Episode.js";

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
      `
    SELECT 
      id,
      account_id AS "accountId",
      name,
      profile_image_url AS "profileImageUrl",
      pin_hash AS "pinHash"
    FROM account_profiles
    WHERE account_id = $1
    ORDER BY id ASC
    `,
      [accountId]
    );

    return res.rows;
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
      status: row.status.toUpperCase(),
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

  async hasProfileWatchedFilm(
    accountProfileId: string,
    filmId: string
  ): Promise<boolean> {
    const res = await this.pool.query<{ dummy: number }>(
      `
    SELECT 1 AS dummy
    FROM account_profile_film_views
    WHERE account_profile_id = $1 AND film_id = $2
    LIMIT 1
    `,
      [accountProfileId, filmId]
    );

    return (res!.rowCount ?? 0) > 0;
  }

  async getProfileFilmRating(
    accountProfileId: string,
    filmId: string
  ): Promise<ContentRating | null> {
    const res = await this.pool.query<{ rating: ContentRating }>(
      `
    SELECT rating
    FROM account_profile_film_ratings
    WHERE account_profile_id = $1 AND film_id = $2
    LIMIT 1
    `,
      [accountProfileId, filmId]
    );

    return res.rows[0]?.rating ?? null;
  }

  async getFilmGenres(filmId: string): Promise<Genre[]> {
    const res = await this.pool.query<Genre>(
      `
    SELECT g.id, g.name
    FROM genres g
    JOIN film_genres fg ON fg.genre_id = g.id
    WHERE fg.film_id = $1
    `,
      [filmId]
    );
    return res.rows;
  }

  async getFilmCastMembers(filmId: string): Promise<CastMember[]> {
    const res = await this.pool.query<CastMember>(
      `
    SELECT cm.id, cm.name
    FROM cast_members cm
    JOIN film_cast_members fcm ON fcm.cast_member_id = cm.id
    WHERE fcm.film_id = $1
  `,
      [filmId]
    );

    return res.rows;
  }

  async getFilms(options: {
    genreIds?: string[] | null;
    ageRating?: string | null;
    search?: string | null;
    limit?: number | null;
    offset?: number | null;
  }): Promise<Film[]> {
    const { genreIds, ageRating, search, limit = 20, offset = 0 } = options;

    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (genreIds && genreIds.length > 0) {
      conditions.push(`
      f.id IN (
        SELECT fg.film_id
        FROM film_genres fg
        WHERE fg.genre_id = ANY($${idx})
      )
    `);
      values.push(genreIds);
      idx++;
    }

    if (ageRating) {
      conditions.push(`f.age_rating = $${idx}`);
      values.push(ageRating);
      idx++;
    }

    if (search) {
      conditions.push(`(f.title ILIKE $${idx} OR f.synopsis ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    let query = `
    SELECT 
      f.id,
      f.title,
      f.synopsis,
      f.release_year AS "releaseYear",
      f.age_rating AS "ageRating",
      f.created_at AS "createdAt"
    FROM films f
  `;

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY f.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    values.push(limit, offset);

    const res = await this.pool.query<Film>(query, values);
    return res.rows;
  }

  async getNewFilms(limit: number = 20): Promise<Film[]> {
    const query = `
    SELECT 
      id,
      title,
      synopsis,
      release_year AS "releaseYear",
      age_rating AS "ageRating",
      created_at AS "createdAt"
    FROM films
    WHERE created_at >= now() - interval '1 month'
    ORDER BY created_at DESC
    LIMIT $1
  `;
    const res = await this.pool.query<Film>(query, [limit]);
    return res.rows;
  }

  async getPopularFilms(limit: number = 20): Promise<Film[]> {
    const query = `
    SELECT 
  f.id,
  f.title,
  f.synopsis,
  f.release_year AS "releaseYear",
  f.age_rating AS "ageRating",
  f.created_at AS "createdAt",
  COUNT(apfv.id) AS view_count
FROM films f
LEFT JOIN account_profile_film_views apfv ON apfv.film_id = f.id
GROUP BY f.id
ORDER BY view_count DESC, f.created_at DESC
LIMIT $1
  `;
    const res = await this.pool.query<Film>(query, [limit]);
    return res.rows;
  }

  async getSeriesById(id: string): Promise<Series | null> {
    const res = await this.pool.query(
      `SELECT id, title, synopsis, release_year, age_rating, created_at
     FROM series
     WHERE id = $1`,
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

  async hasUserWatchedSeries(
    seriesId: string,
    accountProfileId: string
  ): Promise<boolean> {
    const res = await this.pool.query(
      `SELECT 1 FROM account_profile_series_views
     WHERE series_id = $1 AND account_profile_id = $2`,
      [seriesId, accountProfileId]
    );

    return (res.rowCount ?? 0) > 0;
  }

  async getUserSeriesRating(
    seriesId: string,
    accountProfileId: string
  ): Promise<ContentRating | null> {
    const res = await this.pool.query(
      `SELECT rating FROM account_profile_series_ratings
     WHERE series_id = $1 AND account_profile_id = $2`,
      [seriesId, accountProfileId]
    );

    return res.rows[0]?.rating ?? null;
  }

  async getSeasonsBySeriesId(seriesId: string): Promise<Season[]> {
    const res = await this.pool.query(
      `SELECT id, number, age_rating, release_year, series_id
     FROM seasons
     WHERE series_id = $1
     ORDER BY number ASC`,
      [seriesId]
    );

    return res.rows.map((row) => ({
      id: row.id,
      number: row.number,
      ageRating: row.age_rating,
      releaseYear: row.release_year,
      seriesId: row.series_id,
    }));
  }
  async getGenresBySeriesId(seriesId: string): Promise<Genre[]> {
    const res = await this.pool.query(
      `SELECT g.id, g.name
     FROM genres g
     JOIN series_genres sg ON sg.genre_id = g.id
     WHERE sg.series_id = $1
     ORDER BY g.name ASC`,
      [seriesId]
    );

    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
    }));
  }
  async getCastMembersBySeriesId(seriesId: string): Promise<CastMember[]> {
    const res = await this.pool.query(
      `SELECT cm.id, cm.name
     FROM cast_members cm
     JOIN series_cast_members scm ON scm.cast_member_id = cm.id
     WHERE scm.series_id = $1
     ORDER BY cm.name ASC`,
      [seriesId]
    );

    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
    }));
  }
  async getSeriesList(
    limit: number = 50,
    offset: number = 0
  ): Promise<Series[]> {
    const res = await this.pool.query(
      `SELECT id, title, synopsis, release_year, age_rating, created_at
     FROM series
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.rows.map((row) => ({
      id: row.id,
      title: row.title,
      synopsis: row.synopsis,
      releaseYear: row.release_year,
      ageRating: row.age_rating,
      createdAt: row.created_at,
    }));
  }
  async getNewSeries(
    limit: number = 50,
    offset: number = 0
  ): Promise<Series[]> {
    const res = await this.pool.query(
      `SELECT id, title, synopsis, release_year, age_rating, created_at
     FROM series
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.rows.map((row) => ({
      id: row.id,
      title: row.title,
      synopsis: row.synopsis,
      releaseYear: row.release_year,
      ageRating: row.age_rating,
      createdAt: row.created_at,
    }));
  }
  async getPopularSeries(
    limit: number = 50,
    offset: number = 0
  ): Promise<Series[]> {
    const res = await this.pool.query(
      `SELECT s.id, s.title, s.synopsis, s.release_year, s.age_rating, s.created_at,
            COUNT(v.id) AS view_count
     FROM series s
     LEFT JOIN account_profile_series_views v ON v.series_id = s.id
     GROUP BY s.id
     ORDER BY view_count DESC
     LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.rows.map((row) => ({
      id: row.id,
      title: row.title,
      synopsis: row.synopsis,
      releaseYear: row.release_year,
      ageRating: row.age_rating,
      createdAt: row.created_at,
    }));
  }
  async getSeasonById(id: string): Promise<Season | null> {
    const res = await this.pool.query(
      `SELECT id, number, age_rating, release_year, series_id
     FROM seasons
     WHERE id = $1`,
      [id]
    );

    const row = res.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      number: row.number,
      ageRating: row.age_rating,
      releaseYear: row.release_year,
      seriesId: row.series_id,
    };
  }
  async getEpisodesBySeasonId(seasonId: string): Promise<Episode[]> {
    const res = await this.pool.query(
      `SELECT id, title, synopsis, duration_minutes, number, season_id
     FROM episodes
     WHERE season_id = $1
     ORDER BY number ASC`,
      [seasonId]
    );

    return res.rows.map((row) => ({
      id: row.id,
      title: row.title,
      synopsis: row.synopsis,
      durationMinutes: row.duration_minutes,
      number: row.number,
      seasonId: row.season_id,
    }));
  }
  async getEpisodeById(id: string) {
    const res = await this.pool.query(
      `
    SELECT
      id,
      title,
      synopsis,
      duration_minutes,
      number,
      season_id
    FROM episodes
    WHERE id = $1
    LIMIT 1
    `,
      [id]
    );

    const row = res.rows[0];
    if (!row) return null;

    return {
      id: row.id.toString(),
      title: row.title,
      synopsis: row.synopsis,
      durationMinutes: row.duration_minutes,
      number: row.number,
      seasonId: row.season_id.toString(),
    };
  }

  public async query(sql: string, params?: any[]) {
    return this.pool.query(sql, params);
  }
  public async close() {
    await this.pool.end();
  }
}
