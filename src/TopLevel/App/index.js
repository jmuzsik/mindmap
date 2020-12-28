import React from "react";

import "draft-js/dist/Draft.css";

import UnAuthenticatedRoutes from "../../Utils/Routes/UnAuthenticatedRoutes";
import AuthenticatedRoutes from "../../Utils/Routes/AuthenticatedRoutes/AuthenticatedRoutes";

function App(props) {
  const theme = props.theme;
  return (
    <div className={`${theme === "dark" ? "bp3-dark" : ""}`}>
      {props.authInfo.authenticated && <AuthenticatedRoutes {...props} />}
      {!props.authInfo.authenticated && <UnAuthenticatedRoutes {...props} />}
    </div>
  );
}

export default App;
