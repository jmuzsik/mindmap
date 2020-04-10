import React, { useState, useEffect } from "react";

import { Button, Card, Callout, Divider, H4, Intent } from "@blueprintjs/core";

import FormItem from "../../../../../Components/Form/FormItem/FormItem";

import { handleSubmit, checkForToken, passwordValidation } from "./utils";

/**
 * Allows user to change their password if they have forgotten it
 */
function NewPassword(props) {
  let { setAuthInfo, history } = props;
  const [submitDisabled, toggleSubmitDisabled] = useState(true);

  // State of form
  const [password, changePassword] = useState("");
  const [email, changeEmail] = useState("");
  // Button loading state
  const [submitLoading, toggleSubmitLoading] = useState(false);
  // Handle errors upon submission
  const [message, setMessage] = useState("");
  // Token needed to access this page
  const [token, setToken] = useState("");

  // pathname is set as /change-password/:token in UnAuthenticatedRoutes
  // indexOf gets where the pattern begins
  // Similar to componentDidMount
  useEffect(() => {
    const idxToStartAt = window.location.pathname.indexOf("word/") + 5;
    const token = window.location.pathname.slice(
      idxToStartAt,
      window.location.pathname.length
    );
    checkForToken(token, history, changeEmail);
    setToken(token);
  }, [history]);

  useEffect(() => {
    if (passwordValidation(password)) {
      if (submitDisabled === true) {
        toggleSubmitDisabled(false);
      }
    } else {
      if (submitDisabled === false) {
        toggleSubmitDisabled(true);
      }
    }
  }, [password, submitDisabled]);

  // Create options for simplified passing of arguments.
  const state = {
    submitDisabled,
    password,
    submitLoading,
    message,
    token,
  };
  const hooks = {
    setAuthInfo,
    toggleSubmitDisabled,
    toggleSubmitLoading,
    setMessage,
  };
  const options = { state, hooks, history };

  return (
    <section className="auth new-password layout">
      <Card>
        <H4>Reset Password</H4>
        <Divider />
        <div className="card-body">
          <p className="bp3-text-muted">
            Enter a new password for your account
          </p>
          <form>
            <FormItem
              {...{
                name: "password",
                autoCorrect: "off",
                autoCapitalize: "off",
                autoFocus: true,
                required: true,
                placeholder: "Password",
                value: password,
                hook: changePassword,
              }}
            />
            <Callout intent={Intent.PRIMARY} icon="info-sign">
              Password must be 7 characters long, have one uppercase and
              lowercase letter, a number, and no spaces
            </Callout>
            {message.length > 0 && (
              <Callout intent={Intent.DANGER} icon="error">
                {message}
              </Callout>
            )}
            <Button
              intent={Intent.PRIMARY}
              disabled={submitDisabled}
              onClick={async () => {
                let submission;
                try {
                  submission = await handleSubmit(options);
                } catch (err) {
                  // shouldn't happen
                }
                if (submission && submission.success === true) {
                  history.push("/login");
                }
              }}
              tabIndex={2}
              loading={submitLoading}
            >
              Save
            </Button>
          </form>
          <div className="below-form" />
        </div>
      </Card>
    </section>
  );
}

export default NewPassword;
