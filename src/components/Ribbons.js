import React from "react";
import "./Ribbons.css";

function Ribbons() {
  return (
    <div className="ribbons">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="ribbon"></div>
      ))}
    </div>
  );
}

export default Ribbons;
