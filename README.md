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
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_SECRET=your-secret
REDIRECT_URI=redirect-url-added-to-linkedin-developers-app-auth
```

- Install dependencies: `npm i`
- Start the frontend: `npm start`
- Start the server: `cd server`
  - `npm start`
