import createPostOptions from "../../../Utils/FetchOptions/Post";

async function apiCall(data) {
  let result;
  let url = "/api/subject";

  const options = createPostOptions(data);

  try {
    result = await fetch(url, options);
  } catch (err) {
    console.log("this should not happen", err);
    return { error: "server" };
  }
  result = await result.json();

  if (result.error) {
    return { error: "server" };
  }
  return result;
}

export async function handleSubmit({
  state: { name, authInfo },
  hooks: { toggleSubmitLoading, setMessage, setAuthInfo },
  history,
}) {
  const userId = authInfo.user._id;
  toggleSubmitLoading(true);
  let response;
  try {
    response = await apiCall({ name, userId });
  } catch (error) {
    toggleSubmitLoading(false);
    setMessage("Server error, please try again soon.");
  }
  if (response.error) {
    toggleSubmitLoading(false);
    setMessage("Server error, please try again soon.");
    return;
  }

  const url = `/api/users/update-subject/${userId}`;
  const postOptions = createPostOptions({ id: response.subject._id });
  try {
    await fetch(url, postOptions);
  } catch (error) {
    console.log("within fetching subjects", error);
  }

  toggleSubmitLoading(false);
  setAuthInfo({ ...authInfo, user: response.user, updateUser: true });

  history.push({
    pathname: "/",
  });
}
