import React from "react";

import { Button } from "@blueprintjs/core";

import "./PageHeader.css";

function handleBack(history, previous) {
  history.push(previous);
}

export default function PageHeaderContainer({
  history,
  previous,
  rightButton,
}) {
  return (
    <nav className="page-header">
      <div className="page-header-heading">
        <div className="page-header-back">
          <Button
            icon="arrow-left"
            onClick={() => handleBack(history, previous)}
          />
        </div>
        <div className="page-header-right">{rightButton}</div>
      </div>
    </nav>
  );
}
