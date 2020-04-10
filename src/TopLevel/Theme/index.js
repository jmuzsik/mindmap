import React from "react";
import { FocusStyleManager } from "@blueprintjs/core";
 
FocusStyleManager.onlyShowFocusOnTabs();

export default function ThemeWrapper({ children, props }) {
  let currentTheme = props.authInfo.user.theme;

  return React.cloneElement(children, { ...props, theme: currentTheme });
}
