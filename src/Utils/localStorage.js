// Home of non-persistent data stored in localStorage
const THEME_LIGHT = "light";
const THEME_DARK = "bp3-dark";
const THEME_KEY = "settings-theme";

const VIEW_DND = "dnd";
const VIEW_NETWORK = "network";
const VIEW_KEY = "settings-view";

function getKey(type) {
  switch (type) {
    case "theme":
      return THEME_KEY;
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
      localStorage.setItem("theme", THEME_DARK);
      return THEME_DARK;
    case "view":
      localStorage.setItem("view", VIEW_DND);
      return VIEW_DND;
    default:
      return;
  }
}

function getOpp(type) {
  const curr = getItem(type);
  switch (type) {
    case "theme":
      return curr === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    case "view":
      return curr === VIEW_DND ? VIEW_NETWORK : VIEW_DND;
    default:
      return;
  }
}

/** Return the current item based on type. */
export function getItem(type) {
  return localStorage.getItem(getKey(type)) || getDef(type);
}

export function setItem(type) {
  return localStorage.setItem(getKey(type), getOpp(type));
}
