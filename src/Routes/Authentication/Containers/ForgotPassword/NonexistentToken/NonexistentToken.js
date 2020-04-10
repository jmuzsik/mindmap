import React from "react";
import { Card, H4, Divider, Callout, Intent } from "@blueprintjs/core";

export default function NonexistentToken() {
  return (
    <section className="auth recover-success layout">
      <Card>
        <H4>Expired Token</H4>
        <Divider />
        <div className="card-body">
          <Callout intent={Intent.PRIMARY} icon="info-sign">
            This link has expired. Please check your inbox for the most recent
            link.
          </Callout>
        </div>
      </Card>
    </section>
  );
}
