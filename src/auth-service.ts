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

export const signOutOfFirebase = async () => {
  const auth = getAuth();
  await auth.signOut();
};

/**
 * Taken from https://github.com/nvh95/react-linkedin-login-oauth2/issues/29
 * This should sign the user out of linkedin. Opens a window to go to logout url and closes it - not the best UX, but an option if needed.
 * Linkedin does not offer a way to signout otherwise
 */
export const signOutOfLinkedin = () => {
  const logoutLinkedin = (url: string) => {
    // Invisible window popup
    const win = window.open(
      url,
      "_blank",
      "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=10, height=10, visible=none"
    );

    if (!win) throw new Error("window is null");

    setTimeout(() => {
      win.close();
    }, 3000);
  };
  logoutLinkedin("https://linkedin.com/m/logout"); //This will log out user from linked in profile, but pops up a window and closes it - bad ux
};

export const isSignedIn = (): boolean => {
  const auth = getAuth();
  return !!auth.currentUser;
};
