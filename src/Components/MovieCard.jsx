import React from 'react';

const MovieCard = ({ film, onAddToWatchlist, isInWatchlist }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
      <img
        src={film.Poster !== 'N/A' ? film.Poster : 'https://via.placeholder.com/150'}
        alt={film.Title}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-semibold text-white">{film.Title}</h2>
      <p className="text-gray-400 text-sm">Year: {film.Year}</p>
      <button
        onClick={() => onAddToWatchlist(film)}
        disabled={isInWatchlist}
        className={`mt-3 w-full py-2 rounded-lg text-white font-medium ${
          isInWatchlist ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {isInWatchlist ? 'Added' : 'Add to Watchlist'}
      </button>
    </div>
  );
};

export default MovieCard;