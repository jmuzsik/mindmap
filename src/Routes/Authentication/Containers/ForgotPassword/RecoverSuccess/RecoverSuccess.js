import React, { useState } from "react";

import { Button, Layout, Card, Alert } from "antd";

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
    <Layout className="auth recover-success">
      <Card title="Reset Password">
        <div className="card-subtitle">
          An email has been sent to {email} <br /> Click the link in the email
          to reset your password.
        </div>
        <Button
          type="ghost"
          htmlType="submit"
          tabIndex={1}
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
          <p>or continue with</p>
          <Button type="link" onClick={() => sendEmail(email, setMessage)}>
            Resend Email
          </Button>
          {message.length > 0 && (
            <Alert message={message} type="error" showIcon />
          )}
        </div>
      </Card>
    </Layout>
  );
}
