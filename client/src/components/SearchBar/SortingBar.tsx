import React, { useState } from "react";

interface DateSortDropdownProps {
  onSortChange: (selectedOption: string) => void;
}
/**
 * This function handles the UI aspect and it's a component for selecting sort order based on oldest and recent.
 * @param props
 * @returns
 */

export const DateSortDropdown = (props: DateSortDropdownProps) => {
  const { onSortChange } = props;
  // State to manage the selected sort order
  const [, setSortOrder] = useState<string>("recent");

  /**
   * This handles the event when users selects a different sort order.
   * @param e
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;

    onSortChange(selectedOption);
    // Update the state with the selected sort order
    setSortOrder(selectedOption);
  };

  return (
    <div>
      <label htmlFor="dateSort">Sort by Date:</label>
      <select id="dateSort" onChange={handleSortChange}>
        <option value="recent">Most Recent</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
};
