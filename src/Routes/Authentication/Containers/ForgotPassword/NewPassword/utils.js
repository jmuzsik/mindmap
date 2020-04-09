import ChangePassword from "../../../Requests/ChangePassword";
import { newPasswordValidator } from "../../../Utils/Utils";
import CheckIfValidToken from "../../../Requests/CheckIfValidToken";

/** Handles login through email or google */

export async function handleSubmit(options) {
  let { password, token } = options.state;
  let { toggleSubmitLoading, setMessage } = options.hooks;

  let result;

  toggleSubmitLoading(true);
  // In case there is an error message previously set.
  setMessage("");

  result = await ChangePassword({ password, token });

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
  if (result.error === "failed token") {
    result.tokenError = true;
  } else if (result.error === "Database error") {
    result.serverError = true;
  } else {
    result.error = false;
  }
  if (result.error !== false) result.error = true;
  return result;
}

export function handleError(result, setMessage) {
  let message;
  if (result.serverError) {
    message = "Server error 😑. 😤 😤 😤";
  }
  if (message) {
    setMessage(message);
    return true;
  }
}

/**
 *
 * @param password {string}
 */
export function passwordValidation(password) {
  // minimum of 7 characters, one uppercase, one lowercase, one digit, no spaces
  const schema = newPasswordValidator();

  return schema.validate(password);
}

export async function checkForToken(token, history, changeEmail) {
  // Here, check if the token is valid
  let checkIfValidToken;
  let error = false;
  try {
    checkIfValidToken = await CheckIfValidToken(token);
  } catch (err) {
    error = true;
  }
  if (error || checkIfValidToken.error) {
    history.push("/nonexistent-token");
  } else {
    changeEmail(checkIfValidToken.email);
  }
}
