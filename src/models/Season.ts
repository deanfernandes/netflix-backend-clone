import { ContentAgeRating } from "./Content";

export interface Season {
  id: string;
  number: number;
  ageRating: ContentAgeRating;
  releaseYear: number;
  seriesId: string;
}
