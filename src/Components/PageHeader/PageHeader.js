import React from "react";

import { PageHeader } from "antd";

function handleBack(history, previous) {
  history.push(previous);
}

export default function PageHeaderContainer({
  history,
  previous,
  title,
  subTitle,
  extra = [],
}) {
  return (
    <PageHeader
      onBack={() => handleBack(history, previous)}
      title={title}
      subTitle={subTitle}
      extra={extra}
    />
  );
}
