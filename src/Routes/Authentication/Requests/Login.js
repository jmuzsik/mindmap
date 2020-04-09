import createPostOptions from "../../../Utils/FetchOptions/Post";

export default async (userData) => {
  let result;
  let url = "/api/auth/login";

  const options = createPostOptions(userData);

  try {
    result = await fetch(url, options);
  } catch (err) {
    console.log("this should not happen", err);
  }
  try {
    if (result) {
      if (result.status === 500) {
        return undefined;
      }
      return result.json();
    } else {
      return { err: "failed" };
    }
  } catch (err) {
    console.log("this should not happen", err);
    return err;
  }
};
