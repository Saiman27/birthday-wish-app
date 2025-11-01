import React from "react";
import cakeImg from "../assets/img.png";
import "./Cake.css";

function Cake({ onClick }) {
  return (
    <img
      src={cakeImg}
      alt="Birthday Cake"
      className="cake-image"
      onClick={onClick}
       draggable="false"
    />
  );
}

export default Cake;
