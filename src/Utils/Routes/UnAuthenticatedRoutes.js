import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

const Landing = lazy(() => import("../../Routes/Landing/Landing"));
const SignUp = lazy(() =>
  import("../../Routes/Authentication/Containers/Exports/Signup")
);
const Login = lazy(() =>
  import("../../Routes/Authentication/Containers/Exports/Login")
);
const Recover = lazy(() =>
  import("../../Routes/Authentication/Containers/Exports/Recover")
);
const RecoverSuccess = lazy(() =>
  import("../../Routes/Authentication/Containers/Exports/RecoverSuccess")
);
const NewPassword = lazy(() =>
  import("../../Routes/Authentication/Containers/Exports/NewPassword")
);
const NonexistentToken = lazy(() =>
  import("../../Routes/Authentication/Containers/Exports/NonexistentToken")
);
// const FourOFour = lazy(() => import("../../Routes/FourOFour/FourOFour"));

export default function UnAuthenticatedRoutes(props) {
  localStorage.clear()
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/" exact render={() => <Landing />} />
        <Route
          exact
          path="/signup"
          render={(renderProps) => <SignUp {...renderProps} {...props} />}
        />
        <Route
          exact
          path="/login"
          render={(renderProps) => <Login {...renderProps} {...props} />}
        />
        <Route
          exact
          path="/recover-password"
          render={(renderProps) => <Recover {...renderProps} {...props} />}
        />
        <Route
          exact
          path="/recover-password-success"
          render={(renderProps) => (
            <RecoverSuccess {...renderProps} {...props} />
          )}
        />
        <Route
          path="/change-password/:token"
          render={(renderProps) => <NewPassword {...renderProps} {...props} />}
        />
        <Route
          exact
          path="/nonexistent-token"
          render={() => <NonexistentToken />}
        />
        <Route render={() => <Landing />} />
      </Switch>
    </Suspense>
  );
}
