import { CastMember } from "./CastMember.js";
import { ContentAgeRating, ContentRating } from "./Content.js";
import { Genre } from "./Genre.js";
import { Season } from "./Season.js";

export interface Series {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  ageRating: ContentAgeRating;
  createdAt: Date;
  hasUserWatched?: boolean | null;
  userRating?: ContentRating | null;
  seasons?: Season[];
  genres?: Genre[];
  castMembers?: CastMember[];
}

export interface SeriesView {
  id: string;
  seriesId: string;
  accountProfileId: string;
}

export interface SeriesRating {
  id: string;
  rating: "thumbs_up" | "thumbs_down" | "double_thumbs_up";
  seriesId: string;
  accountProfileId: string;
}
