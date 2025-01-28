// client/src/components/ErrorBoundary.jsx

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour afficher le fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez enregistrer l'erreur dans un service de rapport d'erreurs
    console.error("Erreur capturée par ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI de repli en cas d'erreur
      return <h3>Quelque chose s'est mal passé.</h3>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
