import React from "react";
import DEFAULTS from "./defaults";

export function checkUserLoaded(user) {
  if (!user.id) {
    return " bp3-skeleton";
  } else {
    return "";
  }
}

export const UserContext = React.createContext({
  user: DEFAULTS.user,
  setUser: () => null,
});
