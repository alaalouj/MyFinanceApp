// client/src/pages/EnvelopesPage.jsx

import React from "react";
import Envelopes from "../components/Envelopes/Envelopes";

const EnvelopesPage = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Enveloppes Budgétaires</h2>
      <Envelopes />
    </div>
  );
};

export default EnvelopesPage;
