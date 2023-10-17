import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";

function LoginWithLinkedIn() {
  const REDIRECT_URL = encodeURIComponent(`${window.location.origin}/linkedin`);

  const { linkedInLogin } = useLinkedIn({
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
    redirectUri: REDIRECT_URL,
    onSuccess: (code) => {
      console.log(code);
    },
    onError: (error) => {
      console.log(error);
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
