import { getAuth } from "firebase-admin/auth";
import { db } from "./initFirebase";

function getNames(_name) {
  let name = _name.split(",")[0].trim();
  name = name.split("(")[0].trim();
  //REMOVE EMOJIS
  name = name
    .replace(
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
      ""
    )
    .trim();

  let first = name.split(" ").slice(0, -1).join(" ");
  const last = name.split(" ").slice(-1).join(" ");

  if (!first) first = name;

  function capitalize(s) {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  return {
    first: capitalize(first),
    last: capitalize(last),
  };
}

async function verifyFirebaseUserToken(idToken: string) {
  return getAuth().verifyIdToken(idToken);
}

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

    let user = await (
      await db.collection("users").doc(decodedUserInfo.uid).get()
    ).data();

    if (!user) {
      console.log("No USER found - creating a new User!");
      const name = getNames(decodedUserInfo.name);
      user = {
        id: decodedUserInfo.uid,
        active: false, // not active until valid access token is submitted
        email: decodedUserInfo.email,
        firstName: name.first,
        lastName: name.last,
        phase: "searching",
        phoneNumber: null,
        // photoURL: decodedUserInfo.picture || null, TODO: get from linkedin pic
      };
      await db.collection("users").doc(decodedUserInfo.uid).set(user);
    }

    console.log("returning user info...");

    req.user = { ...decodedUserInfo, ...user };
    return next();
  } catch (error) {
    console.log(error, "ERR");
    UNAUTHORIZED_RESPONSE.error = error;
    return res.status(UNAUTHORIZED_STATUS).send(UNAUTHORIZED_RESPONSE);
  }
};
