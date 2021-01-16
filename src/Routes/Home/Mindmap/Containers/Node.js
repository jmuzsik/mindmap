/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo, useState } from "react";
import {
  Dialog,
  Popover,
  Classes,
  Position,
  Button,
  Icon,
  Intent,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import PropTypes from "prop-types";

function DialogWrapper(props) {
  const { className, icon, hook, title, isOpen, children } = props;
  return (
    <Dialog
      {...props}
      className={className}
      icon={icon}
      onClose={() => hook(false)}
      title={title}
      autoFocus
      canEscapeKeyClose
      canOutsideClickClose={false}
      enforceFocus
      isOpen={isOpen}
      usePortal
      labelElement={<Icon icon={IconNames.SHARE} />}
    >
      {children}
    </Dialog>
  );
}

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
      onClick={() => console.log("oi")}
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
              <DialogWrapper
                {...{
                  className: `node-dialog-${type}`,
                  icon,
                  hook: setOpen,
                  title: type === "note" ? "Note " + id : "Image " + id,
                  isOpen: isOpen,
                }}
              >
                {jsx}
              </DialogWrapper>
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
