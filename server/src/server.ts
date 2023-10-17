/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
import { createFirebaseCustomToken } from "./firebase-service";
import { getAccessToken, getLinkedinUser } from "./linkedin-service";

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server connected to database and listening on PORT:", PORT);
});
