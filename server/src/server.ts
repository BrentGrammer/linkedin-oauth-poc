/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
import { checkIfAuthenticated } from "./auth-middleware";
import {
  createFirebaseCustomToken,
} from "./firebase-service";
import { getAccessToken, getLinkedinUser } from "./linkedin-service";
import "./initFirebase";
import { db } from "./initFirebase";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/linkedin", async (req, res) => {
  try {
    const code = req.body.code;

    if (!code) {
      return res.json({ status: 400, message: "Missing code." });
    }

    const { token_type, access_token } = await getAccessToken(code);

    const linkedInUser = await getLinkedinUser({ token_type, access_token });

    console.log({ linkedInUser });
    // now that we have linkedin user info and access, we need to sign in with Firebase and sync somehow
    // use a custom Firebase token with service account json credentials and send custom token to client to sign into firebase with it
    const customToken = await createFirebaseCustomToken(linkedInUser.sub);

    res.status(200).send(customToken);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error /linkedin" });
  }
});

app.use(checkIfAuthenticated);

app.post("/user", async (req, res) => {
  try {
    // TODO: add check to create user only if needed
    console.log("decoded user = ", req.user);
    // const name = getNames(req.user.name);
    // TODO: need to pass name from linkedin user;
    const user = {
      id: req.user.uid,
      active: false, // not active until valid access token is submitted
      email: req.user.email || null,
      firstName: "Name from linkedin",
      lastName: "Last name from linkedin",
      phase: "searching",
      phoneNumber: null,
      photoURL: 'url from google or linkedin'
    };
    console.log({ user });
    await db.collection("users").doc(req.user.uid).set(user);

    res.status(201).json({ message: "user created" });
  } catch (e) {
    console.error("Error creating user", e);
    res.status(500).json({ message: "Error creating user." });
  }
});

app.get("/protected-route", (req, res) => {
  res.status(200).json({
    message:
      "Success - user is authenticated in Firebase and accessed protected route",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server connected to database and listening on PORT:", PORT);
});
