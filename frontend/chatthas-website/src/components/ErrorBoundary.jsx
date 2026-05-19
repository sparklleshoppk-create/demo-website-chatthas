import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-primary-black text-cream flex items-center justify-center p-8">
          <div className="max-w-lg text-center">
            <h1 className="font-display text-3xl text-gold-500 mb-4">Something went wrong</h1>
            <p className="text-cream/60 font-body mb-6">{this.state.error.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gold-500 text-primary-black font-semibold rounded-sm"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
