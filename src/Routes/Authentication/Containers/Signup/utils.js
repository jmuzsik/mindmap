import emailValidator from "email-validator";

import Signup from "../../Requests/Signup.js";
import { newPasswordValidator } from "../../Utils/Utils";

export async function handleSubmit(e, type, options) {
  let {
    state: { email, password, firstName, lastName, darkModeChecked },
    hooks: { toggleSubmitLoading, setMessage, setAuthInfo },
    history,
  } = options;
  let userData;
  const theme = setDarkModeCheckedToString(darkModeChecked);
  // If it is password Sign Up then e is a DOM event,
  // for Google Sign Up it is the userData from signing in coming from Google.js signup function
  if (type === "password") {
    e.preventDefault();
    userData = {
      email,
      password,
      firstName,
      lastName,
      imageUrl: null,
      theme,
    };
  } else {
    // e = { email: 'dsafas@dfas.com' } here
    userData = e;
  }

  toggleSubmitLoading(true);
  // In case there is an error message previously set.
  setMessage("");

  // Validate prior to calling the API, sending back the
  // message immediately
  let result;
  if (type === "password") {
    result = validation({
      email,
      password,
    });
  } else {
    result = { error: false };
  }
  if (result && result.error === true) {
    // Here, if the password or email is not valid then we:
    // 1. See if it is a password or email problem
    result = checkResult(result);
    // 2. Handle that problem
    handleError(result, setMessage);
    // 3. Allow user to submit again
    toggleSubmitLoading(false);
    return;
  }
  // Now we can signup the user
  try {
    result = await Signup(userData);
  } catch (err) {
    // Should never truly fail, some sort of response is sent
    console.log("this should not happen", err);
  }
  const { user, token, refreshToken } = result;

  // This will add an error: true key/value if one is found,
  // otherwise basically nothing happens
  result = checkResult(result);
  if (result.error) {
    handleError(result, setMessage);
    toggleSubmitLoading(false);
    return;
  }
  // Set the token to localStorage for lasting authentication
  if (token && refreshToken) {
    setAuthInfo({ authenticated: true, token, refreshToken, user });
  }
  history.push({
    pathname: "/",
  });
}

// Email and password validation when a user signs up
// returns undefined if no error is found
function validation(emailPassword) {
  const emailValidation = emailValidator.validate(emailPassword.email);
  if (emailValidation === false) {
    return {
      error: true,
      emailError: true,
    };
  }
  // minimum of 7 characters, one uppercase, one lowercase, one digit, no spaces
  const schema = newPasswordValidator();
  const passwordValidation = schema.validate(emailPassword.password);
  if (passwordValidation === false) {
    return {
      error: true,
      passwordError: true,
    };
  }
  return { error: false };
}

// Checks for 2 edge cases atm:
// serverError is a literal problem with the server
// repeatedEmail is when the same email is used that was
// used in the past to signup
function checkResult(result) {
  if (!result || !result) {
    result = {};
    result.serverError = true;
  } else if (result.error === "previous user") {
    result.repeatedEmail = true;
  } else if (result.error === "pop up closed") {
    result.popUpClosed = true;
  } else if (result.error === "unknown error") {
    result.unknownError = true;
  } else {
    result.error = false;
  }
  if (result.error !== false) result.error = true;
  return result;
}

// Creates messages based upon errors
// passwordError relates to an invalid password
// emailError is for an invalid email
// serverError is when things are screwed
// repeatedError is just that
export async function handleError(result, setMessage) {
  let message;
  if (result.passwordError) {
    message =
      "Password must be 7 characters long, have one uppercase and lowercase letter, a number, and no spaces";
  } else if (result.emailError) {
    message = "Please input a valid email.";
  } else if (result.serverError || result.unknownError) {
    message = "Server error :(. Try again soon!";
  } else if (result.repeatedEmail) {
    message = "This email is already registered, please log in.";
  } else if (result.popUpClosed) {
    message = "";
  }
  if (message) {
    setMessage(message);
    return true;
  }
}

function setDarkModeCheckedToString(checked) {
  return checked === true ? "dark" : "light";
}
