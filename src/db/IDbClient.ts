import { Account } from "./models/Account.js";
import { AccountProfile } from "./models/AccountProfile.js";
import { AccountMembership } from "./models/AccountMembership.js";
import { AccountMembershipPlan } from "./models/AccountMembershipPlan.js";
import { Film } from "./models/Film.js";
import { Genre } from "./models/Genre.js";
import { CastMember } from "./models/CastMember.js";

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

  getFilmById(id: string): Promise<Film | null>;
  hasProfileWatchedFilm(
    accountProfileId: string,
    filmId: string
  ): Promise<boolean>;

  getProfileFilmRating(
    accountProfileId: string,
    filmId: string
  ): Promise<number | null>;
  getFilmGenres(filmId: string): Promise<Genre[]>;
  getFilmCastMembers(filmId: string): Promise<CastMember[]>;

  getFilms(options: {
    genreIds?: string[] | null;
    ageRating?: string | null;
    search?: string | null;
    limit?: number | null;
    offset?: number | null;
  }): Promise<Film[]>;
  getNewFilms(limit?: number | null): Promise<Film[]>;
  getPopularFilms(limit?: number | null): Promise<Film[]>;
}
