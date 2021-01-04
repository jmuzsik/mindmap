import React, { memo } from "react";

import "./Container.css";

export const TreeContainer = memo(function TreeContainer(props) {
  return <div className="tree-map">{props.children}</div>;
});
