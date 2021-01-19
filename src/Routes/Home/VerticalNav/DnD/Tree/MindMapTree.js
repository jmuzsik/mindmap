import React from "react";
import { Classes, Tree } from "@blueprintjs/core";

import { createTreeDustbins } from "../utils";

// use Component so it re-renders everytime: `nodes` are not a primitive type
// and therefore aren't included in shallow prop comparison
export default class MindMapTree extends React.Component {
  state = {
    data: this.props.data,
    structure: this.props.structure,
    subject: this.props.subject,
    contents: createTreeDustbins({
      data: this.props.data,
      structure: this.props.structure,
      subject: this.props.subject,
    }),
  };

  render() {
    return (
      <Tree
        contents={this.state.contents}
        onNodeClick={this.handleNodeClick}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
        className={Classes.ELEVATION_0}
      />
    );
  }

  handleNodeClick = (nodeData, _nodePath, e) => {
    const originallySelected = nodeData.isSelected;
    if (!e.shiftKey) {
      this.forEachNode(this.state.nodes, (n) => (n.isSelected = false));
    }
    nodeData.isSelected =
      originallySelected == null ? true : !originallySelected;
    this.setState(this.state);
  };

  handleNodeCollapse = (nodeData) => {
    console.log(nodeData);
    nodeData.isExpanded = false;
    this.setState(this.state);
  };

  handleNodeExpand = (nodeData) => {
    console.log(nodeData);
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
    if (
      JSON.stringify(prevProps.structure) !==
        JSON.stringify(this.props.structure) ||
      JSON.stringify(prevProps.subject) !== JSON.stringify(this.props.subject)
    ) {
      this.setState({
        contents: createTreeDustbins({
          data: this.props.data,
          structure: this.props.structure,
          subject: this.props.subject,
        }),
      });
    }
  }
}
