export interface Genre {
  id: string;
  name: string;
}

export interface FilmGenre {
  filmId: string;
  genreId: string;
}

export interface SeriesGenre {
  seriesId: string;
  genreId: string;
}
