import { Episode } from "../../src/db/models/Episode";
import { Season } from "../../src/db/models/Season";
import { Series } from "../../src/db/models/Series";
import { WatchlistFilm, WatchlistSeries } from "../../src/db/models/Watchlist";

export const mockAccount = {
  id: "1",
  email: "user1@example.com",
  passwordHash: "hashedpassword",
  mobileNumber: "5550000001",
  createdAt: new Date().toISOString(),
};

export const mockAccounts = [
  mockAccount,
  {
    id: "2",
    email: "user2@example.com",
    passwordHash: "hash2",
    mobileNumber: "5550000002",
    createdAt: new Date().toISOString(),
  },
];

export const mockProfiles = [
  {
    id: "1",
    accountId: "1",
    name: "Profile 1",
    profileImageUrl: "https://example.com/profile1.png",
    hasPin: false,
  },
  {
    id: "2",
    accountId: "1",
    name: "Profile 2",
    profileImageUrl: "https://example.com/profile2.png",
    hasPin: true,
  },
  {
    id: "3",
    accountId: "2",
    name: "Other Account Profile",
    profileImageUrl: "https://example.com/profile3.png",
    hasPin: false,
  },
];

export const mockAccountMemberships = [
  {
    id: "1",
    accountId: "1",
    accountMembershipPlanId: 101,
    accountMembershipPrice: 9.99,
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-12-31T23:59:59.999Z",
    status: "active",
    autoRenew: true,
  },
  {
    id: "2",
    accountId: "1",
    accountMembershipPlanId: 102,
    accountMembershipPrice: 19.99,
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-12-31T23:59:59.999Z",
    status: "expired",
    autoRenew: false,
  },
];

export const mockAccountMembershipPlans = [
  {
    id: 101,
    name: "Standard",
    monthlyPrice: 9.99,
  },
  {
    id: 102,
    name: "Premium",
    monthlyPrice: 19.99,
  },
];

export const mockFilms = [
  {
    id: "1",
    title: "Action Movie",
    synopsis: "An action-packed movie",
    releaseYear: 2023,
    ageRating: "PG",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Drama Movie",
    synopsis: "A dramatic story",
    releaseYear: 2022,
    ageRating: "15",
    createdAt: new Date().toISOString(),
  },
];

export const mockGenres = [
  { id: "1", name: "Action" },
  { id: "2", name: "Drama" },
];

export const mockCastMembers = [
  { id: "1", name: "Actor One" },
  { id: "2", name: "Actor Two" },
];

export const mockSeriesList = [
  {
    id: "1",
    title: "Epic Adventure",
    synopsis: "An epic journey across the world.",
    releaseYear: 2023,
    ageRating: "PG",
    createdAt: new Date(),
    userRating: "thumbs_up",
  },
  {
    id: "2",
    title: "Drama Series",
    synopsis: "A compelling dramatic story.",
    releaseYear: 2022,
    ageRating: "15",
    createdAt: new Date(),
    userRating: "thumbs_down",
  },
];

export const mockSeasons: Season[] = [
  {
    id: "1",
    number: 1,
    ageRating: "PG",
    releaseYear: 2023,
    seriesId: "1",
  },
  {
    id: "2",
    number: 2,
    ageRating: "12",
    releaseYear: 2024,
    seriesId: "1",
  },
];

export const mockSeriesGenres = [
  { id: "1", name: "Action" },
  { id: "2", name: "Drama" },
];

export const mockSeriesCastMembers = [
  { id: "1", name: "Actor One" },
  { id: "2", name: "Actor Two" },
];

export const mockNewSeriesList: Series[] = [
  {
    id: "1",
    title: "Galactic Adventures",
    synopsis: "A sci-fi epic across the galaxy.",
    releaseYear: 2025,
    ageRating: "PG",
    createdAt: new Date(),
    userRating: null,
  },
  {
    id: "2",
    title: "Mystery Manor",
    synopsis: "Unravel secrets in an old mansion.",
    releaseYear: 2024,
    ageRating: "12",
    createdAt: new Date(),
    userRating: null,
  },
  {
    id: "3",
    title: "Comedy Nights",
    synopsis: "Laughs and pranks in every episode.",
    releaseYear: 2023,
    ageRating: "U",
    createdAt: new Date(),
    userRating: null,
  },
];

export const mockPopularSeriesList: Series[] = [
  {
    id: "1",
    title: "Galactic Adventures",
    synopsis: "A sci-fi epic across the galaxy.",
    releaseYear: 2025,
    ageRating: "PG",
    createdAt: new Date(),
    userRating: null,
  },
  {
    id: "2",
    title: "Mystery Manor",
    synopsis: "Unravel secrets in an old mansion.",
    releaseYear: 2024,
    ageRating: "12",
    createdAt: new Date(),
    userRating: null,
  },
  {
    id: "3",
    title: "Comedy Nights",
    synopsis: "Laughs and pranks in every episode.",
    releaseYear: 2023,
    ageRating: "U",
    createdAt: new Date(),
    userRating: null,
  },
];

