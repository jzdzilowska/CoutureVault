import React, { useState } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

/**
 * This is a searchbar ui component that providers users the ability to input search terms and trigger a search.
 * @param {SearchBarProps} props - Props containing the onSearch callback function.
 */
export const SearchBar = (props: SearchBarProps) => {
  const { onSearch } = props;
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Handles the functionality when the user clicks the search button or presses Enter.
   * @param {React.FormEvent} event - form submission event is submitted
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(searchTerm);
    setSearchTerm("");
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};
