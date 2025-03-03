export const CLIENT_ID = "5996e16cdba64f768b013901df287254";
export const REDIRECT_URI = "http://localhost:5173/callback";
export const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
export const RESPONSE_TYPE = "token";
export const SCOPES = "user-read-recently-played";

export const getAuthorizeUrl = () => {
  return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
};
