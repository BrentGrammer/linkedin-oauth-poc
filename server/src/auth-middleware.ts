import { verifyFirebaseUserToken } from "./firebase-service";
import { db } from "./initFirebase";

export const checkIfAuthenticated = async (req, res, next) => {
  req.user = {};

  let idToken;

  const UNAUTHORIZED_MESSAGE =
    "Unauthorized: Please login or pass a valid token";
  const UNAUTHORIZED_RESPONSE = {
    message: UNAUTHORIZED_MESSAGE,
    success: false,
    error:
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
  };
  const UNAUTHORIZED_STATUS = 403;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    return res.status(UNAUTHORIZED_STATUS).send(UNAUTHORIZED_RESPONSE);
  }

  try {
    const decodedUserInfo = await verifyFirebaseUserToken(idToken);
    console.log({ decodedUserInfo });

    const user = await (
      await db.collection("users").doc(decodedUserInfo.uid).get()
    ).data();

    if (user) {
      req.user = { ...decodedUserInfo, ...user };
      console.log("returning user info...");
    } else {
      req.user = { ...decodedUserInfo };
    }

    return next();
  } catch (error) {
    console.log(error, "ERR");
    UNAUTHORIZED_RESPONSE.error = error;
    return res.status(UNAUTHORIZED_STATUS).send(UNAUTHORIZED_RESPONSE);
  }
};
