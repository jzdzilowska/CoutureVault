import React, { useEffect, useState } from "react";
import logo from "../assets/logos/logo1.png";
import "./LandingScreen.scss";
import { landingState } from "~/global/Atoms";
import { useRecoilState, useSetRecoilState } from "recoil";

/**
 * LandingScreen component that is responsible for rendering the initial landing screen
 * with a logo and transitions to the login screen based on a specified duration and CSS styling
 *
 * @component
 * @returns {JSX.Element} The rendered LandingScreen component.
 */
export const LandingScreen = () => {
  const setIsLanding = useSetRecoilState(landingState);
  // State to control the transition effect
  const [shouldTransition, setShouldTransition] = useState(false);

   // useEffect to handle the transition and navigate to the login screen after a delay
  useEffect(() => {
    // first timer for the pulsing "data fetch" of 2.5s
    const timer = setTimeout(() => {
      setShouldTransition(true);
      // second timer for navigating to the login after 0.5s - time of scaling
      setTimeout(() => {
        setIsLanding(false);
      }, 500); // Adjust the delay as needed
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

    // Render the LandingScreen UI
  return (
    <div className={`landing ${shouldTransition ? "transition" : ""}`}>
      <header className="landing-header">
        <img
          src="https://i.imgur.com/cH1w0yH.png"
          className="pulsing-logo"
          alt="logo"
        />
      </header>
    </div>
  );
};
