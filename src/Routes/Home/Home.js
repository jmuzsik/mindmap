import React, { useState, useEffect } from "react";
import { Layout } from "antd";

import HorizontalNav from "../../Components/Navigation/HorizontalNav/HorizontalNav";

import "./Home.css";

const { Content } = Layout;

export default function Home(props) {
  return (
    <Layout className="home">
      <HorizontalNav {...props} />
      <Content></Content>
    </Layout>
  );
}
