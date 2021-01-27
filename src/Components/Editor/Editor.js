import React from "react";
import { Editor, RichUtils } from "draft-js";
import { ButtonGroup, Button, Divider } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import "./Editor.css";

export default class RichEditor extends React.Component {
  state = { alignment: "left" };
  onChange = (editorState) => {
    this.props.onChange(editorState);
  };

  focus = () => this.editor.focus();

  setEditorRef = (ref) => (this.editor = ref);

  componentDidMount() {
    this.editor.focus();
  }

  handleKeyCommand = (command) => {
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  };
  setAlignment = (alignment) => this.setState({ alignment });
  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.props.editorState, blockType));
  };
  toggleInlineStyle = (inlineStyle) => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle)
    );
  };
  render() {
    const { editorState } = this.props;
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " RichEditor-hidePlaceholder";
      }
    }
    return (
      <div
        className={`RichEditor-root${this.props.minimal ? " minimal" : ""}`}
        onClick={this.focus}
        id={this.props.id || ""}
      >
        {this.props.controls && (
          <ButtonGroup minimal className="controls-container">
            <Controls
              editorState={editorState}
              onToggle={this.toggleBlockType}
              name="Block"
              styles={BLOCK_TYPES}
            />
            <Divider />
            <Controls
              editorState={editorState}
              onToggle={this.setAlignment}
              name="Block"
              styles={ALIGNMENT_TYPES}
            />
            <Divider />
            <Controls
              editorState={editorState}
              onToggle={this.toggleInlineStyle}
              name="Misc"
              styles={INLINE_STYLES}
            />
          </ButtonGroup>
        )}
        <div
          className={className}
          style={{ width: this.props.width + 30 }}
        >
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            textAlignment={this.state.alignment}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref={this.setEditorRef}
            spellCheck={true}
            readOnly={this.props.readOnly}
          />
        </div>
      </div>
    );
  }
}

const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};
function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }

    return (
      <Button
        className={className}
        icon={this.props.label}
        onMouseDown={this.onToggle}
      />
    );
  }
}
const BLOCK_TYPES = [
  { label: IconNames.HEADER_ONE, style: "header-one" },
  { label: IconNames.HEADER_TWO, style: "header-two" },
  { label: IconNames.CITATION, style: "blockquote" },
  { label: IconNames.LIST, style: "unordered-list-item" },
  { label: IconNames.NUMBERED_LIST, style: "ordered-list-item" },
  { label: IconNames.CODE, style: "code-block" },
];
const ALIGNMENT_TYPES = [
  { label: IconNames.ALIGN_LEFT, style: "left" },
  { label: IconNames.ALIGN_CENTER, style: "center" },
  { label: IconNames.ALIGN_RIGHT, style: "right" },
  { label: IconNames.ALIGN_JUSTIFY, style: "justify" },
];
var INLINE_STYLES = [
  { label: IconNames.BOLD, style: "BOLD" },
  { label: IconNames.ITALIC, style: "ITALIC" },
  { label: IconNames.UNDERLINE, style: "UNDERLINE" },
];
function Controls(props) {
  const { editorState, onToggle, name, styles } = props;
  let selection, blockType, currentStyle;
  if (name === "Block") {
    selection = editorState.getSelection();
    blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
  } else {
    currentStyle = props.editorState.getCurrentInlineStyle();
  }
  return (
    <ButtonGroup minimal className="RichEditor-controls">
      {styles.map((type) => (
        <StyleButton
          key={type.label}
          active={
            name === "Block"
              ? type.style === blockType
              : currentStyle?.has(type.style)
          }
          label={type.label}
          onToggle={onToggle}
          style={type.style}
          icon={type.icon}
        />
      ))}
    </ButtonGroup>
  );
}
