import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { renderFunction } from "./AuthenticatedRoutesUtils";

export default function AuthenticatedRoutes(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route
          path="/"
          exact
          render={(renderProps) => renderFunction(renderProps, props)}
        />
        <Route
          exact
          path="/notes"
          render={(renderProps) => renderFunction(renderProps, props)}
        />
        <Route
          exact
          path="/images"
          render={(renderProps) => renderFunction(renderProps, props)}
        />
        <Route render={(renderProps) => renderFunction(renderProps, props)} />
      </Switch>
    </Suspense>
  );
}
