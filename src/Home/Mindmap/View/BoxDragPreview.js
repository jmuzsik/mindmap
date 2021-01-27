import React, { useEffect, useState, memo } from "react";
import { Box } from "./Box";
const styles = {
  display: "inline-block",
  transform: "rotate(-7deg)",
  WebkitTransform: "rotate(-7deg)",
};
export const BoxDragPreview = memo(({ content, dimensions }) => {
  const [tickTock, setTickTock] = useState(false);
  useEffect(
    function subscribeToIntervalTick() {
      const interval = setInterval(() => setTickTock(!tickTock), 500);
      return () => clearInterval(interval);
    },
    [tickTock]
  );
  return (
    <div
      style={{ ...styles, height: dimensions.height, width: dimensions.width }}
    >
      <Box content={content} yellow={tickTock} />
    </div>
  );
});
