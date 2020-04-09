import createPostOptions from "../../Utils/FetchOptions/Post";
import createGetOptions from "../../Utils/FetchOptions/Get";

// TODO: error is?
export default async (token, refreshToken) => {
  const checkTokenOptions = createGetOptions(token);

  const refreshTokenOptions = createPostOptions({ refreshToken });

  let checkTokenResult;
  try {
    checkTokenResult = await fetch("/api/auth/check-jwt", checkTokenOptions);
    checkTokenResult = await checkTokenResult.json();
  } catch (err) {
    return { error: err };
  }
  let refreshTokenResult;
  if (checkTokenResult.error && refreshToken) {
    try {
      refreshTokenResult = await fetch(
        "/api/auth/update-token",
        refreshTokenOptions
      );
      refreshTokenResult = await refreshTokenResult.json();
    } catch (error) {
      return { error: error };
    }
    if (refreshTokenResult.error) {
      return { error: refreshTokenResult.error };
    }
    return { ...refreshTokenResult, info: "updated token" };
  }
  return { info: "no changes" };
};
