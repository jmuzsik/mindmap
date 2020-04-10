import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, H4, Divider, Callout, Intent } from "@blueprintjs/core";

import { handleSubmit } from "./utils";
import { GoogleLoginButton } from "../../../Authentication/Requests/Google";

import FormItem from "../../../../Components/Form/FormItem/FormItem";
import PageHeader from "../../../../Components/PageHeader/PageHeader";

import "../../Styles/Styles.css";

/**
 * The page in which a user accesses to sign into the application
 * through either email/password or google auth
 */
function LogIn(props) {
  const history = props.history;
  let setAuthInfo = props.setAuthInfo;

  const [submitDisabled, toggleSubmitDisabled] = useState(true);

  // State of form
  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");
  // Button loading state
  const [submitLoading, toggleSubmitLoading] = useState(false);
  // Handle errors upon submission
  const [message, setMessage] = useState("");
  // Show password state
  const [showPassword, toggleShowPassword] = useState(false);

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      if (submitDisabled === true) {
        toggleSubmitDisabled(false);
      }
    } else {
      if (submitDisabled === false) {
        toggleSubmitDisabled(true);
      }
    }
  }, [email, password, submitDisabled]);

  // Create options for simplified passing of arguments.
  const state = {
    submitDisabled,
    email,
    password,
    submitLoading,
    message,
  };
  const hooks = {
    setAuthInfo,
    toggleSubmitDisabled,
    toggleSubmitLoading,
    setMessage,
  };

  const options = { state, hooks, history };

  return (
    <section className="auth login layout">
      <header>
        <PageHeader
          history={history}
          previous="/"
          rightButton={
            <Button>
              <Link to="/signup">Create Account</Link>
            </Button>
          }
        />
      </header>
      <Card>
        <H4>Log In</H4>
        <Divider />
        <div className="card-body">
          <form>
            <FormItem
              {...{
                name: "email",
                placeholder: "Email Address",
                autoCorrect: "off",
                autoCapitalize: "off",
                autoFocus: true,
                required: true,
                value: email,
                hook: changeEmail,
              }}
            />
            <FormItem
              {...{
                name: "password",
                placeholder: "Password",
                required: true,
                value: password,
                hook: changePassword,
                passwordObj: {
                  showPassword,
                  toggleShowPassword,
                },
              }}
            />
            {message.length > 0 && (
              <Callout intent={Intent.WARNING} icon="warning-sign">
                {message}
              </Callout>
            )}
            <Button
              intent="primary"
              disabled={submitDisabled}
              loading={submitLoading}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e, "password", options);
              }}
            >
              Log In
            </Button>
          </form>
        </div>
        <div className="below-form">
          <p>or continue with</p>
          <div className="social-media-login">
            <GoogleLoginButton
              cb={(result) => handleSubmit(result, "social", options)}
            />
          </div>
          <Link to="/recover-password">Forgot login?</Link>
        </div>
      </Card>
    </section>
  );
}

export default LogIn;
