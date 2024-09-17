import React, { useEffect, useState } from "react";
import "./LoginPage.scss";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userSessionState, loggedInState, landingState } from "~/global/Atoms";
import { useRouter } from "next/router";

// Used the following video for firebase authentication: https://www.youtube.com/watch?v=vDT7EnUpEoo
// Added to import from other services
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// Import functions needed from appropriate SDKs
import { initializeApp } from "firebase/app";
import { LandingScreen } from "../LandingScreen";
import { MainView } from "../MainView";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvvKfckYizRy_taI9MG3W2Kn06xpHV0TU",
  authDomain: "couture-vault.firebaseapp.com",
  projectId: "couture-vault",
  storageBucket: "couture-vault.appspot.com",
  messagingSenderId: "815380277314",
  appId: "1:815380277314:web:f9a19ca74e1fd0fe5125db",
  measurementId: "G-44ZD41RKBY",
};

/**
 * LoginPage component that is responsible for rendering the login screen and handling user authentication.
 *
 * @component
 * @returns {JSX.Element} The rendered LoginPage component.
 */
const LoginPage = () => {
  if (process.env.NODE_ENV !== "test") {
    const setUserSession = useSetRecoilState(userSessionState);
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const isLanding = useRecoilValue(landingState);
    const router = useRouter();

    //const setUser = useSetRecoilState(userState);
    //const [userRole, setUserRole] = useRecoilState(userRoleState);

    // Initialize Firebase login and redirect to appropriate page
    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
      try {
        // Sign in with Google using Firebase authentication
        const result = await signInWithPopup(auth, provider);
        // Extract user information from the authentication result
        const name: string | null = result.user.displayName;
        const email: string | null = result.user.email;
        // Extract user information from the authentication result
        if (name == null || email == null) {
          console.log("error: name of email is null");
        } else {
          setUserSession({
            name: name,
            email: email,
          });
          setIsLoggedIn(true);
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    // Render LandingScreen if the app is in the landing state, otherwise render the login screen
    if (isLanding) {
      return <LandingScreen />;
    } else
      return (
        <div className="login-body">
          <h2>CURATED FOR YOU</h2>
          <h1>Couture Vault</h1>
          <button onClick={signInWithGoogle} className="btn">
            ENTER WITH GOOGLE
          </button>
        </div>
      );
  } else {
    console.log("Skipping authentication for tests");
    return <MainView />;
  }
};

export default LoginPage;
