/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo, useState } from "react";
import { Popover, Classes, Position, Button, Intent } from "@blueprintjs/core";
import PropTypes from "prop-types";

import Dialog from "../../../../Components/Dialog/Dialog";

const Node = ({ x, node, y, radius, color, scale = 1 }) => {
  const [isOpen, setOpen] = useState(false);
  const { type, depth, jsx, id } = node;
  const icon = type === "note" ? "annotation" : "image-rotate-left";
  return (
    <foreignObject
      className={`depth-${depth}`}
      transform={`translate(${x - radius},${y - radius}) scale(${scale})`}
      width={radius * 2}
      height={radius * 2}
      fill={color}
      style={{ background: color }}
    >
      <Popover
        content={
          type === "subject" ? (
            jsx
          ) : (
            <div className="node-dialog">
              <Button
                intent={Intent.PRIMARY}
                minimal
                onClick={() => setOpen(true)}
              >
                View
              </Button>
              <Dialog
                {...{
                  className: `node-dialog-${type}`,
                  icon,
                  title: type === "note" ? "Note " + id : "Image " + id,
                  isOpen,
                  setOpen,
                }}
              >
                {jsx}
              </Dialog>
            </div>
          )
        }
        position={Position.TOP}
        popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      >
        <div style={{ height: radius * 2, width: radius * 2 }} />
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
