import React from "react";
import { Icon } from "@blueprintjs/core";

export function SubjectLogo({ picture, pictureAlt }) {
  if (picture === "default") {
    return <Icon icon="virus" alt="default subject image" />;
  } else {
    return <img src={picture} alt={pictureAlt} />;
  }
}
