import axios from "axios";
import { getAuth, signInWithCustomToken } from "firebase/auth";

/**
 * calls our backend server which uses firebase-admin to generate and return a custom firebase token to sign the user in with firebase auth.
 * @param code code received from Linkedin after initiating oauth signin
 * @returns custom firebase token created on the backend using firebase-admin
 */
export const getSigninToken = async (code: string): Promise<string> => {
  const res = await axios.post("http://localhost:5000/linkedin", {
    code,
  });
  return res.data;
};

export const signinToFirebase = async (customToken: string) => {
  const auth = getAuth();
  const userCredential = await signInWithCustomToken(auth, customToken);

  const user = userCredential.user;
  return user;
};
