import ReactDOM from "react-dom/client";
import { router } from "./router/router.tsx";
import { RouterProvider } from "react-router-dom";
import { initFirebase } from "./config/firebase.ts";

initFirebase();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
