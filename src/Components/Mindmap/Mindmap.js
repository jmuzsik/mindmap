import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { createConnections, createNodes } from "./utils/jsx";

import "./main.css";

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
  const [nodes, setNodes] = useState({
    data: props.nodes,
    jsx: createNodes(props.nodes),
  });
  const [connections, setConnections] = useState({
    data: props.connections,
    jsx: createConnections(props.nodes, props.connections),
  });

  useEffect(() => {
    if (check(nodes.data, props.nodes)) {
      setNodes({ data: props.nodes, jsx: createNodes(props.nodes) });
    }
    if (check(connections.data, props.connections)) {
      setConnections({
        data: props.connections,
        jsx: createConnections(props.nodes, props.connections),
      });
    }
  }, [props.nodes, nodes, props.connections, connections]);

  return (
    <div className="mindmap">
      <svg
        viewBox="0 0 1000 1000"
        className="mindmap-svg"
      >
        <g>{connections.jsx}</g>
        <g>{nodes.jsx}</g>
      </svg>
    </div>
  );
}
