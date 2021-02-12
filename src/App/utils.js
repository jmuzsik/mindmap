import React from "react";

import db from "../db";

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

export async function updateUserStep(step, setUser) {
  const user = await db.user.toCollection().first();
  await db.user.update(user.id, { step });
  const updatedUser = await db.user.get(user.id);
  setUser(updatedUser);
}
