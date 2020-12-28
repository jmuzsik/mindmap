import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  H5,
  Alignment,
  Card,
  Elevation,
  Navbar,
} from "@blueprintjs/core";

import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing layout">
      <header>
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>
              <img
                src="https://media.wired.com/photos/5cdefc28b2569892c06b2ae4/master/w_2560%2Cc_limit/Culture-Grumpy-Cat-487386121-2.jpg"
                alt="logo"
              />
              <span>Mind 2.0</span>
            </Navbar.Heading>
          </Navbar.Group>
        </Navbar>
      </header>
      <main>
        <Card elevation={Elevation.TWO}>
          <H5>Do Something</H5>
          <Button intent="primary">
            <Link to="/login">Log In</Link>
          </Button>
          <Button intent="none">
            <Link to="/signup">Create Account</Link>
          </Button>
        </Card>
      </main>
    </div>
  );
}
