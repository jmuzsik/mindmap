/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo } from "react";
import { Classes, Icon, Intent } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import PropTypes from "prop-types";

const icons = [
  "circle",
  "clean",
  "locate",
  "predictive-analysis",
  "tick",
  "graph",
  "layout-circle",
  "airplane",
  "hand",
  "hand-right",
  "hand-left",
  "key",
  "rig",
  "star",
  "symbol-circle",
  "symbol-diamond",
  "taxi",
  "walk",
  "flame",
  "heart",
  "moon",
  "mountain",
  "ninja",
  "tree",
  "ring",
];
function randomIcon() {
  const rand = Math.random();
  const len = icons.length;
  return icons[Math.floor(rand * len)];
}

const Node = ({ x, node, y, radius, color, scale = 1 }) => {
  const { depth, jsx } = node;
  // just as it looks sorta cool and i don't have a better way to put icons atm
  // the best thought is to have the ability to add an icon to a content, but it feels not necessary
  const icon = randomIcon();
  return (
    <foreignObject
      className={`depth-${depth}`}
      transform={`translate(${x - radius},${y - radius}) scale(${scale})`}
      width={radius * 2}
      height={radius * 2}
      style={{ background: color }}
    >
      <Popover2
        content={jsx}
        popoverClassName={`${Classes.POPOVER_CONTENT_SIZING} network-node-content`}
      >
        <Icon
          icon={icon}
          className="node-circle"
          intent={Intent.PRIMARY}
          style={{ height: radius * 2, width: radius * 2 }}
        ></Icon>
      </Popover2>
    </foreignObject>
  );
};

Node.propTypes = {
  node: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  scale: PropTypes.number,
};

export default memo(Node);
