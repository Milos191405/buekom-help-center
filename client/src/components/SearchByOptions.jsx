import { useState } from "react";
import PropTypes from "prop-types";

function SearchByOptions({ isLoggedIn }) {
  const [dropdownOpen, setDropdownOpen] = useState({
    category: false,
    date: false,
    status: false,
  });

  const toggleDropdown = (name) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <ul className="flex">
      md
      {isLoggedIn && (
        <>
          {/* Dropdown 1: Search By Category */}
          <li className="relative">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-200"
              onClick={() => toggleDropdown("category")}
            >
              Search By Category
            </button>
            {dropdownOpen.category && (
              <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded z-50">
                <li className="p-2 hover:bg-gray-200 cursor-pointer">
                  Category 1
                </li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">
                  Category 2
                </li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">
                  Category 3
                </li>
              </ul>
            )}
          </li>

          {/* Dropdown 2: Search By Date */}
          <li className="relative">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-200"
              onClick={() => toggleDropdown("date")}
            >
              Search By Date
            </button>
            {dropdownOpen.date && (
              <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded z-50">
                <li className="p-2 hover:bg-gray-200 cursor-pointer">
                  Last 24 hours
                </li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">
                  Last 7 days
                </li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">
                  Last 30 days
                </li>
              </ul>
            )}
          </li>

          {/* Dropdown 3: Search By Status */}
          <li className="relative">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-200"
              onClick={() => toggleDropdown("status")}
            >
              Search By Status
            </button>
            {dropdownOpen.status && (
              <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded z-50">
                <li className="p-2 hover:bg-gray-200 cursor-pointer">Active</li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">
                  Inactive
                </li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer">
                  Archived
                </li>
              </ul>
            )}
          </li>
        </>
      )}
    </ul>
  );
}

SearchByOptions.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default SearchByOptions;
