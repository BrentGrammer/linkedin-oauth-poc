/* eslint-disable @typescript-eslint/no-var-requires */
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = require("../firebaseServiceAccount.json");

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

/**
 *
 * @param uid A uid to use as the subject/user for the custom token
 * @returns a firebase custom token to return to the client for signing in
 */
export const createFirebaseCustomToken = async (uid: string) => {
  const auth = getAuth(app);
  // if we want to set user email for identifier then you need to create the user first - we'll need to check for existing email user etc.
  // const userRecord = await auth.createUser({
  //   uid: uid,
  //   email: email,
  // });

  // createCustomToken will create a user in Firebase if they don't exist, but identifier will be empty - see above note to set it to an email
  const customToken = await auth.createCustomToken(uid);
  return customToken;
};
