import { Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import "./LoadingScreen.scss";

/**
 * LoadingScreen component that displays the CoutureVault logo while waiting for content to load.
 *
 * @component
 * @param {Object} props - Props for the LoadingScreen component.
 * @param {boolean} props.hasTimeout - Flag indicating whether a timeout message should be displayed.
 * @returns {JSX.Element} The rendered LoadingScreen component.
 */
export const LoadingScreen = ({ hasTimeout }: { hasTimeout: boolean }) => {
  const [showMessage, setShowMessage] = useState(false);

  // useEffect to show the timeout message after a specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Render the LoadingScreen UI with a the CV logo and an optional timeout message
  return (
    <div className="loading">
      <Spinner
        color="blue.500"
        size="xl"
        thickness="6px"
        emptyColor="#d7ecff"
      />
      {hasTimeout && showMessage && (
        <div className="loading-message">
          Hmmm, it should have loaded by now. The backend is probably not
          properly connected to the frontend.
          <br />
          Make sure that you have started your server locally and that it is
          properly connected through your
          <code>.env</code> file.
        </div>
      )}
    </div>
  );
};
