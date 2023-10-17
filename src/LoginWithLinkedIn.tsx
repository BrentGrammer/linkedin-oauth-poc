import axios from "axios";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";

function LoginWithLinkedIn() {
  const REDIRECT_URL = encodeURIComponent(`${window.location.origin}/login`);
  const CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_LINKEDIN_SECRET;

  const { linkedInLogin } = useLinkedIn({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URL,
    onSuccess: (code) => {
      console.log({ code });

      // Now that we have the code, need to use it to log in with Firebase somehow
      // get user info to store in firebase
      const LINKEDIN_URL = "https://www.linkedin.com/oauth/v2/accessToken";

      const params = {
        grant_type: "authorization_code",
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URL,
      };
      // not working - get 400 bad request
      axios
        .post(
          LINKEDIN_URL,
          {},
          {
            params,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        )
        .then((res) => {
          console.log({ res });
        })
        .catch((e) => {
          console.error("error calling linedin to get accesstoken", e);
        });
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
