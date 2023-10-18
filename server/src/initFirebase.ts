/* eslint-disable @typescript-eslint/no-var-requires */
import admin from "firebase-admin";
const serviceAccount = require("../firebaseServiceAccount.json");
import { getFirestore } from "firebase-admin/firestore";

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = getFirestore();

export { app, db };
