import createPostOptions from "../../../Utils/FetchOptions/Post";

export default async (userData) => {
  let result;

  const options = createPostOptions(userData);

  try {
    result = await fetch("/api/users", options);
  } catch (err) {
    console.log("this should not happen", err);
  }
  try {
    if (result) {
      if (result.status === 500) {
        return false;
      }
      return result.json();
    } else {
      return { err: "failed" };
    }
  } catch (err) {
    return err;
  }
};
