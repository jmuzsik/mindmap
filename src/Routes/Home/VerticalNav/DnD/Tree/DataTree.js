import React from "react";

import { Classes, Tree } from "@blueprintjs/core";
import { createTreeBoxes } from "../utils";

// use Component so it re-renders everytime: `nodes` are not a primitive type
// and therefore aren't included in shallow prop comparison
export default class DataTree extends React.Component {
  state = {
    contents: createTreeBoxes({
      data: this.props.data,
      hooks: this.props.hooks,
    }),
  };

  render() {
    return (
      <Tree
        contents={this.state.contents}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
        className={Classes.ELEVATION_0}
      />
    );
  }

  handleNodeCollapse = (nodeData) => {
    nodeData.isExpanded = false;
    this.setState(this.state);
  };

  handleNodeExpand = (nodeData) => {
    nodeData.isExpanded = true;
    this.setState(this.state);
  };

  forEachNode(nodes, callback) {
    if (nodes == null) {
      return;
    }

    for (const node of nodes) {
      callback(node);
      this.forEachNode(node.childNodes, callback);
    }
  }
  componentDidUpdate(prevProps) {
    console.log(prevProps.data, this.props.data)
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        contents: createTreeBoxes({
          data: this.props.data,
          hooks: this.props.hooks,
        }),
      });
    }
  }
}
