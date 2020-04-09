import React, { useState, useEffect } from "react";

import { Typography, Divider, Layout, Card, Form, Button, Alert } from "antd";

import FormItem from "../../../Components/Form/FormItem/FormItem";

import { handleSubmit } from "./utils";

import "./NewSubjectForm.css";

const { Content } = Layout;
const { Paragraph, Text } = Typography;

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
    <Layout className="new-subject-form">
      <Content>
        <Card title="Your first subject">
          <Typography>
            <Paragraph>
              The focus on this website is to offer a great way to organise
              information. What you are creating here, a subject{" "}
              <Text type="secondary">
                (though what you put here can always be changed!)
              </Text>{" "}
              is simply the word which you want to be at the center of this
              information. And it can literally be anything, this website aims
              to be as fluid as your brain. But unlike our brain, the
              information can be consolidated.
            </Paragraph>
          </Typography>
          <Divider />
          <Form>
            <FormItem
              {...{
                name: "text",
                placeholder: "Name of subject",
                autoFocus: true,
                required: true,
                value: name,
                hook: changeName,
                tabIndex: 1,
              }}
            />
            <Button
              type="primary"
              disabled={!submitDisabled}
              loading={submitLoading}
              onClick={() => handleSubmit(options)}
            >
              Submit
            </Button>
            {message.length > 0 && (
              <Alert message={message} type="error" showIcon />
            )}
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
