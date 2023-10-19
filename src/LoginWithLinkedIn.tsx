import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import {
  getFirebaseUserToken,
  getCustomFirebaseToken,
  signinToFirebase,
} from "./auth-service";
import { apiClientWithAuth } from "./api";

function LoginWithLinkedIn() {
  const REDIRECT_URL = `${window.location.origin}/login`; // needs to match what is entered into linkedin developer authorized urls (under the auth menu at https://www.linkedin.com/developers/apps)
  const CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;

  const { linkedInLogin } = useLinkedIn({
    clientId: CLIENT_ID,
    redirectUri: encodeURIComponent(REDIRECT_URL),
    onSuccess: async (codeFromLinkedin) => {
      try {
        // call a route on our server to get a linkedin api access token using the code.
        // Then, we use linkedin user info to make a custom firebase token which is sent back in the response to sign in user with Firebase.
        const customToken = await getCustomFirebaseToken(codeFromLinkedin);
        // Use the custom firebase token to sign in the user with Firebase Auth
        const user = await signinToFirebase(customToken);
        // After the user is signed in, we can pull and send an id token on all requests which can be verified for protected routes with Firebase library on the backend. Note: admin SDK does not support signing in on the server.
        const userSessionToken = await getFirebaseUserToken();
        // create user if exists
        await apiClientWithAuth.post("http://localhost:5000/user", {
          token: userSessionToken,
          user,
        });
        // we'll need to set email at some point for the firebase user using the linkedin email
        // uid is the sub (subject) from the linkedin user and also used as the uid in firebase for them
        alert(
          `Signed into Firebase for user uid ${user.uid} with email ${user.email}`
        );
      } catch (e) {
        console.error("Error signing in: ", e);
        alert("There was an error signing in.");
      }
    },
    onError: (error) => {
      // NOTE: error will come up for user closed pop up - probably can ignore this as popup should close after signin.
      console.log({ error });
    },
    scope: "email openid profile",
  });

  return (
    <img
      src={linkedin}
      alt="Log in with Linked In"
      style={{ maxWidth: "180px" }}
      onClick={linkedInLogin}
    />
  );
}

export default LoginWithLinkedIn;
