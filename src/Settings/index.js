// Home of non-persistent data
import { Classes } from "@blueprintjs/core";

const DARK_THEME = Classes.DARK;
const LIGHT_THEME = "";
const THEME_KEY = "settings-theme";

const EDITOR_SNOW = "snow";
const EDITOR_BUBBLE = "bubble";
const EDITOR_KEY = "settings-editor";

const VIEW_NETWORK = "network";
const VIEW_DND = "dnd";
const VIEW_KEY = "settings-view";

function getKey(type) {
  switch (type) {
    case "theme":
      return THEME_KEY;
    case "editor":
      return EDITOR_KEY;
    case "view":
      return VIEW_KEY;
    default:
      return;
  }
}

// get and set the value
function getDef(type) {
  switch (type) {
    case "theme":
      setItem("theme", LIGHT_THEME);
      return LIGHT_THEME;
    case "editor":
      setItem("editor", EDITOR_SNOW);
      return EDITOR_SNOW;
    case "view":
      setItem("view", VIEW_DND);
      return VIEW_DND;
    default:
      return;
  }
}

function getOpposite(type, value) {
  switch (type) {
    case "theme":
      return value === "" ? DARK_THEME : LIGHT_THEME;
    case "editor":
      return value === "snow" ? EDITOR_BUBBLE : EDITOR_SNOW;
    case "view":
      return value === "dnd" ? VIEW_NETWORK : VIEW_DND;
    default:
      return;
  }
}

/** Return the current item based on type. */
export function getItem(type) {
  return localStorage.getItem(getKey(type)) || getDef(type);
}

/** Toggle or set known value in local storage. */
// Setting automatically only happens at start
export function setItem(type, value) {
  const key = getKey(type);
  if (value) localStorage.setItem(key, value);
  const current = getItem(type);
  const opposite = getOpposite(type, current);
  localStorage.setItem(key, opposite);
}
