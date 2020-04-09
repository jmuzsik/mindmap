import Recover from "../../../Requests/Recover";

/** Handles login through email or google */
export async function handleSubmit(options) {
  let { email } = options.state;
  let { toggleSubmitLoading, setMessage } = options.hooks;

  let result;

  toggleSubmitLoading(true);
  // In case there is an error message previously set.
  setMessage("");

  result = await Recover({ email });

  // This will add an error: true key if one is found,
  // otherwise the already formed object is returned.
  result = checkResult(result);
  toggleSubmitLoading(false);

  if (result.error) {
    handleError(result, setMessage);
    return { success: false };
  } else {
    return { success: true };
  }
}

function checkResult(result) {
  if (result.error === "server error") {
    result.serverError = true;
  } else if (result.error === "wrong email") {
    result.emailError = true;
  } else if (result.error === "email error") {
    result.failedEmailError = true;
  } else if (result.error === "social account") {
    result.socialAccountError = true;
  } else {
    result.error = false;
  }
  if (result.error !== false) result.error = true;
  return result;
}

export function handleError(result, setMessage) {
  let message;
  if (result.emailError) {
    message = "🐲 This email does not exist 🐉";
  } else if (result.serverError) {
    message = "Server error 😑. 😤 😤 😤";
  } else if (result.failedEmailError) {
    message = "Server error 😑. 😤 😤 😤";
  } else if (result.socialAccountError) {
    message = "You don't have a password, login using the google button. 😎";
  }
  if (message) {
    setMessage(message);
    return true;
  }
}
