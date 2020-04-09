import React from "react";
import { GoogleLogin } from "react-google-login";

const CLIENT_ID =
  "278461086912-g193s9ihf7lec5hiv04v1tor5qv52hbl.apps.googleusercontent.com";

// This happens immediately after the person signs up or exits early
const signUp = async (response, cb) => {
  // Error happens if the user, say, exits the pop up without signing up though I'm having difficulty replicating it.
  if (response.error) {
    if (response.error === "popup_closed_by_user") {
      cb({ error: "pop up closed" });
      return;
    } else {
      cb({ error: "unknown google error" });
      return;
    }
  }
  // I ignore the token as I care only to log the user in with JWT
  // Google only has a one hour token time limit
  const { profileObj } = response;
  profileObj.password = null;
  const userData = profileObj;

  cb(userData);
};
const logIn = async (response, cb) => {
  if (response.error) {
    if (response.error === "popup_closed_by_user") {
      return "pop up closed";
    } else {
      return "unknown google error";
    }
  }
  const {
    profileObj: { email }
  } = response;
  const userData = { email };
  cb(userData);
};

export function GoogleLoginButton(callbackProps) {
  const cb = callbackProps.cb;
  return (
    <GoogleLogin
      clientId={CLIENT_ID}
      buttonText="Google"
      onSuccess={res => logIn(res, cb)}
      onFailure={res => logIn(res, cb)}
      cookiePolicy={"single_host_origin"}
    />
  );
}

export function GoogleSignupButton(callbackProps) {
  const cb = callbackProps.cb;
  return (
    <GoogleLogin
      clientId={CLIENT_ID}
      buttonText="Google"
      onSuccess={res => signUp(res, cb)}
      onFailure={res => signUp(res, cb)}
      cookiePolicy={"single_host_origin"}
    />
  );
}
