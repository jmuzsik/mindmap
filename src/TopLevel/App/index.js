import React from "react";

import UnAuthenticatedRoutes from "../../Utils/Routes/UnAuthenticatedRoutes";
import AuthenticatedRoutes from "../../Utils/Routes/AuthenticatedRoutes/AuthenticatedRoutes";

function App(props) {
  const theme = props.theme;
  return (
    <div className={`${theme}`}>
      {props.authInfo.authenticated && <AuthenticatedRoutes {...props} />}
      {!props.authInfo.authenticated && <UnAuthenticatedRoutes {...props} />}
    </div>
  );
}

export default App;
