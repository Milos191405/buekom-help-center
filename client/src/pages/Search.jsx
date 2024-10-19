import React from "react";
import SearchByOptions from "../components/SearchByOptions";

function Search({ isLoggedIn }) {
  return (
    <>
      <div className="mt-[100px] max-w-[1400px] mx-auto items-center text-center">
        <h2 className="text-2xl font-semibold mb-4">Search Page</h2>

        {/* Search Form */}
        <form action="search" className="flex justify-center gap-5 mb-6">
          <input
            type="text"
            placeholder="Enter search term..."
            className="border px-4 py-2 rounded-md"
          />
          <button className="border px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Search
          </button>
        </form>

        {/* Search Categories */}
        <ul className="flex gap-5 justify-center">
          <li className="w-60 h-60 border rounded-md flex items-center justify-center">
            Windows
          </li>
          <li className="w-60 h-60 border rounded-md flex items-center justify-center">
            Ubuntu
          </li>
          <li className="w-60 h-60 border rounded-md flex items-center justify-center">
            Docker
          </li>
          <li className="w-60 h-60 border rounded-md flex items-center justify-center">
            System
          </li>
        </ul>
        {/* Dropdown Menus */}
        <div className="mb-6">
          <SearchByOptions isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </>
  );
}

export default Search;
