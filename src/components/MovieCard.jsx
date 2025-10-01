// src/components/MovieCard.jsx
import StreamingInfo from './StreamingInfo';

function MovieCard({ movie }) {
  // This line fixes the broken placeholder image error.
  const posterUrl = movie.Poster !== 'N/A' 
    ? movie.Poster 
    : 'https://via.placeholder.com/400x600?text=No+Image';

  return (
    <div className="movie-card">
      <img src={posterUrl} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <p>Year: {movie.Year}</p>

      {/* This is the most important line. It makes the streaming info appear. */}
      <StreamingInfo movieTitle={movie.Title} />
    </div>
  );
}

export default MovieCard;

