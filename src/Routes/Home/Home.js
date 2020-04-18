import React from "react";

import HorizontalNav from "../../Components/Navigation/HorizontalNav/HorizontalNav";
import VerticalNav from "../../Components/Navigation/VerticalNav/VerticalNav";

import "./Home.css";

export default function Home({ setAuthInfo, onLogout, authInfo, history }) {
  return (
    <section className="home layout">
      <HorizontalNav {...{ setAuthInfo, onLogout, authInfo }} />
      <main>
        <VerticalNav {...{ history }} />
        <div>This is a div with a little content</div>
      </main>
    </section>
  );
}
