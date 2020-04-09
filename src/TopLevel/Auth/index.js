import React, { useState, useEffect } from "react";

import { handleAuth, onLogout } from "./utils";
import AuthClass from "./Class";

const defaultUser = {
  firstName: "",
  lastName: "",
  email: "",
  createdAt: "",
  picture: "",
  pictureAlt: "",
  theme: "light",
  defaultSubject: "",
  subjects: [],
};

// Right now the persistence of the user is done with localStorage
// This has it's negatives but the primary requirement that I must do to
// protect people from accessing this is to make sure everything I import is
// safe javascript being imported, so careful with the imports
export default function UserWrapper({ children }) {
  const { token, refreshToken } = AuthClass.getTokens();
  const user = AuthClass.getUser();

  const [authInfo, setAuthInfo] = useState({
    authenticated: token && refreshToken ? true : false,
    user: user || defaultUser,
    token,
    refreshToken,
  });
  const [finishedAuthenticating, setFinishedAuthenticating] = useState(false);

  // TODO: what did i do to this...
  useEffect(() => {
    // Init page load without local storage does nothing

    // Tokens have been set in the past
    if (token && refreshToken) {
      if (authInfo.updateUser) {
        AuthClass.setUser(authInfo.user);
      } else {
        const authObj = handleAuth(token, refreshToken);
        // Authenticated but new token was created
        if (authObj.newToken) {
          setAuthInfo({
            authenticated: true,
            // New tokens
            token: authObj.token,
            refreshToken: authObj.refreshToken,
            // Keep previous user object as we may have user data there,
            // ie. it is not default user
            user: authInfo.user,
          });
          // Authenticated but same token was used
        } else if (authObj.authenticated) {
          setAuthInfo({ ...authInfo, authenticated: true });
        }
      }
      // The tokens are not set to local storage but they are on the user object
      // This happens right after login or signup
      // Just set the tokens, all else is good
    } else if (authInfo.token && authInfo.refreshToken) {
      AuthClass.setTokens({
        token: authInfo.token,
        refreshToken: authInfo.refreshToken,
      });
      AuthClass.setUser(authInfo.user);
    }
    setFinishedAuthenticating(true);
  }, [token, refreshToken, authInfo]);

  return finishedAuthenticating ? (
    React.cloneElement(children, {
      props: {
        setAuthInfo,
        authInfo,
        onLogout,
      },
    })
  ) : (
    <div>Loading</div>
  );
}
