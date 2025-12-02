import { ContentAgeRating } from "./Content.js";

export interface Season {
  id: string;
  number: number;
  ageRating: ContentAgeRating;
  releaseYear: number;
  seriesId: string;
}
