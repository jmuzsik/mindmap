import React, { useState, useEffect } from "react";
import { Button, Layout, Card, Form, Alert } from "antd";

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
    <Layout className="auth new-password">
      <Card title="Reset Password">
        <div className="card-subtitle">
          Enter a new password for your account <br />
          <span>{email}</span>
        </div>
        <Form>
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
              tabIndex: 1,
            }}
          />
          <Alert
            showIcon
            message="Password must be 7 characters long, have one uppercase and lowercase
            letter, a number, and no spaces"
            type="warning"
          />
          {message.length > 0 && (
            <Alert showIcon message={message} type="error" />
          )}
          <Button
            type="ghost"
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
        </Form>
        <div className="below-form" />
      </Card>
    </Layout>
  );
}

export default NewPassword;
