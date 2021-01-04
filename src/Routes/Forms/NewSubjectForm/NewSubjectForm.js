import React, { useState, useEffect } from "react";

import { Button, Divider, Intent, Callout, Card, H4 } from "@blueprintjs/core";

import FormItem from "../../../Components/Form/FormItem/FormItem";

import { handleSubmit } from "./utils";

import "./NewSubjectForm.css";

// Name and image, is that it?
export default function NewSubjectForm(props) {
  const { history, setAuthInfo, authInfo } = props;
  const [submitDisabled, toggleSubmitDisabled] = useState(true);
  // form state
  const [name, changeName] = useState("");

  const [submitLoading, toggleSubmitLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (name.length === 0) {
      toggleSubmitDisabled(false);
    } else {
      toggleSubmitDisabled(true);
    }
  }, [name]);

  const options = {
    state: { name, authInfo },
    hooks: { toggleSubmitLoading, setMessage, setAuthInfo },
    history,
  };

  return (
    <section className="new-subject-form layout">
      <Card>
        <H4>Your first subject</H4>
        <Divider />
        <div className="card-body">
          <p className="bp3-running-text">
            The focus on this website is to offer a great way to organise
            information. What you are creating here, a subject, is simply the
            word which you want to be at the center of a set of information.
          </p>
          <form>
            <FormItem
              {...{
                name: "text",
                placeholder: "Name of subject",
                autoFocus: true,
                required: true,
                value: name,
                hook: changeName,
              }}
            />
            <Button
              intent={Intent.PRIMARY}
              disabled={!submitDisabled}
              loading={submitLoading}
              onClick={() => handleSubmit(options)}
            >
              Submit
            </Button>
            {message.length > 0 && (
              <Callout intent={Intent.DANGER} icon="error">
                {message}
              </Callout>
            )}
          </form>
        </div>
      </Card>
    </section>
  );
}
