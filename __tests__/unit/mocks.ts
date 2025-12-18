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
    title: "Test Film",
    synopsis: "Test synopsis",
    releaseYear: 2023,
    ageRating: "PG",
    createdAt: new Date().toISOString(),
  },
];

export const mockGenres = [
  {
    id: "1",
    name: "Action",
  },
];

export const mockCastMembers = [
  {
    id: "1",
    name: "Actor One",
  },
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

  getFilmGenres: async (filmId: string) => (filmId === "1" ? mockGenres : []),

  getFilmCastMembers: async (filmId: string) =>
    filmId === "1" ? mockCastMembers : [],
};
