// src/components/StreamingInfo.jsx
import { useState, useEffect } from 'react';

const WATCHMODE_API_KEY = 'sMSZUJXSMYYKg0SjYxdTX7UgxFo12nGwl5BviI9g'; // Make sure your key is here

// --- CHANGE 1: We now accept props, specifically the 'movieTitle' ---
function StreamingInfo({ movieTitle }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We can't fetch if there's no title
    if (!movieTitle) return;

    const fetchStreamingInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // --- CHANGE 2: The search value is now dynamic using the movieTitle prop ---
        // encodeURIComponent handles spaces and special characters in titles
        const searchUrl = `https://api.watchmode.com/v1/search/?apiKey=${WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(movieTitle)}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        const movieId = searchData.title_results[0]?.id;

        if (!movieId) {
          // It's okay if a movie isn't found, just don't show an error.
          setSources([]);
          return;
        }

        const sourcesUrl = `https://api.watchmode.com/v1/title/${movieId}/sources/?apiKey=${WATCHMODE_API_KEY}`;
        const sourcesResponse = await fetch(sourcesUrl);
        const sourcesData = await sourcesResponse.json();

        const indianSources = sourcesData.filter(source => 
          source.type === 'sub' && source.region === 'IN'
        );
        
        setSources(indianSources);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamingInfo();
    // --- CHANGE 3: This effect now re-runs whenever the movieTitle changes ---
  }, [movieTitle]); 

  // We don't need to show loading/error for each card, it can get messy.
  // We'll just show the results if we have them.
  if (sources.length === 0) {
    return null; // Don't render anything if no sources are found
  }

  return (
    <div className="streaming-info">
      <p>Streaming on:</p>
      {sources.map(source => (
        <span key={source.source_id} className="ott-provider">{source.name}</span>
      ))}
    </div>
  );
}

export default StreamingInfo;

