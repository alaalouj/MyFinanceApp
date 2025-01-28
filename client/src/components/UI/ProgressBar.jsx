// client/src/components/UI/ProgressBar.jsx

import React from "react";

const ProgressBar = ({ progress }) => {
  const cappedProgress = Math.min(Math.max(progress, 0), 100); // Limiter entre 0 et 100

  const getColor = () => {
    if (cappedProgress < 50) return "#28a745"; // Vert
    if (cappedProgress < 80) return "#ffc107"; // Jaune
    return "#dc3545"; // Rouge
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "5px",
        width: "100%",
        height: "20px",
        marginTop: "5px",
      }}
    >
      <div
        style={{
          width: `${cappedProgress}%`,
          backgroundColor: getColor(),
          height: "100%",
          borderRadius: "5px",
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
