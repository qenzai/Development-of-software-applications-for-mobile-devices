const API_KEY = '48fab825';
const BASE_URL = 'https://www.omdbapi.com/';

// пошук фільмів, OMDb повертає по 10 штук на сторінку
export async function searchMovies(query, page = 1) {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.Response === 'False') {
    return { movies: [], total: 0, error: json.Error };
  }
  return { movies: json.Search, total: parseInt(json.totalResults, 10), error: null };
}

export async function getMovieDetails(imdbID) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.Response === 'False') {
    throw new Error(json.Error);
  }
  return json;
}
