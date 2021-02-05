import React from "react";

export function CollapseContent({ names }) {
  return (
    <React.Fragment>
      <h2>Simply:</h2>
      <ol>
        <li>{names.subject}</li>
        <ol>
          <li>{names.content}</li>
          <ol>
            <li>{names.content}</li>
            <li>max of 8</li>
          </ol>
          <li>max of 8</li>
        </ol>
        <li>ad infinitum</li>
      </ol>
      <h3>What's what?</h3>
      <ol>
        <li>{names.subject} - Rich text</li>
        <li>{names.content} - Rich text with images</li>
        <li>{names.names} - Customised the words on the page</li>
        <li>User Settings</li>
        <ol>
          <li>View - Network or DnD</li>
          <li>Theme - Dark or light</li>
          <li>Editor - Toolbar on top or on double click</li>
        </ol>
      </ol>
      <h3>What is the purpose of this?</h3>
      <p>A unique way to make something.</p>
      <h3>Data</h3>
      <p>It lives on your browser, there is no database.</p>
      <h3>What's the editor below this for?</h3>
      <p>Whatever you like.</p>
    </React.Fragment>
  );
}
