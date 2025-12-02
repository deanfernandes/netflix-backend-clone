import { ContentAgeRating } from "./Content.js";

export interface Series {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  ageRating: ContentAgeRating;
  createdAt: Date;
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
