import axios from "axios";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";

function LoginWithLinkedIn() {
  const REDIRECT_URL = `${window.location.origin}/login`;
  const CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;

  const { linkedInLogin } = useLinkedIn({
    clientId: CLIENT_ID,
    redirectUri: encodeURIComponent(REDIRECT_URL),
    onSuccess: (code) => {
      console.log({ code });

      // call backend to get access token
      axios
        .get("http://localhost:5000/linkedin", { params: { code } })
        .then((res) => console.log({ res }))
        .catch((e) => console.error(e));

      // Now that we have the code, need to use it to log in with Firebase somehow
      // get user info to store in firebase and sign in with custom token?
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
