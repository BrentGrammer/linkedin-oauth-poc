import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import { getSigninToken, signinToFirebase } from "./auth-service";

function LoginWithLinkedIn() {
  const REDIRECT_URL = `${window.location.origin}/login`;
  const CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;

  const { linkedInLogin } = useLinkedIn({
    clientId: CLIENT_ID,
    redirectUri: encodeURIComponent(REDIRECT_URL),
    onSuccess: async (code) => {
      try {
        // call backend to get access token and make api call to linkedin to get user info
        const token = await getSigninToken(code);
        const res = await signinToFirebase(token);
        // we'll need to set email at some point for the firebase user using the linkedin email
        alert(
          `Signed into Firebase for user uid ${res.uid} with email ${res.email}`
        );
      } catch (e) {
        console.error("Error signing in: ", e);
        alert('There was an error signing in.')
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
