import Login from "../../Requests/Login";
import AuthClass from "../../../../TopLevel/Auth/Class";

/** Handles login through email or google */
export async function handleSubmit(e, type, options) {
  const { email, password } = options.state;
  const {
    hooks: { toggleSubmitLoading, setMessage, setAuthInfo },
    history,
  } = options;
  let userData;
  // If it is password Sign In then e is a DOM event,
  // for Google Sign In it is the userData from signing in coming from Google.js login function
  if (type === "password") {
    e.preventDefault();
    userData = { email, password };
  } else {
    // e = { email: 'dsafas@dfas.com' } here
    userData = e;
  }

  // Set to signify not to press the submit button/something is happening
  toggleSubmitLoading(true);
  // In case there is an error message previously set.
  setMessage("");

  let result = await Login(userData);
  // This will add an error: true key if one is found, and specifies the error
  // otherwise nothing happens
  result = checkResult(result);

  // Handle the error and return
  if (result.error) {
    // Trigger alert
    handleError(result, setMessage);
    toggleSubmitLoading(false);
    return;
  }
  // Set the token to localStorage for lasting authentication
  const { user, token, refreshToken } = result;
  console.log(token, refreshToken);
  if (token && refreshToken) {
    AuthClass.setUser(user);
    AuthClass.setTokens({
      token,
      refreshToken,
    });
    setAuthInfo({ authenticated: true, token, refreshToken, user });
  }
  // This is a top parent function call (roots from App.js)
  // There is no reason the user should think about login for a second longer
  history.push({ pathname: "/" });
}

// Checks for several edge cases
// 1. Incorrect password
// 2. Incorrect email
// 3. User does not exist
// 4. Can only sign into what you signed up as (social or password)
function checkResult(result) {
  if (!result || result.error === "server-error") {
    result = {};
    result.serverError = true;
  } else if (
    result.error === "wrong password" ||
    result.error === "wrong email"
  ) {
    result.emailError = true;
  } else if (result.error === "non-existent user") {
    result.userError = true;
  } else if (result.error === "wrong sign in") {
    result.wrongSignIn = true;
  } else if (result.error === "pop up error") {
    result.popUpClosed = true;
  } else if (result.error === "unknown google error") {
    result.unknownGoogleError = true;
  } else {
    result.error = false;
  }
  if (result.error !== false) result.error = true;
  return result;
}

// emailError is non existent email or password
// serverError...
// userError is logging in prior to signing up
// wrongSignIn is trying to sign up with a social account
export function handleError(result, setMessage) {
  let message;
  if (result.emailError) {
    message = "The email or password does not exist in the database.";
  } else if (result.serverError || result.unknownGoogleError) {
    message = "Server error :(. Try again soon!";
  } else if (result.userError) {
    message =
      "Please sign up prior to signing in. You can sign up with Google.";
  } else if (result.wrongSignIn) {
    message =
      "Welcome back. It looks like you usually log in with a social account.";
  }
  if (message) {
    setMessage(message);
    return true;
  }
}
