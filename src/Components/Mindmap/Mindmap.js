import React, { useState, useEffect, useRef } from "react";
import { Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { useSpring, animated } from "react-spring";
import { createConnections, createNodes } from "./utils/jsx";

import "./main.css";
import { useDeepEffect } from "../../Utils/utils";

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

function check(a, b) {
  if (
    JSON.stringify(a, getCircularReplacer()) !==
    JSON.stringify(b, getCircularReplacer())
  ) {
    return true;
  }
  return false;
}

export default function Mindmap(props) {
  const ref = props.svgRef;
  const [nodes, setNodes] = useState({
    data: props.nodes,
    jsx: createNodes(props.nodes),
  });
  const [connections, setConnections] = useState({
    data: props.connections,
    jsx: createConnections(props.nodes, props.connections),
  });

  useDeepEffect(() => {
    setNodes({ data: props.nodes, jsx: createNodes(props.nodes) });
  }, [props.nodes]);

  useDeepEffect(() => {
    setConnections({
      data: props.connections,
      jsx: createConnections(props.nodes, props.connections),
    });
  }, [props.connections]);

  return (
    <div className={`mindmap`}>
      <svg viewBox="0 0 1000 1000" className="mindmap-svg" ref={ref}>
        <g>{connections.jsx}</g>
        <g>{nodes.jsx}</g>
      </svg>
    </div>
  );
}
