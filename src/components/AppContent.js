import React from "react";
import { Grid } from "semantic-ui-react";

export default function AppContent({ menuWidth, children }) {
  return (
    <div
      style={{
        width: "100%",
        paddingTop: "4rem",
        paddingLeft: `${menuWidth}rem`,
      }}
    >
      <div style={{ marginRight: "1rem", marginLeft: "1rem" }}>
        {children}
      </div>
    </div>
  );
}
