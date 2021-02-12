import React from "react";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { setItem } from "../../../../Utils/localStorage";

function aOrB(a, b, cond) {
  return cond ? b : a;
}

export default function Settings({
  state: { settings, names },
  hooks: { setSettings },
}) {
  const { theme, view } = settings;

  return (
    <Popover2
      portalClassName={theme}
      content={
        <ButtonGroup vertical large>
          <Button
            icon={aOrB("move", "globe-network", view === "dnd")}
            text={names.view}
            onClick={() => {
              setItem("view");
              setSettings({
                ...settings,
                view: view === 'dnd' ? 'network' : 'dnd',
              });
            }}
          />
          <Button
            icon={aOrB("moon", "flash", theme === "dark")}
            text={names.theme}
            onClick={() => {
              setItem("theme");
              setSettings({
                ...settings,
                theme: theme === 'light' ? 'bp3-dark' : 'light',
              });
            }}
          />
        </ButtonGroup>
      }
    >
      <Button icon="user" text={names.settings} />
    </Popover2>
  );
}
