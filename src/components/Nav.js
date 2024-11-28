import React, { useState } from 'react';

function Nav({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState(''); // Local state for search input

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query as user types
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission (page reload)
    onSearch(searchQuery); // Pass search query to parent (App.js)
  };

  return (
    <nav>
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for movies..."
        />
        <button type="submit">Search</button>
      </form>
    </nav>
  );
}

export default Nav;
