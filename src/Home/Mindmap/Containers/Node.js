/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo } from "react";
import {
  Popover,
  Classes,
  Position,
  Icon,
  PopoverInteractionKind,
  Intent,
} from "@blueprintjs/core";
import PropTypes from "prop-types";

const Node = ({ x, node, y, radius, color, scale = 1 }) => {
  const { type, depth, jsx, id } = node;
  const icon =
    type === "note" ? "annotation" : type === "image" ? "media" : "home";
  return (
    <foreignObject
      className={`depth-${depth}`}
      transform={`translate(${x - radius},${y - radius}) scale(${scale})`}
      width={radius * 2}
      height={radius * 2}
      style={{ background: color }}
    >
      <Popover
        interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
        content={jsx}
        position={Position.TOP}
        popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      >
        <Icon
          icon={icon}
          className="node-circle"
          intent={Intent.PRIMARY}
          style={{ height: radius * 2, width: radius * 2 }}
        ></Icon>
      </Popover>
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
