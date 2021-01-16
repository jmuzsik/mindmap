import React from "react";
import { Intent, Callout } from "@blueprintjs/core";

export const createCallout = () => (
  <Callout intent={Intent.WARNING} title="You have no subject!">
    Please create a subject by clicking the Create Subject button above!
  </Callout>
);

export function goTo(place, goTo) {
  return goTo.push(place);
}
