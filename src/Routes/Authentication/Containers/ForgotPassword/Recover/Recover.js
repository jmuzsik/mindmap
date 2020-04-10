import React, { useState, useEffect } from "react";
import { Button, Card, Callout, Divider, H4, Intent } from "@blueprintjs/core";

import { handleSubmit } from "./utils";

import FormItem from "../../../../../Components/Form/FormItem/FormItem";
import PageHeader from "../../../../../Components/PageHeader/PageHeader";

function Recover(props) {
  let { setAuthInfo, history } = props;
  const [submitDisabled, toggleSubmitDisabled] = useState(true);

  // State of form
  const [email, changeEmail] = useState("");
  // Button loading state
  const [submitLoading, toggleSubmitLoading] = useState(false);
  // Handle errors upon submission
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (email.length > 0) {
      if (submitDisabled === true) {
        toggleSubmitDisabled(false);
      }
    } else {
      if (submitDisabled === false) {
        toggleSubmitDisabled(true);
      }
    }
  }, [email, submitDisabled]);

  // Create options for simplified passing of arguments.
  const state = {
    submitDisabled,
    email,
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
    <section className="auth recover layout">
      <header>
        <PageHeader history={history} previous="/" />
      </header>
      <Card>
        <H4>Recover Account</H4>
        <Divider />
        <div className="card-body">
          <p className="bp3-text-muted">
            Enter the email address used to create your account
          </p>
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
            {message.length > 0 && (
              <Callout intent={Intent.WARNING} icon="warning-sign">
                {message}
              </Callout>
            )}
            <Button
              intent={Intent.PRIMARY}
              onClick={async () => {
                const submitResult = await handleSubmit(options);
                if (submitResult.success) {
                  history.push({
                    pathname: "/recover-password-success",
                    state: { email },
                  });
                }
              }}
              disabled={submitDisabled}
              loading={submitLoading}
            >
              Send Email
            </Button>
          </form>
        </div>
      </Card>
    </section>
  );
}

export default Recover;
