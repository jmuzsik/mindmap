import React, { useState, useEffect } from "react";

export default function ThemeWrapper({ children, props }) {
  const [stylesheetRendered, setStylesheetRendered] = useState(false);
  let currentTheme = props.authInfo.user.theme;
  useEffect(() => {
    // TODO: handle errors and make this actually use an API or the like
    if (currentTheme === "dark") {
      import("antd/dist/antd.dark.min.css").then(() => {
        setStylesheetRendered(true);
      });
    } else {
      import("antd/dist/antd.min.css").then(() => {
        setStylesheetRendered(true);
      }); 
    }
  });
  return stylesheetRendered ? (
    React.cloneElement(children, { ...props, theme: currentTheme })
  ) : (
    <div>Loading</div>
  );
}
