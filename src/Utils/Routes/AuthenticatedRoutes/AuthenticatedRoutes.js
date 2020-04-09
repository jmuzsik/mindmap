import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import NewSubjectForm from "../../../Routes/Forms/NewSubjectForm/NewSubjectForm";

import {
  handleFirstSubjectRoute,
  handleHomeRoute,
} from "./AuthenticatedRoutesUtils";

const Home = lazy(() => import("../../../Routes/Home/Home"));

export default function AuthenticatedRoutes(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route
          path="/"
          exact
          render={(renderProps) => {
            const properties = handleHomeRoute(renderProps, props);
            if (properties.error === "no subject") {
              return <NewSubjectForm {...properties} />;
            }
            return <Home {...properties} />;
          }}
        />
        <Route
          render={(renderProps) => {
            const properties = handleHomeRoute(renderProps, props);
            if (properties.error === "no subject") {
              return <NewSubjectForm {...properties} />;
            }
            return <Home {...properties} />;
          }}
        />
      </Switch>
    </Suspense>
  );
}
