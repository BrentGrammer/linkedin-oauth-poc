import LoginWithLinkedIn from "./LoginWithLinkedIn";
import {
  isSignedIn,
  signOutOfFirebase,
  signOutOfLinkedin,
} from "./auth-service";
import "./App.css";

function App() {
  const signout = async () => {
    const signedin = isSignedIn();
    if (signedin) {
      await signOutOfFirebase();
      signOutOfLinkedin(); // opens window to logout linkedin user - not good UX, but alternative not found.
      alert("Signed out.");
    } else {
      alert("User is already signed out.");
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <LoginWithLinkedIn />
      <button onClick={signout}>Sign out</button>
    </div>
  );
}

export default App;
