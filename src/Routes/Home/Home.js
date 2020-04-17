import React from "react";

import HorizontalNav from "../../Components/Navigation/HorizontalNav/HorizontalNav";
import VerticalNav from "../../Components/Navigation/VerticalNav/VerticalNav";

import "./Home.css";

export default function Home(props) {
  return (
    <section className="home layout">
      <HorizontalNav {...props} />
      <main>
          <VerticalNav />
          <div>This is a div with a little content</div>
      </main>
    </section>
  );
}
