# Sign in with linkedin POC

This is a repo to test out signing in with linkedin from a React app and then integrating with Firebase. WIP.

- https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fcontext&tabs=cURL1#step-2-request-an-authorization-code
- https://www.feathery.io/blog/linkedin-oauth

### Library used:

- https://www.npmjs.com/package/react-linkedin-login-oauth2

### CORS

- getting cors error requesting access token:
  https://stackoverflow.com/questions/69254424/cors-error-on-linkedin-oauth-v2-accesstoken-api-from-frontend

- Need to get access token from a server, not a browser to get around this.

## Starting the app

- requires firebase project if hooking up to firebase, update the config/firebase.ts params with your project details
- Populate .env files for the frontend and server (in /server) using your Linkedin/Firebase credentials:

```
# frontend (.env goes in root folder)
VITE_FIREBASE_API_KEY=yourkey
VITE_LINKEDIN_CLIENT_ID=clientid-from-linkedin-developers-app
```

```
# server (place .env in /server folder)
FIREBASE_API_KEY=your-api-key
FIREBASE_PROJECT_ID=your-proj-id
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_SECRET=your-secret
REDIRECT_URI=redirect-url-added-to-linkedin-developers-app-auth
```

- Install frontend dependencies: `npm i`
- Install server dependencies: `cd server` `npm i`
- Start the frontend: `npm start`
- Start the server: `cd server`
  - `npm start`

## Firebase integration

- Importing users without passwords? https://firebase.google.com/docs/auth/admin/import-users#import_users_without_passwords
- Custom auth with custom tokens: https://firebase.google.com/docs/auth/web/custom-auth
  - You can create a custom token with the Firebase Admin SDK,
  - If we are running in a google cloud function or managed env, we don't need service account: "credentials lookup is fully automated in Google environments, with no need to supply environment variables or other configuration, this way of initializing the SDK is strongly recommended for applications running in Google environments such as Cloud Run, App Engine, and Cloud Functions."
- [see docs](https://firebase.google.com/docs/auth/admin/create-custom-tokens) If your code is deployed in the App Engine standard environment for Java, Python or Go, the Admin SDK can use the App Identity service present in that environment to sign custom tokens. The App Identity service signs data using a service account provisioned for your app by Google App Engine.

If your code is deployed in some other managed environment (e.g. Google Cloud Functions, Google Compute Engine), the Firebase Admin SDK can auto-discover a service account ID string from the local metadata server. The discovered service account ID is then used in conjunction with the IAM service to sign tokens remotely.

To make use of these signing methods, initialize the SDK with Google Application Default credentials and do not specify a service account ID string

To test the same code locally, download a service account JSON file and set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to it.

Just like with explicitly specified service account IDs, auto-discoverd service account IDs must have the iam.serviceAccounts.signBlob permission for the custom token creation to work. You may have to use the IAM and admin section of the Google Cloud Console to grant the default service accounts the necessary permissions. See the troubleshooting section below for more details.

### Creating a Service Account credential:

- Go to firebase console and your project
- Project Settings > Service accounts tab > Generate new private key button
- This will download a new service account json file, copy this to your project and add it to .gitignore so it is not committed to source control

### Creating tokens:

- The Firebase Admin SDK has a built-in method for creating custom tokens. At a minimum, you need to provide a uid, which can be any string but should uniquely identify the user or device you are authenticating. These tokens expire after one hour.
- After you create a custom token, you should send it to your client app. The client app authenticates with the custom token by calling signInWithCustomToken()

### Verifying Tokens:

- On the backend can decode and verify custom tokens: https://firebase.google.com/docs/auth/admin/verify-id-tokens
