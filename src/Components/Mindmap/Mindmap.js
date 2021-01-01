import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  zoom,
  zoomIdentity,
  path,
} from "d3";

import { d3Connections, d3Nodes, d3Drag, d3PanZoom, onTick } from "./utils/d3";
import { getDimensions, getViewBox } from "./utils/dimensions";
import subnodesToHTML from "./utils/subnodesToHTML";
import nodeToHTML from "./utils/nodeToHTML";

import "./main.css";

const svgWidth = 960,
  svgHeight = 500;

const margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;

function searchTree(element, matchingTitle) {
  if (element.id === matchingTitle) {
    return element;
  } else if (element.nodes.length > 0) {
    let i;
    let result = null;
    for (i = 0; result == null && i < element.nodes.length; i++) {
      result = searchTree(element.nodes[i], matchingTitle);
    }
    return result;
  }
  return null;
}

// Related to creating connections jsx
function createConnections(nodes, connections) {
  return connections.map((conn, idx) => (
    <path
      key={idx}
      className="mindmap-connection"
      pathLength={90}
      d={createPath(nodes, conn)}
      onClick={(ev) => {
        const target = ev.target;
        target.setAttribute("stroke-dasharray", 90 + " " + 90);
        target.setAttribute("stroke-dashoffset", 90);
        target.setAttribute("stroke-dasharray", 90 + " " + 90);
      }}
    ></path>
  ));
}

function createPath(nodes, { source, curve, target }) {
  let s, t;
  for (let i = 0; i < nodes.length; i++) {
    s = searchTree(nodes[i], source);
    if (s) break;
  }
  for (let i = 0; i < nodes.length; i++) {
    t = searchTree(nodes[i], target);
    if (t) break;
  }
  return `M ${s.fx} ${s.fy} Q ${s.fx + (curve && curve.x ? curve.x : 0)} ${
    s.fy + (curve && curve.y ? curve.y : 0)
  } , ${t.fx} ${t.fy}`;
}

function GTag({ x, y, className, children, id }) {
  return (
    <g key={id} className={className} x={x} y={y}>
      {children}
    </g>
  );
}

function createLeftNodes(nodes) {
  return nodes.map((node, i) => (
    <g id={`${i}-left`} className="mindmap-node mindmap-node--editable">
      <foreignObject
        className="mindmap-node"
        x={node.fx}
        y={node.fy}
        width={100}
        height={100}
      >
        {node.text}
      </foreignObject>
    </g>
  ));
}
// Related to creating top-level nodes
function createRightNodes(nodes, level = 1) {
  const final = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    let elem;
    if (node.nodes.length === 0 && level === 1) {
      final.push(null);
    } else if (node.nodes.length === 0 && level > 1) {
      final.push(
        <foreignObject
          x={node.fx}
          y={node.fy}
          width={100}
          height={100}
          key={`${level}-${i}`}
          className="mindmap-subnode-group"
        >
          <div xmlns="http://www.w3.org/1999/xhtml">{node.text}</div>
        </foreignObject>
      );
    } else {
      if (level === 1) {
        elem = (
          <GTag
            id={`${i}-right-${level}-${Math.random()}`}
            className="mindmap-subnodes"
            x={node.fx}
            y={node.fy}
            children={createRightNodes(node.nodes, level + 1)}
          />
        );
      } else if (level > 1) {
        elem = (
          <foreignObject
            x={node.fx}
            y={node.fy}
            width={100}
            height={100}
            key={`${level}-${i}`}
            className="mindmap-subnode-group"
          >
            <div xmlns="http://www.w3.org/1999/xhtml">{node.text}</div>
            {createRightNodes(node.nodes, level + 1)}
          </foreignObject>
        );
      }
      final.push(elem);
    }
  }
  return final;
}

function createNodes(nodes) {
  let smallest = Infinity,
    largest = 0;
  const leftNodes = createLeftNodes(nodes, smallest, largest);
  const rightNodes = createRightNodes(nodes, 1, smallest, largest);

  const arr = [];
  for (let i = 0; i < leftNodes.length; i++) {
    const lnode = leftNodes[i];
    const rnode = rightNodes[i];
    const elem = (
      <g transform={`translate(${margin.left}, ${margin.top})`} idx={i}>
        {lnode}
        {rnode}
      </g>
    );
    arr.push(elem);
  }
  return arr;
}

export default class MindMap extends Component {
  constructor(props) {
    super(props);

    // Create force simulation to position nodes that have no coordinates,
    // and add it to the state.
    const simulation = forceSimulation()
      .force(
        "link",
        forceLink().id((node) => node.id)
      )
      .force("charge", forceManyBody())
      .force("collide", forceCollide().radius(100));

    this.state = {
      simulation,
      connections: createConnections(this.props.nodes, this.props.connections),
      nodes: createNodes(this.props.nodes),
    };
  }

  /*
   * Add new class to nodes, attach drag behavior, and start simulation.
   */
  prepareEditor(svg, conns, nodes) {
    d3Drag(this.state.simulation, svg, nodes);
  }

  /*
   * Render mind map using D3.
   */
  renderMap() {
    const svg = select(this.mountPoint);

    svg.call(d3PanZoom(svg));

    this.prepareEditor(svg, this.state.connections, this.state.nodes);
  }

  componentDidMount() {
    this.renderMap();
  }

  componentDidUpdate() {
    zoom().transform(select(this.refs.mountPoint), zoomIdentity);
    this.renderMap();
  }

  render() {
    console.log(this.state);
    return (
      <div>
        {/* <svg
          className="mindmap-svg"
          ref={(input) => {
            this.mountPoint = input;
          }}
        /> */}
        <svg
          viewBox="-496.2056231217888 -809.1641376795345 1101.9895485037264 1112.7334874391197"
          className="mindmap-svg"
          ref={(input) => {
            this.mountPoint = input;
          }}
        >
          <g>{this.state.connections}</g>
          {this.state.nodes}
        </svg>
      </div>
    );
  }
}

MindMap.defaultProps = {
  nodes: [],
  connections: [],
  editable: false,
};

MindMap.propTypes = {
  nodes: PropTypes.array,
  connections: PropTypes.array,
  editable: PropTypes.bool,
};
