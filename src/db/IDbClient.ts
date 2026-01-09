import { Account } from "./models/Account.js";
import { AccountProfile } from "./models/AccountProfile.js";
import { AccountMembership } from "./models/AccountMembership.js";
import { AccountMembershipPlan } from "./models/AccountMembershipPlan.js";
import { Film } from "./models/Film.js";
import { Genre } from "./models/Genre.js";
import { CastMember } from "./models/CastMember.js";
import { Series } from "./models/Series.js";
import { Season } from "./models/Season.js";
import { ContentRating } from "./models/Content.js";
import { Episode } from "./models/Episode.js";
import { WatchlistFilm, WatchlistSeries } from "./models/Watchlist.js";

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
  ): Promise<ContentRating | null>;
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
  getSeriesById(id: string): Promise<Series | null>;
  hasUserWatchedSeries(
    seriesId: string,
    accountProfileId: string
  ): Promise<boolean>;
  getUserSeriesRating(
    seriesId: string,
    accountProfileId: string
  ): Promise<ContentRating | null>;
  getSeasonsBySeriesId(seriesId: string): Promise<Season[]>;
  getGenresBySeriesId(seriesId: string): Promise<Genre[]>;
  getCastMembersBySeriesId(seriesId: string): Promise<CastMember[]>;
  getSeriesList(limit?: number, offset?: number): Promise<Series[]>;
  getNewSeries(limit?: number, offset?: number): Promise<Series[]>;
  getPopularSeries(limit?: number, offset?: number): Promise<Series[]>;
  getSeasonById(id: string): Promise<Season | null>;
  getEpisodesBySeasonId(seasonId: string): Promise<Episode[]>;
  getEpisodeById(id: string): Promise<Episode | null>;
  getWatchlistFilms(profileId: number): Promise<WatchlistFilm[]>;
  getWatchlistSeries(profileId: number): Promise<WatchlistSeries[]>;
  updateMembershipAutoRenew(
    accountMembershipId: string,
    autoRenew: boolean
  ): Promise<AccountMembership | null>;
  cancelMembership(
    accountMembershipId: string
  ): Promise<AccountMembership | null>;
  createProfile(
    accountId: string,
    name: string,
    profileImageUrl?: string,
    pin?: string
  ): Promise<AccountProfile | null>;
  updateProfile(
    profileId: string,
    name?: string,
    profileImageUrl?: string,
    pin?: string
  ): Promise<AccountProfile | null>;
  deleteProfile(profileId: string): Promise<boolean>;
  setProfilePin(profileId: string, pin: string): Promise<AccountProfile | null>;
  deleteProfilePin(profileId: string): Promise<AccountProfile | null>;
}
