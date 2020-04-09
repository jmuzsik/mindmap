import createPostOptions from "../../Utils/FetchOptions/Post";

// Refresh token is what allows user to be continually signed in after JWT expires
export default async (refreshToken) => {
  let result;

  const url = "/api/auth/logout";

  const options = createPostOptions({ refreshToken });

  try {
    result = await fetch(url, options);
    result = result.json();
  } catch (err) {
    return false;
  }
  if (result.error) {
    return false;
  }
  return true;
};
