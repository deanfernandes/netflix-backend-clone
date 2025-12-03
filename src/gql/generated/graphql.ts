import type { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Account = {
  __typename?: 'Account';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  memberships: Array<AccountMembership>;
  mobileNumber: Scalars['String']['output'];
  profiles: Array<AccountProfile>;
};

export type AccountMembership = {
  __typename?: 'AccountMembership';
  account: Account;
  accountMembershipPlan: AccountMembershipPlan;
  accountMembershipPrice: Scalars['Float']['output'];
  autoRenew: Scalars['Boolean']['output'];
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  startDate: Scalars['String']['output'];
  status: MembershipStatus;
};

export type AccountMembershipPlan = {
  __typename?: 'AccountMembershipPlan';
  id: Scalars['ID']['output'];
  monthlyPrice: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type AccountProfile = {
  __typename?: 'AccountProfile';
  account: Account;
  hasPin: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profileImageUrl?: Maybe<Scalars['String']['output']>;
};

export type CastMember = {
  __typename?: 'CastMember';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export const ContentAgeRating = {
  Pg: 'PG',
  U: 'U',
  '12': '_12',
  '15': '_15',
  '18': '_18'
} as const;

export type ContentAgeRating = typeof ContentAgeRating[keyof typeof ContentAgeRating];
export const ContentRating = {
  DoubleThumbsUp: 'DOUBLE_THUMBS_UP',
  ThumbsDown: 'THUMBS_DOWN',
  ThumbsUp: 'THUMBS_UP'
} as const;

export type ContentRating = typeof ContentRating[keyof typeof ContentRating];
export type Episode = {
  __typename?: 'Episode';
  durationMinutes: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  number: Scalars['Int']['output'];
  season: Season;
  synopsis: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Film = {
  __typename?: 'Film';
  ageRating: ContentAgeRating;
  castMembers: Array<CastMember>;
  createdAt: Scalars['String']['output'];
  genres: Array<Genre>;
  hasUserWatched: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  releaseYear: Scalars['Int']['output'];
  synopsis: Scalars['String']['output'];
  title: Scalars['String']['output'];
  userRating?: Maybe<ContentRating>;
};

export type Genre = {
  __typename?: 'Genre';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export const MembershipStatus = {
  Active: 'ACTIVE',
  Cancelled: 'CANCELLED',
  Expired: 'EXPIRED'
} as const;

export type MembershipStatus = typeof MembershipStatus[keyof typeof MembershipStatus];
export type Mutation = {
  __typename?: 'Mutation';
  addFilmToWatchlist: WatchlistFilm;
  addSeriesToWatchlist: WatchlistSeries;
  cancelMembership: AccountMembership;
  changeAccountPassword: Scalars['Boolean']['output'];
  createProfile: AccountProfile;
  deleteProfile: Scalars['Boolean']['output'];
  deleteProfilePin: AccountProfile;
  markFilmUnwatched: Film;
  markFilmWatched: Film;
  markSeriesUnwatched: Series;
  markSeriesWatched: Series;
  rateFilm: Film;
  rateSeries: Series;
  removeFilmFromWatchlist: WatchlistFilm;
  removeFilmRating: Film;
  removeSeriesFromWatchlist: WatchlistSeries;
  removeSeriesRating: Series;
  setProfilePin: AccountProfile;
  updateMembershipAutoRenew: AccountMembership;
  updateProfile: AccountProfile;
};


export type MutationAddFilmToWatchlistArgs = {
  filmId: Scalars['ID']['input'];
  profileId: Scalars['ID']['input'];
};


export type MutationAddSeriesToWatchlistArgs = {
  profileId: Scalars['ID']['input'];
  seriesId: Scalars['ID']['input'];
};


export type MutationCancelMembershipArgs = {
  accountMembershipId: Scalars['ID']['input'];
};


export type MutationChangeAccountPasswordArgs = {
  accountId: Scalars['ID']['input'];
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationCreateProfileArgs = {
  accountId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
  profileImageUrl?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteProfileArgs = {
  profileId: Scalars['ID']['input'];
};


export type MutationDeleteProfilePinArgs = {
  profileId: Scalars['ID']['input'];
};


export type MutationMarkFilmUnwatchedArgs = {
  filmId: Scalars['ID']['input'];
  profileId: Scalars['ID']['input'];
};


export type MutationMarkFilmWatchedArgs = {
  filmId: Scalars['ID']['input'];
  profileId: Scalars['ID']['input'];
};


export type MutationMarkSeriesUnwatchedArgs = {
  profileId: Scalars['ID']['input'];
  seriesId: Scalars['ID']['input'];
};


export type MutationMarkSeriesWatchedArgs = {
  profileId: Scalars['ID']['input'];
  seriesId: Scalars['ID']['input'];
};


export type MutationRateFilmArgs = {
  filmId: Scalars['ID']['input'];
  profileId: Scalars['ID']['input'];
  rating: ContentRating;
};


export type MutationRateSeriesArgs = {
  profileId: Scalars['ID']['input'];
  rating: ContentRating;
  seriesId: Scalars['ID']['input'];
};


export type MutationRemoveFilmFromWatchlistArgs = {
  filmId: Scalars['ID']['input'];
  profileId: Scalars['ID']['input'];
};


export type MutationRemoveFilmRatingArgs = {
  filmId: Scalars['ID']['input'];
  profileId: Scalars['ID']['input'];
};


export type MutationRemoveSeriesFromWatchlistArgs = {
  profileId: Scalars['ID']['input'];
  seriesId: Scalars['ID']['input'];
};


export type MutationRemoveSeriesRatingArgs = {
  profileId: Scalars['ID']['input'];
  seriesId: Scalars['ID']['input'];
};


export type MutationSetProfilePinArgs = {
  pin: Scalars['String']['input'];
  profileId: Scalars['ID']['input'];
};


export type MutationUpdateMembershipAutoRenewArgs = {
  accountMembershipId: Scalars['ID']['input'];
  autoRenew: Scalars['Boolean']['input'];
};


export type MutationUpdateProfileArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  pin?: InputMaybe<Scalars['String']['input']>;
  profileId: Scalars['ID']['input'];
  profileImageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accountMembership?: Maybe<AccountMembership>;
  accountMemberships: Array<AccountMembership>;
  accountProfile?: Maybe<AccountProfile>;
  accountProfiles: Array<AccountProfile>;
  accounts: Array<Account>;
  episode?: Maybe<Episode>;
  episodes: Array<Episode>;
  film?: Maybe<Film>;
  films: Array<Film>;
  newFilms: Array<Film>;
  newSeries: Array<Series>;
  popularFilms: Array<Film>;
  popularSeries: Array<Series>;
  season?: Maybe<Season>;
  seasons: Array<Season>;
  series?: Maybe<Series>;
  seriesList: Array<Series>;
  watchlist?: Maybe<Watchlist>;
};


export type QueryAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccountMembershipArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccountMembershipsArgs = {
  accountId: Scalars['ID']['input'];
};


export type QueryAccountProfileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccountProfilesArgs = {
  accountId: Scalars['ID']['input'];
};


export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEpisodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEpisodesArgs = {
  seasonId: Scalars['ID']['input'];
};


export type QueryFilmArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFilmsArgs = {
  ageRating?: InputMaybe<ContentAgeRating>;
  genreIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNewFilmsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNewSeriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularFilmsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPopularSeriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySeasonArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySeasonsArgs = {
  seriesId: Scalars['ID']['input'];
};


export type QuerySeriesArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySeriesListArgs = {
  ageRating?: InputMaybe<ContentAgeRating>;
  genreIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWatchlistArgs = {
  profileId: Scalars['ID']['input'];
};

export type Season = {
  __typename?: 'Season';
  ageRating: ContentAgeRating;
  episodes: Array<Episode>;
  id: Scalars['ID']['output'];
  number: Scalars['Int']['output'];
  releaseYear: Scalars['Int']['output'];
  series: Series;
};

export type Series = {
  __typename?: 'Series';
  ageRating: ContentAgeRating;
  castMembers: Array<CastMember>;
  createdAt: Scalars['String']['output'];
  genres: Array<Genre>;
  hasUserWatched: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  releaseYear: Scalars['Int']['output'];
  seasons: Array<Season>;
  synopsis: Scalars['String']['output'];
  title: Scalars['String']['output'];
  userRating?: Maybe<ContentRating>;
};

export type Watchlist = {
  __typename?: 'Watchlist';
  films: Array<WatchlistFilm>;
  series: Array<WatchlistSeries>;
};

export type WatchlistFilm = {
  __typename?: 'WatchlistFilm';
  addedAt: Scalars['String']['output'];
  film: Film;
};

export type WatchlistSeries = {
  __typename?: 'WatchlistSeries';
  addedAt: Scalars['String']['output'];
  series: Series;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Account: ResolverTypeWrapper<Account>;
  AccountMembership: ResolverTypeWrapper<AccountMembership>;
  AccountMembershipPlan: ResolverTypeWrapper<AccountMembershipPlan>;
  AccountProfile: ResolverTypeWrapper<AccountProfile>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CastMember: ResolverTypeWrapper<CastMember>;
  ContentAgeRating: ContentAgeRating;
  ContentRating: ContentRating;
  Episode: ResolverTypeWrapper<Episode>;
  Film: ResolverTypeWrapper<Film>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Genre: ResolverTypeWrapper<Genre>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MembershipStatus: MembershipStatus;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Season: ResolverTypeWrapper<Season>;
  Series: ResolverTypeWrapper<Series>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Watchlist: ResolverTypeWrapper<Watchlist>;
  WatchlistFilm: ResolverTypeWrapper<WatchlistFilm>;
  WatchlistSeries: ResolverTypeWrapper<WatchlistSeries>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Account: Account;
  AccountMembership: AccountMembership;
  AccountMembershipPlan: AccountMembershipPlan;
  AccountProfile: AccountProfile;
  Boolean: Scalars['Boolean']['output'];
  CastMember: CastMember;
  Episode: Episode;
  Film: Film;
  Float: Scalars['Float']['output'];
  Genre: Genre;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  Season: Season;
  Series: Series;
  String: Scalars['String']['output'];
  Watchlist: Watchlist;
  WatchlistFilm: WatchlistFilm;
  WatchlistSeries: WatchlistSeries;
};

export type AccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memberships?: Resolver<Array<ResolversTypes['AccountMembership']>, ParentType, ContextType>;
  mobileNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profiles?: Resolver<Array<ResolversTypes['AccountProfile']>, ParentType, ContextType>;
};

export type AccountMembershipResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountMembership'] = ResolversParentTypes['AccountMembership']> = {
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  accountMembershipPlan?: Resolver<ResolversTypes['AccountMembershipPlan'], ParentType, ContextType>;
  accountMembershipPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  autoRenew?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['MembershipStatus'], ParentType, ContextType>;
};

export type AccountMembershipPlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountMembershipPlan'] = ResolversParentTypes['AccountMembershipPlan']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  monthlyPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AccountProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountProfile'] = ResolversParentTypes['AccountProfile']> = {
  account?: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  hasPin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profileImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type CastMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['CastMember'] = ResolversParentTypes['CastMember']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type EpisodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Episode'] = ResolversParentTypes['Episode']> = {
  durationMinutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  season?: Resolver<ResolversTypes['Season'], ParentType, ContextType>;
  synopsis?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type FilmResolvers<ContextType = any, ParentType extends ResolversParentTypes['Film'] = ResolversParentTypes['Film']> = {
  ageRating?: Resolver<ResolversTypes['ContentAgeRating'], ParentType, ContextType>;
  castMembers?: Resolver<Array<ResolversTypes['CastMember']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  genres?: Resolver<Array<ResolversTypes['Genre']>, ParentType, ContextType>;
  hasUserWatched?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  releaseYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  synopsis?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userRating?: Resolver<Maybe<ResolversTypes['ContentRating']>, ParentType, ContextType>;
};

export type GenreResolvers<ContextType = any, ParentType extends ResolversParentTypes['Genre'] = ResolversParentTypes['Genre']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addFilmToWatchlist?: Resolver<ResolversTypes['WatchlistFilm'], ParentType, ContextType, RequireFields<MutationAddFilmToWatchlistArgs, 'filmId' | 'profileId'>>;
  addSeriesToWatchlist?: Resolver<ResolversTypes['WatchlistSeries'], ParentType, ContextType, RequireFields<MutationAddSeriesToWatchlistArgs, 'profileId' | 'seriesId'>>;
  cancelMembership?: Resolver<ResolversTypes['AccountMembership'], ParentType, ContextType, RequireFields<MutationCancelMembershipArgs, 'accountMembershipId'>>;
  changeAccountPassword?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangeAccountPasswordArgs, 'accountId' | 'newPassword' | 'oldPassword'>>;
  createProfile?: Resolver<ResolversTypes['AccountProfile'], ParentType, ContextType, RequireFields<MutationCreateProfileArgs, 'accountId' | 'name'>>;
  deleteProfile?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProfileArgs, 'profileId'>>;
  deleteProfilePin?: Resolver<ResolversTypes['AccountProfile'], ParentType, ContextType, RequireFields<MutationDeleteProfilePinArgs, 'profileId'>>;
  markFilmUnwatched?: Resolver<ResolversTypes['Film'], ParentType, ContextType, RequireFields<MutationMarkFilmUnwatchedArgs, 'filmId' | 'profileId'>>;
  markFilmWatched?: Resolver<ResolversTypes['Film'], ParentType, ContextType, RequireFields<MutationMarkFilmWatchedArgs, 'filmId' | 'profileId'>>;
  markSeriesUnwatched?: Resolver<ResolversTypes['Series'], ParentType, ContextType, RequireFields<MutationMarkSeriesUnwatchedArgs, 'profileId' | 'seriesId'>>;
  markSeriesWatched?: Resolver<ResolversTypes['Series'], ParentType, ContextType, RequireFields<MutationMarkSeriesWatchedArgs, 'profileId' | 'seriesId'>>;
  rateFilm?: Resolver<ResolversTypes['Film'], ParentType, ContextType, RequireFields<MutationRateFilmArgs, 'filmId' | 'profileId' | 'rating'>>;
  rateSeries?: Resolver<ResolversTypes['Series'], ParentType, ContextType, RequireFields<MutationRateSeriesArgs, 'profileId' | 'rating' | 'seriesId'>>;
  removeFilmFromWatchlist?: Resolver<ResolversTypes['WatchlistFilm'], ParentType, ContextType, RequireFields<MutationRemoveFilmFromWatchlistArgs, 'filmId' | 'profileId'>>;
  removeFilmRating?: Resolver<ResolversTypes['Film'], ParentType, ContextType, RequireFields<MutationRemoveFilmRatingArgs, 'filmId' | 'profileId'>>;
  removeSeriesFromWatchlist?: Resolver<ResolversTypes['WatchlistSeries'], ParentType, ContextType, RequireFields<MutationRemoveSeriesFromWatchlistArgs, 'profileId' | 'seriesId'>>;
  removeSeriesRating?: Resolver<ResolversTypes['Series'], ParentType, ContextType, RequireFields<MutationRemoveSeriesRatingArgs, 'profileId' | 'seriesId'>>;
  setProfilePin?: Resolver<ResolversTypes['AccountProfile'], ParentType, ContextType, RequireFields<MutationSetProfilePinArgs, 'pin' | 'profileId'>>;
  updateMembershipAutoRenew?: Resolver<ResolversTypes['AccountMembership'], ParentType, ContextType, RequireFields<MutationUpdateMembershipAutoRenewArgs, 'accountMembershipId' | 'autoRenew'>>;
  updateProfile?: Resolver<ResolversTypes['AccountProfile'], ParentType, ContextType, RequireFields<MutationUpdateProfileArgs, 'profileId'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  account?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryAccountArgs, 'id'>>;
  accountMembership?: Resolver<Maybe<ResolversTypes['AccountMembership']>, ParentType, ContextType, RequireFields<QueryAccountMembershipArgs, 'id'>>;
  accountMemberships?: Resolver<Array<ResolversTypes['AccountMembership']>, ParentType, ContextType, RequireFields<QueryAccountMembershipsArgs, 'accountId'>>;
  accountProfile?: Resolver<Maybe<ResolversTypes['AccountProfile']>, ParentType, ContextType, RequireFields<QueryAccountProfileArgs, 'id'>>;
  accountProfiles?: Resolver<Array<ResolversTypes['AccountProfile']>, ParentType, ContextType, RequireFields<QueryAccountProfilesArgs, 'accountId'>>;
  accounts?: Resolver<Array<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<QueryAccountsArgs, 'limit' | 'offset'>>;
  episode?: Resolver<Maybe<ResolversTypes['Episode']>, ParentType, ContextType, RequireFields<QueryEpisodeArgs, 'id'>>;
  episodes?: Resolver<Array<ResolversTypes['Episode']>, ParentType, ContextType, RequireFields<QueryEpisodesArgs, 'seasonId'>>;
  film?: Resolver<Maybe<ResolversTypes['Film']>, ParentType, ContextType, RequireFields<QueryFilmArgs, 'id'>>;
  films?: Resolver<Array<ResolversTypes['Film']>, ParentType, ContextType, Partial<QueryFilmsArgs>>;
  newFilms?: Resolver<Array<ResolversTypes['Film']>, ParentType, ContextType, Partial<QueryNewFilmsArgs>>;
  newSeries?: Resolver<Array<ResolversTypes['Series']>, ParentType, ContextType, Partial<QueryNewSeriesArgs>>;
  popularFilms?: Resolver<Array<ResolversTypes['Film']>, ParentType, ContextType, Partial<QueryPopularFilmsArgs>>;
  popularSeries?: Resolver<Array<ResolversTypes['Series']>, ParentType, ContextType, Partial<QueryPopularSeriesArgs>>;
  season?: Resolver<Maybe<ResolversTypes['Season']>, ParentType, ContextType, RequireFields<QuerySeasonArgs, 'id'>>;
  seasons?: Resolver<Array<ResolversTypes['Season']>, ParentType, ContextType, RequireFields<QuerySeasonsArgs, 'seriesId'>>;
  series?: Resolver<Maybe<ResolversTypes['Series']>, ParentType, ContextType, RequireFields<QuerySeriesArgs, 'id'>>;
  seriesList?: Resolver<Array<ResolversTypes['Series']>, ParentType, ContextType, Partial<QuerySeriesListArgs>>;
  watchlist?: Resolver<Maybe<ResolversTypes['Watchlist']>, ParentType, ContextType, RequireFields<QueryWatchlistArgs, 'profileId'>>;
};

export type SeasonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Season'] = ResolversParentTypes['Season']> = {
  ageRating?: Resolver<ResolversTypes['ContentAgeRating'], ParentType, ContextType>;
  episodes?: Resolver<Array<ResolversTypes['Episode']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  releaseYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  series?: Resolver<ResolversTypes['Series'], ParentType, ContextType>;
};

export type SeriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Series'] = ResolversParentTypes['Series']> = {
  ageRating?: Resolver<ResolversTypes['ContentAgeRating'], ParentType, ContextType>;
  castMembers?: Resolver<Array<ResolversTypes['CastMember']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  genres?: Resolver<Array<ResolversTypes['Genre']>, ParentType, ContextType>;
  hasUserWatched?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  releaseYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  seasons?: Resolver<Array<ResolversTypes['Season']>, ParentType, ContextType>;
  synopsis?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userRating?: Resolver<Maybe<ResolversTypes['ContentRating']>, ParentType, ContextType>;
};

export type WatchlistResolvers<ContextType = any, ParentType extends ResolversParentTypes['Watchlist'] = ResolversParentTypes['Watchlist']> = {
  films?: Resolver<Array<ResolversTypes['WatchlistFilm']>, ParentType, ContextType>;
  series?: Resolver<Array<ResolversTypes['WatchlistSeries']>, ParentType, ContextType>;
};

export type WatchlistFilmResolvers<ContextType = any, ParentType extends ResolversParentTypes['WatchlistFilm'] = ResolversParentTypes['WatchlistFilm']> = {
  addedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  film?: Resolver<ResolversTypes['Film'], ParentType, ContextType>;
};

export type WatchlistSeriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['WatchlistSeries'] = ResolversParentTypes['WatchlistSeries']> = {
  addedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  series?: Resolver<ResolversTypes['Series'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Account?: AccountResolvers<ContextType>;
  AccountMembership?: AccountMembershipResolvers<ContextType>;
  AccountMembershipPlan?: AccountMembershipPlanResolvers<ContextType>;
  AccountProfile?: AccountProfileResolvers<ContextType>;
  CastMember?: CastMemberResolvers<ContextType>;
  Episode?: EpisodeResolvers<ContextType>;
  Film?: FilmResolvers<ContextType>;
  Genre?: GenreResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Season?: SeasonResolvers<ContextType>;
  Series?: SeriesResolvers<ContextType>;
  Watchlist?: WatchlistResolvers<ContextType>;
  WatchlistFilm?: WatchlistFilmResolvers<ContextType>;
  WatchlistSeries?: WatchlistSeriesResolvers<ContextType>;
};

