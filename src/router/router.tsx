import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { LinkedInCallback } from "react-linkedin-login-oauth2";

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <App />,
  },
  {
    path: "/login",
    element: <LinkedInCallback />,
  },
]);
