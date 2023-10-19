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
        // call backend to get access token and make api call to linkedin to get user info
        const customToken = await getCustomFirebaseToken(
          codeFromLinkedin
        ); // from our server where we create the firebase token.
        const user = await signinToFirebase(customToken);
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
