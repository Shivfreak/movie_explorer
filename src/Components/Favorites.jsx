import React, { useState } from 'react';

const Favorites = ({ watchlist, onRemove }) => {
  const [sortBy, setSortBy] = useState('title'); // Sort by title or year

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortBy === 'title') {
      return a.Title.localeCompare(b.Title);
    }
    return a.Year - b.Year;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Your Watchlist</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="title">Sort by Title</option>
          <option value="year">Sort by Year</option>
        </select>
      </div>
      {sortedWatchlist.length === 0 ? (
        <p className="text-gray-400 text-center">No movies in your watchlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWatchlist.map((film) => (
            <div key={film.imdbID} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <img
                src={film.Poster !== 'N/A' ? film.Poster : 'https://via.placeholder.com/150'}
                alt={film.Title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-white">{film.Title}</h2>
              <p className="text-gray-400 text-sm">Year: {film.Year}</p>
              <button
                onClick={() => onRemove(film.imdbID)}
                className="mt-3 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;