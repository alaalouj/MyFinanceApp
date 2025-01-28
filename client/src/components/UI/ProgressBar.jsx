// client/src/components/UI/ProgressBar.jsx

import React from "react";

const ProgressBar = ({ progress, milestones = [], goalAmount }) => {
  const cappedProgress = Math.min(Math.max(progress, 0), 100); // Limiter entre 0 et 100

  const getColor = () => {
    if (cappedProgress < 30) return "#dc3545"; // Rouge
    if (cappedProgress < 70) return "#ffc107"; // Jaune
    return "#28a745"; // Vert
  };

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid #ccc",
        borderRadius: "5px",
        width: "100%",
        height: "30px",
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
      {/* Affichage des marqueurs pour les milestones */}
      {milestones.map((milestone) => {
        const milestonePercentage = goalAmount
          ? Math.min((milestone.amount / goalAmount) * 100, 100)
          : 0;
        return (
          <div
            key={milestone._id}
            style={{
              position: "absolute",
              left: `${milestonePercentage}%`,
              top: "0",
              transform: "translateX(-50%)",
              width: "2px",
              height: "100%",
              backgroundColor: "#000",
            }}
            title={`${milestone.name} (${milestone.amount} €)`}
          >
            {/* Ajouter un cercle ou un label */}
            <div
              style={{
                position: "absolute",
                top: "-5px",
                left: "-5px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#000",
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
