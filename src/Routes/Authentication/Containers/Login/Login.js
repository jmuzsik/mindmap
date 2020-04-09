import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Button, Form, Card, Alert } from "antd";

import { handleSubmit } from "./utils";
import { GoogleLoginButton } from "../../../Authentication/Requests/Google";

import FormItem from "../../../../Components/Form/FormItem/FormItem";
import PageHeader from "../../../../Components/PageHeader/PageHeader";

import "../../Styles/Styles.css";

const { Content } = Layout;

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
    <Layout className="auth login">
      <header>
        <PageHeader
          history={history}
          previous="/"
          extra={
            <Button key="1" type="default">
              <Link to="/signup" tabIndex={1}>
                Create Account
              </Link>
            </Button>
          }
        />
      </header>
      <Content>
        <Card title="Log In">
          <Form>
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
                tabIndex: 2,
              }}
            ></FormItem>
            <FormItem
              {...{
                name: "password",
                placeholder: "Password",
                required: true,
                value: password,
                hook: changePassword,
                tabIndex: 3,
              }}
            ></FormItem>
            {message.length > 0 && (
              <Alert message={message} type="error" showIcon />
            )}
            <Button
              type="primary"
              htmlType="submit"
              disabled={submitDisabled}
              tabIndex={4}
              loading={submitLoading}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e, "password", options);
              }}
            >
              Log In
            </Button>
          </Form>
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
      </Content>
    </Layout>
  );
}

export default LogIn;
