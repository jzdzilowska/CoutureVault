import React, { useState } from "react";
import { INode, IServiceResponse, ClothingType } from "../../types";
import { NodePreview } from "../NodeView/NodeContent/FolderContent/NodePreview";
import "./SearchView.css";
import { DropdownFilter } from "./FilteringBar";
import { DateSortDropdown } from "./SortingBar";
import { Link } from "@chakra-ui/react";
import { pathToString } from "~/global";

interface ISearchViewProps {
  searchResults: INode[];
  renderResult?: (result: INode) => React.ReactNode;
}

/**
 * SearchView component that handles displaying search results, with filtering and sorting options.
 * @param {ISearchViewProps} props - Props containing search results and render function.
 */

export const SearchView = (props: ISearchViewProps) => {
  const { searchResults, renderResult } = props;
  // State for filtering and sorting
  const [filter, setFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("recent");

  const handleFilterChange = (selectedFilter: string | null) => {
    setFilter(selectedFilter);
  };

  const handleSortChange = (selectedSortOrder: string) => {
    setSortOrder(selectedSortOrder);
  };

  const handleResultClick = (result: INode) => {
    console.log("Clicked on result:", result.title);
  };

  /**
   * This function is in charge of rendering the search results based on the applied filter and sort order.
   * @returns {React.ReactNode} - The rendered search results.
   */

  const renderSearchResults = () => {
    const filteredResults = filter
      ? searchResults.filter(
          (result) => result.type === filter || result.clothingType === filter
        ) || []
      : searchResults || [];

    // Sort results are sorted based on the selected order
    const sortedResults = filteredResults.sort((a, b) => {
      // const dateA = a.dateCreated ? new Date(a.dateCreated) : new Date(0);
      // const dateB = b.dateCreated ? new Date(b.dateCreated) : new Date(0);
      const dateA: Date = new Date(a.dateCreated || 0);
      const dateB: Date = new Date(b.dateCreated || 0);

      const timeA = dateA.getTime();
      const timeB = dateB.getTime();

      if (sortOrder === "recent") {
        return timeB - timeA; // recent at the top
      } else {
        return timeA - timeB; // oldest at the bottom
      }
    });

    if (filteredResults.length === 0) {
      return <div className="no-results">No Results Found</div>;
    }

    // regular search results
    return (
      <div className="gridView-wrapper">
        {sortedResults.map((result) => (
          <Link href={`/${pathToString(result.filePath)}`} key={result.nodeId}>
            <div key={result.nodeId} onClick={() => handleResultClick(result)}>
              {renderResult ? (
                renderResult(result)
              ) : (
                <NodePreview node={result} />
              )}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    //Here the sorting and filtering functionality is called!
    <div className="searchView-container">
      <div className="searchView-filters">
        <DropdownFilter onSelectFilter={handleFilterChange} />
        <DateSortDropdown onSortChange={handleSortChange} />
      </div>
      {renderSearchResults()}
    </div>
  );
};
