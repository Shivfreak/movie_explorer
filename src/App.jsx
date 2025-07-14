import { useState, useEffect } from 'react';
import MovieCard from './Components/MovieCard';
import Favorites from './Components/Favorites';

const API_KEY = 'a4e1d57';
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

// Debounce utility to limit API calls
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

function App() {
  const [films, setFilms] = useState([]);
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('search');

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const searchFilms = async (title) => {
    if (!title.trim()) {
      setErrorMsg('Please enter a movie title');
      setFilms([]);
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${API_URL}&s=${encodeURIComponent(title)}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setFilms(data.Search);
        setErrorMsg('');
      } else {
        setFilms([]);
        setErrorMsg(data.Error || 'No movies found');
      }
    } catch (err) {
      setErrorMsg('Failed to fetch movies');
      setFilms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(searchFilms, 500);

  const handleSearch = (e) => {
    e.preventDefault();
    searchFilms(query);
  };

  const handleClear = () => {
    setQuery('');
    setFilms([]);
    setErrorMsg('');
  };

  const addToWatchlist = (film) => {
    if (!watchlist.some((fav) => fav.imdbID === film.imdbID)) {
      setWatchlist([...watchlist, film]);
    }
  };

  const removeFromWatchlist = (imdbID) => {
    setWatchlist(watchlist.filter((fav) => fav.imdbID !== imdbID));
  };

  const toggleView = () => {
    setCurrentView(currentView === 'search' ? 'watchlist' : 'search');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-indigo-800 p-4 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Movie Explorer</h1>
          <nav>
            <button
              onClick={toggleView}
              className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
            >
              {currentView === 'search' ? 'View Watchlist' : 'Search Movies'}
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {currentView === 'search' ? (
          <>
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                placeholder="Search for movies..."
                className="flex-grow p-3 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
              >
                Clear
              </button>
            </div>

            {errorMsg && <p className="text-red-400 mb-4 text-center">{errorMsg}</p>}
            {isLoading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                <p>Loading...</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {films.map((film) => (
                <MovieCard
                  key={film.imdbID}
                  film={film}
                  onAddToWatchlist={addToWatchlist}
                  isInWatchlist={watchlist.some((fav) => fav.imdbID === film.imdbID)}
                />
              ))}
            </div>
          </>
        ) : (
          <Favorites watchlist={watchlist} onRemove={removeFromWatchlist} />
        )}
      </main>
    </div>
  );
}

export default App;