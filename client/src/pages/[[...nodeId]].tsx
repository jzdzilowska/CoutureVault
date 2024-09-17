import { useRouter } from "next/router";
import Head from "next/head";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { MainView } from "~/components";
import { loggedInState, selectedNodeState } from "~/global/Atoms";
import LoginPage from "~/components/LoginPage/LoginPage";


/**
 * Home page component.
 * Renders the main content based on the user's login status.
 * Manages document head properties and includes a login page if the user is not logged in.
 * Uses Recoil for managing login state and selected node state.
 * @returns {JSX.Element} - The rendered Home component.
 */
export default function Home() {
  const router = useRouter();
  // Retrieves the selected node and login status from Recoil state
  const selectedNode = useRecoilValue(selectedNodeState);
  const isLoggedIn = useRecoilValue(loggedInState);
  const setLoggedIn = useSetRecoilState(loggedInState);
  // Dynamically sets the document title based on the selected node's title or default to "Home"
  const title = `${selectedNode?.title ?? "Home"} | CoutureVault`;

  // Check if the query parameter 'skipLogin' is present
  const shouldSkipLogin = router.query.skipLogin === "true";

  if (!isLoggedIn || shouldSkipLogin) {
    if (shouldSkipLogin) {
      // Update isLoggedIn state to true when skipping login
      setLoggedIn(true);
    }
    return (
      <>
        <Head>
          <title>{title}</title>
          <link rel="icon" href="/faviconnewbold.png" />
        </Head>
        <div className="container">
          {shouldSkipLogin ? <MainView /> : <LoginPage />}
        </div>
      </>
    );
  }

  // Render the main content when the user is logged in
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/faviconnewbold.png" />
      </Head>
      <div className="container">
        <MainView />
      </div>
    </>
  );
}
