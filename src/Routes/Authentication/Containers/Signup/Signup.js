import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Layout, Form, Card, Switch, Alert } from "antd";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import FormItem from "../../../../Components/Form/FormItem/FormItem";
import PageHeader from "../../../../Components/PageHeader/PageHeader";

import { handleSubmit } from "./utils";
import { GoogleSignupButton } from "../../Requests/Google";

import "../../Styles/Styles.css";

const { Content } = Layout;

/**
 * The page which a user accesses to sign up to the application
 * through either email/password or google auth
 */
function SignUp(props) {
  let { history } = props;
  // Allow submit to be clicked
  const [submitDisabled, toggleSubmitDisabled] = useState(true);

  // State of form
  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");
  const [firstName, changeFirstName] = useState("");
  const [lastName, changeLastName] = useState("");
  const [darkModeChecked, changeDarkModeChecked] = useState(false);
  // Button loading state
  const [submitLoading, toggleSubmitLoading] = useState(false);
  // Handle errors upon submission
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (
      email.length > 0 &&
      password.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0
    ) {
      if (submitDisabled === true) {
        toggleSubmitDisabled(false);
      }
    } else {
      if (submitDisabled === false) {
        toggleSubmitDisabled(true);
      }
    }
  }, [email, password, firstName, lastName, submitDisabled]);

  const state = {
    submitDisabled,
    email,
    password,
    firstName,
    lastName,
    submitLoading,
    message,
    darkModeChecked,
  };
  const hooks = {
    toggleSubmitDisabled,
    toggleSubmitLoading,
    setMessage,
    setAuthInfo: props.setAuthInfo,
  };
  const options = { state, hooks, history };

  return (
    <Layout className="auth signup">
      <header>
        <PageHeader
          history={history}
          previous="/"
          extra={
            <Button key="1" type="default">
              <Link to="/login" tabIndex={1}>
                Log in
              </Link>
            </Button>
          }
        />
      </header>
      <Content>
        <Card title="Create Account">
          <Form>
            <FormItem
              {...{
                name: "firstName",
                placeholder: "First Name",
                autoFocus: true,
                required: true,
                value: firstName,
                hook: changeFirstName,
                tabIndex: 2,
              }}
            />
            <FormItem
              {...{
                name: "lastName",
                placeholder: "Last Name",
                required: true,
                value: lastName,
                hook: changeLastName,
                tabIndex: 3,
              }}
            />
            <FormItem
              {...{
                name: "email",
                placeholder: "Email Address",
                required: true,
                value: email,
                hook: changeEmail,
                tabIndex: 4,
              }}
            />
            <FormItem
              {...{
                name: "password",
                placeholder: "Password",
                required: true,
                value: password,
                hook: changePassword,
                tabIndex: 5,
              }}
            />
            <Form.Item label="Use Dark Theme:" name="dark theme">
              <Switch
                onChange={(checked) => changeDarkModeChecked(checked)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
                checked={darkModeChecked}
              />
            </Form.Item>
            {message.length > 0 && (
              <Alert message={message} type="error" showIcon />
            )}
            <Button
              type="ghost"
              htmlType="submit"
              disabled={submitDisabled}
              tabIndex={6}
              loading={submitLoading}
              onClick={(e) => handleSubmit(e, "password", options)}
            >
              Create Account
            </Button>
          </Form>
          <div className="below-form">
            <p>or continue with</p>
            <div className="social-media-login">
              <GoogleSignupButton
                cb={(result) => handleSubmit(result, "google", options)}
              />
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}

export default SignUp;
