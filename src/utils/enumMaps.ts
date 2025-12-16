import { ContentAgeRating, ContentRating } from "../gql/generated/graphql.js";

export function mapContentAgeRating(dbValue: string): ContentAgeRating {
  switch (dbValue) {
    case "12":
      return "_12";
    case "15":
      return "_15";
    case "18":
      return "_18";
    case "U":
      return "U";
    case "PG":
      return "PG";
    default:
      throw new Error(`Unknown content age rating: ${dbValue}`);
  }
}

export function mapContentRating(dbValue: string): ContentRating {
  switch (dbValue) {
    case "thumbs_up":
      return "THUMBS_UP";
    case "thumbs_down":
      return "THUMBS_DOWN";
    case "double_thumbs_up":
      return "DOUBLE_THUMBS_UP";
    default:
      throw new Error(`Unknown content rating: ${dbValue}`);
  }
}
