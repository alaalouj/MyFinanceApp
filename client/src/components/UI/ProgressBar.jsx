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
    <div style={styles.container}>
      <div
        style={{
          ...styles.progress,
          width: `${cappedProgress}%`,
          backgroundColor: getColor(),
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
              ...styles.milestone,
              left: `${milestonePercentage}%`,
            }}
            title={`${milestone.name} (${milestone.amount} €)`}
          >
            <div
              style={{
                ...styles.milestoneDot,
                backgroundColor: milestone.achieved ? "#28a745" : "#dc3545",
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
    height: "20px",
    marginTop: "5px",
    backgroundColor: "#e9ecef",
  },
  progress: {
    height: "100%",
    borderRadius: "5px",
    transition: "width 0.3s ease-in-out",
  },
  milestone: {
    position: "absolute",
    top: "0",
    transform: "translateX(-50%)",
    width: "2px",
    height: "100%",
    backgroundColor: "#000",
  },
  milestoneDot: {
    position: "absolute",
    top: "-5px",
    left: "-5px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
};

export default ProgressBar;
