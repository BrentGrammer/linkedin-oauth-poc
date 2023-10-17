import axios from "axios";

const REDIRECT_URL = process.env.REDIRECT_URI;
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_SECRET;

/**
 * { token_type, access_token, id_token, expires_in } = token response;
 * */
export const getAccessToken = async (code) => {
  const params = {
    grant_type: "authorization_code",
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URL,
  };

  const ACCESS_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
  const res = await axios.post(
    ACCESS_TOKEN_URL,
    {},
    {
      params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return res.data;
};

export const getLinkedinUser = async ({ token_type, access_token }) => {
  const LINKEDIN_BASE_URL = "https://api.linkedin.com/v2";
  const authorizedUserInfoEndpoint = "userinfo";

  const res = await axios.get(
    `${LINKEDIN_BASE_URL}/${authorizedUserInfoEndpoint}`,
    {
      headers: { Authorization: `${token_type} ${access_token}` },
    }
  );

  const {
    // email_verified,
    // name,
    // locale,
    sub,
    given_name,
    family_name,
    email,
    picture,
  } = res.data;

  return { sub, email, given_name, family_name, picture };
};
