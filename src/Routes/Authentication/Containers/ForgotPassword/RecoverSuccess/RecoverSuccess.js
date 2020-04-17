import React, { useState } from "react";

import { Button, Card, Callout, Divider, H4, Intent } from "@blueprintjs/core";

import recover from "../../../Requests/Recover";

async function sendEmail(email, setMessage) {
  const emailCheck = await recover({ email });
  if (emailCheck.error) {
    setMessage(emailCheck.error);
  }
}

export default function RecoverSuccess(props) {
  let history = props.history;
  const email = history.location.state.email;

  // Handle errors upon submission
  const [message, setMessage] = useState("");

  return (
    <section className="auth recover-success layout">
      <Card>
        <H4>Reset Password</H4>
        <Divider />
        <div className="card-body">
          <p className="bp3-text-muted">
            An email has been sent to {email} <br /> Click the link in the email
            to reset your password.
          </p>
          <Button
            onClick={() =>
              history.push({
                pathname: "/recover-password",
                state: { email },
              })
            }
          >
            Got It
          </Button>
          <div className="below-form">
            <p>or</p>
            {/* TODO: i'm not sure what this looks like, i just wanted to get rid of the dev tool warning */}
            <Button
              intent={Intent.NONE}
              onClick={() => sendEmail(email, setMessage)}
            >
              Resend Email
            </Button>
            {message.length > 0 && (
              <Callout intent={Intent.DANGER} icon="error">
                {message}
              </Callout>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
