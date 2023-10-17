/* eslint-disable @typescript-eslint/no-var-requires */
import axios from "axios";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const REDIRECT_URL = process.env.REDIRECT_URI;
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_SECRET;
const LINKEDIN_URL = "https://www.linkedin.com/oauth/v2/accessToken";

app.get("/linkedin", (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.json({ status: 400, message: "Missing code." });
  }

  const params = {
    grant_type: "authorization_code",
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URL,
  };
  // not working - get 400 bad request
  axios
    .post(
      LINKEDIN_URL,
      {},
      {
        params,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    )
    .then((response) => {
      const data = response.data;
      const { token_type, access_token, id_token, expires_in } = data;
      console.log({ token_type, access_token, id_token, expires_in });

      const LINKEDIN_BASE_URL = "https://api.linkedin.com/v2";
      const authorizedEndpoint = "userinfo";

      axios
        .get(`${LINKEDIN_BASE_URL}/${authorizedEndpoint}`, {
          headers: { Authorization: `${token_type} ${access_token}` },
        })
        .then((linkedinData) => {
          const {
            // email_verified,
            // name,
            // locale,
            sub,
            given_name,
            family_name,
            email,
            picture,
          } = linkedinData.data;
          // can use these to create and store a user in firebase
          console.log({ sub, email, given_name, family_name, picture });
        })
        .catch((e) => {
          console.error("Error getting me profile: ", e);
        });

      res.json("Success - access token recieved");
    })
    .catch((e) => {
      console.error("error calling linedin to get accesstoken", e);
      res.status(500).json({ error: "There was an error get access token" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server connected to database and listening on PORT:", PORT);
});