export const mockEpisodes = [
  {
    id: "1",
    title: "Pilot Episode",
    synopsis: "The story begins with an unexpected event.",
    durationMinutes: 45,
    number: 1,
    seasonId: "1",
  },
  {
    id: "2",
    title: "Second Episode",
    synopsis: "Tensions rise as new challenges appear.",
    durationMinutes: 50,
    number: 2,
    seasonId: "1",
  },
  {
    id: "3",
    title: "Third Episode",
    synopsis: "Secrets are revealed, changing everything.",
    durationMinutes: 48,
    number: 3,
    seasonId: "2",
  },
];

export const mockWatchlistFilms: WatchlistFilm[] = [
  { accountProfileId: 1, filmId: 1 },
];

export const mockWatchlistSeries: WatchlistSeries[] = [
  { accountProfileId: 1, seriesId: 1 },
];

export const dbMocks = {
  getAccounts: async (limit?: number, offset?: number) => {
    const start = offset ?? 0;
    const end = limit != null ? start + limit : mockAccounts.length;
    return mockAccounts.slice(start, end);
  },

  getAccountById: async (id: string) =>
    mockAccounts.find((acc) => acc.id === id) ?? null,

  getAccountProfilesByAccountId: async (accountId: string) =>
    mockProfiles.filter((p) => p.accountId === accountId),

  getAccountMembershipsByAccountId: async (accountId: string) =>
    mockAccountMemberships.filter((m) => m.accountId === accountId),

  getAccountProfileById: async (id: string) =>
    mockProfiles.find((p) => p.id === id) ?? null,

  getAccountMembershipById: async (id: string) =>
    mockAccountMemberships.find((m) => m.id === id) ?? null,

  getAccountMembershipPlanById: async (id: string) =>
    mockAccountMembershipPlans.find((p) => p.id === Number(id)) ?? null,

  getFilmById: async (id: string) => mockFilms.find((f) => f.id === id) ?? null,
  hasProfileWatchedFilm: async (_profileId: string, filmId: string) =>
    !!mockFilms.find((f) => f.id === filmId),
  getProfileFilmRating: async (_profileId: string, filmId: string) =>
    mockFilms.find((f) => f.id === filmId) ? "thumbs_up" : null,
  getFilmGenres: async (filmId: string) => mockGenres,

  getFilmCastMembers: async (filmId: string) => mockCastMembers,

  getFilms: async (args: {
    genreIds?: string[] | null;
    ageRating?: string | null;
    search?: string | null;
    limit?: number | null;
    offset?: number | null;
  }) => {
    let films = [...mockFilms];

    if (args.ageRating) {
      films = films.filter((f) => f.ageRating === args.ageRating);
    }

    if (args.genreIds && args.genreIds.length > 0) {
      films = films.filter((f) => f.id === "1" || f.id === "2"); // stub logic
    }

    if (args.search) {
      films = films.filter((f) =>
        f.title.toLowerCase().includes(args.search.toLowerCase())
      );
    }

    const offset = args.offset ?? 0;
    const limit = args.limit ?? 20;

    return films.slice(offset, offset + limit);
  },
  getNewFilms: async (limit: number = 20) => {
    const sorted = [...mockFilms].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.slice(0, limit);
  },
  getPopularFilms: async (limit: number = 20) => {
    const sorted = [...mockFilms].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.slice(0, limit);
  },

  getSeriesList: async (limit: number = 50, offset: number = 0) => {
    const series = [...mockSeriesList];
    return series.slice(offset, offset + limit);
  },

  getSeasonsBySeriesId: async (seriesId: string) => {
    return mockSeasons.filter((s) => s.seriesId === seriesId);
  },
  getGenresBySeriesId: async (seriesId: string) => {
    return mockSeriesGenres;
  },
  getCastMembersBySeriesId: async (seriesId: string) => {
    return mockSeriesCastMembers;
  },
  getSeriesById: async (id: string) => {
    return mockSeriesList.find((s) => s.id === id) ?? null;
  },
  hasUserWatchedSeries: async (seriesId: string, profileId: string) => {
    return false;
  },
  getUserSeriesRating: async (seriesId: string, profileId: string) => {
    return mockSeriesList.find((s) => s.id === seriesId)?.userRating ?? null;
  },
  getNewSeries: async (limit?: number, offset?: number): Promise<Series[]> => {
    return mockNewSeriesList;
  },
  getPopularSeries: async (
    limit?: number,
    offset?: number
  ): Promise<Series[]> => {
    return mockPopularSeriesList;
  },
  getEpisodesBySeasonId: async (seasonId: string): Promise<Episode[]> => {
    return mockEpisodes;
  },
  getSeasonById: async (id: string): Promise<Season | null> => {
    return mockSeasons.find((s) => s.id === id) || null;
  },

  getEpisodeById: async (id: string): Promise<Episode | null> => {
    return mockEpisodes.find((e) => e.id === id) || null;
  },

  getWatchlistFilms: async (profileId: number) => {
    return mockWatchlistFilms.filter((wf) => wf.accountProfileId === profileId);
  },

  getWatchlistSeries: async (profileId: number) => {
    return mockWatchlistSeries.filter(
      (ws) => ws.accountProfileId === profileId
    );
  },
};
