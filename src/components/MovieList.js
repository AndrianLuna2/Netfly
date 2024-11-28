function MovieList({ movies, onMovieClick }) {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <div
          className="movie-card"
          key={movie.imdbID}
          onClick={() => onMovieClick(movie.imdbID)}
        >
          <img src={movie.Poster} alt={movie.Title} />
          <h3>{movie.Title}</h3>
          {/* Badge (HD/CAM) */}
          <div className="badge">{movie.Type === 'movie' ? 'HD' : 'CAM'}</div>
        </div>
      ))}
    </div>
  );
}

export default MovieList;
