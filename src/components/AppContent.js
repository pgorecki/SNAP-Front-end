import React, { useContext } from "react";
import { AppContext } from '../AppStore';

export default function AppContent({ menuWidth, children }) {
  const [{ theme }] = useContext(AppContext);
  return (
    <div
      style={{
        width: "100%",
        paddingTop: "4rem",
        paddingLeft: `${theme.menuWidth}rem`,
      }}
    >
      <div style={{ marginRight: "1rem", marginLeft: "1rem" }}>
        {children}
      </div>
    </div>
  );
}
