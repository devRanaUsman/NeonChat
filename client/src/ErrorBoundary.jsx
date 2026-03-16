import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#ff5555', backgroundColor: '#0A0F1E', height: '100vh', width: '100vw', zIndex: 9999, position: 'absolute', top: 0, left: 0, overflow: 'auto', fontFamily: 'monospace' }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>Application Crash Detected</h2>
          <div style={{ backgroundColor: 'rgba(255,0,0,0.1)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{this.state.error && this.state.error.toString()}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', color: '#ccc' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}
