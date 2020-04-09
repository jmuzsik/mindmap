import React from "react";
import { Layout, Card } from "antd";

export default function NonexistentToken() {
  return (
    <Layout className="auth recover-success">
      <Card title="Expired Link">
        <p>
          This link has expired. Please check your inbox for the most recent
          link.
        </p>
      </Card>
    </Layout>
  );
}
