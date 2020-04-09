import React from "react";
import { Link } from "react-router-dom";
import { Layout, Row, PageHeader } from "antd";
import { Button, Intent, Spinner } from "@blueprintjs/core";

import "./Landing.css";

const { Footer, Content } = Layout;

export default function Landing() {
  return (
    <Layout className="landing">
      <header>
        <Row>
          <img
            src="https://media.wired.com/photos/5cdefc28b2569892c06b2ae4/master/w_2560%2Cc_limit/Culture-Grumpy-Cat-487386121-2.jpg"
            alt="logo"
          />
        </Row>
      </header>
      <Content>
        <PageHeader ghost={false} onBack={null} title="Click Something">
          <div className="button-group">
            <Button type="primary">
              <Link to="/login">Log In</Link>
            </Button>
            <Button type="secondary">
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>
        </PageHeader>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
