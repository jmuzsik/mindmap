import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../../Routes/Home/Home";

// TODO: is this going to be needed?
export default function AuthenticatedRoutes(props) {
  return (
    <Switch>
      <Route
        render={(renderProps) => <Home {...{ ...props, ...renderProps }} />}
      />
    </Switch>
  );
}
