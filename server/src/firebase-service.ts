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

  const customToken = await auth.createCustomToken(uid);
  return customToken;
};
