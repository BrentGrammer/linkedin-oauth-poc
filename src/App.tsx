/* eslint-disable @typescript-eslint/no-explicit-any */
import LoginWithLinkedIn from "./LoginWithLinkedIn";
import {
  isSignedIn,
  signOutOfFirebase,
  signOutOfLinkedin,
} from "./auth-service";
import "./App.css";
import { useState } from "react";
import { apiClientWithAuth } from "./api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React from "react";

function App() {
  const [protectedResponse, setProtectedResponse] = useState("");

  React.useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: unknown) => {
      if (user) {
        try {
          console.log({ user });
        } catch (e) {
          console.error("User auth state change error. ", e);
        }
      } else {
        console.log("No user in auth state");
      }
    });
  }, []);

  const signout = async () => {
    if (isSignedIn()) {
      await signOutOfFirebase();
      signOutOfLinkedin(); // opens window to logout linkedin user - not good UX, but alternative not found.
      alert("Signed out.");
    } else {
      alert("User is already signed out.");
    }
  };

  const hitProtectedRoute = async () => {
    try {
      const backendServer = "http://localhost:5000";
      const res = await apiClientWithAuth.get(
        `${backendServer}/protected-route`
      );
      setProtectedResponse(res.data.message);
    } catch (e: any) {
      console.error(e);
      setProtectedResponse(e.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <LoginWithLinkedIn />
      <button onClick={signout}>Sign out</button>
      <button onClick={hitProtectedRoute}>Protected Route</button>
      <p>{protectedResponse}</p>
    </div>
  );
}

export default App;
