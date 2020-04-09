import React, { useState, useEffect } from "react";

import { Layout, Button, Row, Col } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import Autocomplete from "./Autocomplete/Autocomplete";
import Select from "./Select/Select";

import { SubjectLogo, getSubject } from "./utils";

import "./HorizontalNav.css";

const { Header } = Layout;

// TODO: Add something like a tooltip to the name next to the logo as there is limitted text real estate
// TODO: continued: and the user should have someway to see the entirety of their subject
export default function HorizontalNav({ setAuthInfo, onLogout, authInfo }) {
  const { user } = authInfo;
  const defaultSubject = user.defaultSubject;
  const userId = user._id;
  // const { picture, pictureAlt, name } = subject;
  const [subject, setSubject] = useState({
    name: "",
    picture: "",
    pictureAlt: "",
  });
  const [loading, finishedLoading] = useState(false);
  const { name, picture, pictureAlt } = subject;

  useEffect(() => {
    getSubject(defaultSubject, { setSubject, finishedLoading });
  }, []);

  return (
    <Header className="horizontal-nav">
      {loading && (
        <Row>
          <Col xs={24} sm={24} md={6} lg={6} xl={5} xxl={4}>
            <h1>
              <SubjectLogo {...{ picture, pictureAlt }} />
              <span>{name}</span>
            </h1>
          </Col>
          <Col
            className="menu-col"
            xs={0}
            sm={0}
            md={18}
            lg={18}
            xl={19}
            xx={20}
          >
            <Autocomplete />
            <Select {...{ defaultSubject, userId, setSubject }} />
            <Button
              icon={<LogoutOutlined />}
              shape="circle"
              onClick={() => onLogout(setAuthInfo)}
            />
          </Col>
        </Row>
      )}
    </Header>
  );
}
