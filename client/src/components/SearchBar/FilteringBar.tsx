import React, { useState } from "react";
import "./FilteringBar.scss"; // Import the CSS file
import { clothingTypesList } from "../../types";

interface IDropdownFilterProps {
  onSelectFilter: (filter: string | null) => void;
}

/**
 * This is a component for filtering search results by node type (image, outfit, text, all).
 * @param {IDropdownFilterProps} onSelectFilter - Callback function to handle filter selection changes.
 */
export const DropdownFilter = (props: IDropdownFilterProps) => {
  const { onSelectFilter } = props;
  // filter managing state
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  /**
   * This function handles the change event when the user selects a different filter option.
   * @param event event that is changed
   */

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue === "all" ? null : selectedValue);
    onSelectFilter(selectedValue === "all" ? null : selectedValue);
  };

  return (
    // filter options
    <div>
      <label htmlFor="filterDropdown">Filter by:</label>
      <select
        id="filterDropdown"
        value={selectedFilter || "all"}
        onChange={handleFilterChange}
      >
        <option value="all">All</option>
        {/* <option value="text">Text</option>
        <option value="image">Image</option> */}
        <option value="outfit">Outfit</option>

        {clothingTypesList.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
