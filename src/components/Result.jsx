// src/components/Result.jsx
import { useState, useEffect } from 'react';

function StreamingResult({ movie, apiKey }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movie?.id) return;

    const fetchSources = async () => {
      setLoading(true);
      try {
        const sourcesUrl = `https://api.watchmode.com/v1/title/${movie.id}/sources/?apiKey=${apiKey}&regions=IN`;
        const response = await fetch(sourcesUrl);
        const data = await response.json();
        
        // We only care about subscription services ("sub")
        const subscriptionSources = data.filter(source => source.type === 'sub');
        setSources(subscriptionSources);
      } catch (err) {
        // Silently fail, don't show an error for every single movie
        console.error("Failed to fetch sources for", movie.name, err);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [movie.id, apiKey]);

  // If loading or no streaming sources found, don't show anything
  if (loading || sources.length === 0) {
    return null;
  }

  return (
    <div className="result-card">
      <h2>{movie.name} ({movie.year})</h2>
      <div className="sources-list">
        {sources.map(source => (
          <span key={source.source_id} className="ott-provider">{source.name}</span>
        ))}
      </div>
    </div>
  );
}

export default StreamingResult;
