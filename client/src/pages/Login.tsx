import Head from "next/head";
import { useRecoilValue } from "recoil";
import LoginPage from "~/components/LoginPage/LoginPage";
import { selectedNodeState } from "~/global/Atoms";


/**
 * Login page component that renders the login page content and manages the document head properties.
 * Uses Recoil for managing selected node state.
 * @returns {JSX.Element} - The rendered Login component.
 */
export default function Login() {
  // Your login page logic here
  // You might want to use Recoil for managing login state or any other state.
  const selectedNode = useRecoilValue(selectedNodeState);
   // Sets the document title based on the selected node's title or default to "Login"
  const title = `${selectedNode?.title ?? "Login"} | CoutureVault`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/faviconnewbold.png" />
      </Head>
      <div className="container">
        <LoginPage />
      </div>
    </>
  );
}
