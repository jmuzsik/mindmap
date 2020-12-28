import React from "react";

import Layout from "../../Components/Layout/Layout";

import "./Home.css";

export default function Home(props) {
  return (
    <Layout {...props}>
      <div>This is the home page</div>
    </Layout>
  );
}
