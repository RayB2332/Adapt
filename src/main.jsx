import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:40,fontFamily:"sans-serif",maxWidth:600,margin:"40px auto"}}>
          <h2 style={{color:"#DC2626"}}>Something went wrong</h2>
          <pre style={{background:"#FEF2F2",padding:16,borderRadius:8,fontSize:12,overflow:"auto",whiteSpace:"pre-wrap"}}>
            {this.state.error?.toString()}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
