import React from "react";

import HorizontalNav from "../../Components/Navigation/HorizontalNav/HorizontalNav";

import "./Home.css";

export default function Home(props) {
  return (
    <section className="home layout">
      <HorizontalNav {...props} />
    </section>
  );
}
