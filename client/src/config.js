export const apiEndpoint = process.env.REACT_APP_API_ENDPOINT

export const authConfig = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  auth0Audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  callbackUrl: process.env.REACT_APP_AUTH0_CALLBACK_URL
}
