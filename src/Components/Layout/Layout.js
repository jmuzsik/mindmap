import React from "react";

import HorizontalNav from "../Navigation/HorizontalNav/HorizontalNav";
import VerticalNav from "../Navigation/VerticalNav/VerticalNav";

import "./Layout.css";

export default function Layout(props) {
  const { setAuthInfo, onLogout, authInfo, history, children } = props;
  return (
    <section className="layout">
      <HorizontalNav {...{ setAuthInfo, onLogout, authInfo, history }} />
      <main>
        <VerticalNav {...{ history }} />
        <aside>{children}</aside>
      </main>
    </section>
  );
}
