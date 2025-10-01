// src/App.jsx
import { useState, useEffect } from 'react';
import MovieList from './components/MovieList';

// OMDb API Key is hardcoded here
const API_KEY = 'bdd7bf35'; 

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('Inception');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async (query) => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setError(data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchTerm);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Movie Search</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </header>
      <main>
        {loading && <p>Loading movies...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && <MovieList movies={movies} />}
      </main>
    </div>
  );
}

export default App;

