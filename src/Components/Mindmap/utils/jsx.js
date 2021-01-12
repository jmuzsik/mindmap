import React, { useState } from "react";
import { searchTree } from "./index";
import { useDrag } from "react-use-gesture";

// Stuff related to the actual nodes
function GTag({ x, y, className, children, id }) {
  return (
    <g key={id} className={className} x={x} y={y}>
      {children}
    </g>
  );
}

function createKey(i, level = 0) {
  return `${level}-${i}`;
}
function CustomLabel({ node, level, i, className, children }) {
  const key = createKey(i, level);
  return (
    <foreignObject
      x={node.fx}
      y={node.fy}
      width={node.width}
      height={node.height}
      key={key}
      className={className}
    >
      {children}
    </foreignObject>
  );
}

export function createLeftNodes(nodes) {
  return nodes.map((node, i) => (
    <GTag
      key={`${i}-left`}
      id={`${i}-left`}
      className="mindmap-node mindmap-node--editable"
    >
      <CustomLabel
        key={Math.random() * 100}
        i={i}
        node={node}
        className="mindmap-node"
      >
        {node.content}
      </CustomLabel>
    </GTag>
  ));
}
// Related to creating top-level nodes
export function createRightNodes(nodes, level = 1) {
  const final = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    let elem;
    if (node.nodes.length === 0 && level === 1) {
      final.push(null);
    } else if (node.nodes.length === 0 && level > 1) {
      final.push(
        <CustomLabel key={Math.random() * 100} i={i} node={node} level={level}>
          {node.content}
        </CustomLabel>
      );
    } else {
      if (level === 1) {
        elem = (
          <GTag
            key={`${i}-right-${level}`}
            id={`${i}-right-${level}`}
            className="mindmap-subnodes"
            x={node.fx}
            y={node.fy}
            children={createRightNodes(node.nodes, level + 1)}
          />
        );
      } else if (level > 1) {
        elem = (
          <CustomLabel key={Math.random * 100} i={i} node={node} level={level}>
            {node.content}
            {createRightNodes(node.nodes, level + 1)}
          </CustomLabel>
        );
      }
      final.push(elem);
    }
  }
  return final;
}

export function createNodes(nodes) {
  const leftNodes = createLeftNodes(nodes);
  const rightNodes = createRightNodes(nodes, 1);

  const arr = [];
  for (let i = 0; i < leftNodes.length; i++) {
    const lnode = leftNodes[i];
    const rnode = rightNodes[i];
    const elem = (
      <g key={i} idx={i}>
        {lnode}
        {rnode}
      </g>
    );
    arr.push(elem);
  }
  return arr;
}

function Path({ nodes, conn }) {
  const [s, t] = getSourceAndTarget(nodes, conn);
  const [c, setC] = useState(conn.curve);
  const d = createPath(s, t, c);
  const bind = useDrag(({ movement: [mx, my] }) => {
    if (mx !== 0 && my !== 0) {
      setC({ x: mx, y: my });
    }
  });
  return (
    <path
      {...bind()}
      className="mindmap-connection"
      strokeDasharray="10"
      d={d}
    ></path>
  );
}

// Stuff related to connections
export function createConnections(nodes, connections) {
  return connections.map((conn, idx) => (
    <Path key={idx} nodes={nodes} conn={conn} />
  ));
}

function getSourceAndTarget(nodes, { source, curve = { x: 0, y: 0 }, target }) {
  let s, t;
  for (let i = 0; i < nodes.length; i++) {
    s = searchTree(nodes[i], source);
    if (s) break;
  }
  for (let i = 0; i < nodes.length; i++) {
    t = searchTree(nodes[i], target);
    if (t) break;
  }
  return [s, t];
}

function createPath(s, t, c = { x: 0, y: 0 }) {
  return `M ${s.fx} ${s.fy} Q ${s.fx + c.x * 2} ${s.fy + c.y * 2} ${t.fx} ${
    t.fy
  }`;
}
