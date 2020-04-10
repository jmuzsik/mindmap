import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  H4,
  Divider,
  FormGroup,
  Switch,
  Callout,
  Intent,
} from "@blueprintjs/core";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import FormItem from "../../../../Components/Form/FormItem/FormItem";
import PageHeader from "../../../../Components/PageHeader/PageHeader";

import { handleSubmit } from "./utils";
import { GoogleSignupButton } from "../../Requests/Google";

import "../../Styles/Styles.css";

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
  // Show password state
  const [showPassword, toggleShowPassword] = useState(false);

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
    <section className="auth signup layout">
      <header>
        <PageHeader
          history={history}
          previous="/"
          rightButton={
            <Button>
              <Link to="/login">Log In</Link>
            </Button>
          }
        />
      </header>
      <Card>
        <H4>Create Account</H4>
        <Divider />
        <div className="card-body">
          <form>
            <FormItem
              {...{
                name: "firstName",
                placeholder: "First Name",
                autoFocus: true,
                required: true,
                value: firstName,
                hook: changeFirstName,
              }}
            />
            <FormItem
              {...{
                name: "lastName",
                placeholder: "Last Name",
                required: true,
                value: lastName,
                hook: changeLastName,
              }}
            />
            <FormItem
              {...{
                name: "email",
                placeholder: "Email Address",
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
            <Switch
              label="Dark Theme"
              onChange={(ev) => changeDarkModeChecked(ev.target.checked)}
              checked={darkModeChecked}
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
              onClick={(e) => handleSubmit(e, "password", options)}
            >
              Create Account
            </Button>
          </form>
        </div>
        <div className="below-form">
          <p>or continue with</p>
          <div className="social-media-login">
            <GoogleSignupButton
              cb={(result) => handleSubmit(result, "google", options)}
            />
          </div>
        </div>
      </Card>
    </section>
  );
}

export default SignUp;
