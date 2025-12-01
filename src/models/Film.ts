import { ContentAgeRating } from "./Content.js";

export interface Film {
  id: string;
  title: string;
  synopsis: string;
  releaseYear: number;
  ageRating: ContentAgeRating;
  createdAt: Date;
}

export interface FilmView {
  id: string;
  filmId: string;
  accountProfileId: string;
}

export interface FilmRating {
  id: string;
  rating: "thumbs_up" | "thumbs_down" | "double_thumbs_up";
  filmId: string;
  accountProfileId: string;
}
