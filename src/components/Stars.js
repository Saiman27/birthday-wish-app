import React from "react";
import "./Stars.css";

function Stars() {
  return (
    <div className="stars">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="star"></div>
      ))}
    </div>
  );
}

export default Stars;
