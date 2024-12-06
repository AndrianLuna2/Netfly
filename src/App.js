import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import MovieList from './components/MovieList';
import './index.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const apiUrl = `https://www.omdbapi.com/?s=${searchQuery || 'movie'}&page=${page}&apikey=7606218f`;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data.Response === 'True') {
          const detailedMovies = [];
          for (const movie of data.Search) {
            const movieDetailsUrl = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=7606218f`;
            const detailsResponse = await fetch(movieDetailsUrl);

            if (!detailsResponse.ok) {
              console.warn(`Failed to fetch details for movie ID: ${movie.imdbID}`);
              continue;
            }

            const detailsData = await detailsResponse.json();
            detailedMovies.push(detailsData);
          }

          setMovies((prevMovies) => [...prevMovies, ...detailedMovies]);
          setTotalResults(data.totalResults);
        } else {
          setError('No movies found.');
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setError(error.message || 'Error fetching movie data');
      }

      setLoading(false);
    };

    fetchMovies();
  }, [searchQuery, page]);

  useEffect(() => {
    if (category) {
      const filtered = movies.filter(
        (movie) => movie.Genre && movie.Genre.toLowerCase().includes(category.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [category, movies]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);

    if (query.trim() === '') {
      setMovies([]);
      setFilteredMovies([]);
      setCategory('');
    } else {
      setMovies([]);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const loadMoreMovies = () => {
    if (movies.length < totalResults) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleMovieClick = async (movieId) => {
    const movieDetailsUrl = `https://www.omdbapi.com/?i=${movieId}&apikey=7606218f`;

    try {
      const response = await fetch(movieDetailsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      if (data.Response === 'True') {
        if (selectedMovie && selectedMovie.imdbID === movieId) {
          setSelectedMovie(null);
        } else {
          setSelectedMovie(data);
        }
      } else {
        setSelectedMovie(null);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setSelectedMovie(null);
    }
  };

  return (
    <div className="luna-app">
      <Header />
      {selectedMovie && (
        <div className="movie-description">
          <div className="movie-details" onClick={() => setSelectedMovie(null)}>
            <img
              src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={selectedMovie.Title}
              className="movie-poster"
            />
            <div className="movie-text">
              <h2>{selectedMovie.Title}</h2>
              <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
              <p><strong>Director:</strong> {selectedMovie.Director}</p>
              <p><strong>Year:</strong> {selectedMovie.Year}</p>
              <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
            </div>
          </div>
        </div>
      )}
      <Nav onSearch={handleSearch} />
      <div className="search-container">
        <select onChange={handleCategoryChange} value={category}>
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Horror">Horror</option>
          <option value="Drama">Drama</option>
          <option value="Romance">Romance</option>
        </select>
      </div>
      {loading ? (
        <div>Loading movies...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <MovieList movies={filteredMovies} onMovieClick={handleMovieClick} />
          {filteredMovies.length < totalResults && (
            <button onClick={loadMoreMovies}>Load More</button>
          )}
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;
