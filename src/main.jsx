import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, showDetail: false }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error("ADAPT crash:", e, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#312E81,#4F46E5,#7C3AED)",
          display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif",padding:24}}>
          <div style={{textAlign:"center",maxWidth:340}}>
            <div style={{fontSize:64,marginBottom:14}}>🛸</div>
            <h2 style={{color:"#fff",fontSize:24,fontWeight:900,marginBottom:8}}>Oops — a space bump!</h2>
            <p style={{color:"rgba(255,255,255,0.85)",fontSize:15,fontWeight:700,lineHeight:1.6,marginBottom:22}}>
              Something went wrong, but your stars and XP are safe. Tap below to jump back in!
            </p>
            <button onClick={()=>window.location.reload()}
              style={{background:"#fff",color:"#4F46E5",border:"none",borderRadius:18,padding:"16px 38px",
                fontSize:17,fontWeight:900,cursor:"pointer",fontFamily:"inherit",
                boxShadow:"0 6px 0 rgba(0,0,0,0.25)"}}>
              🚀 Blast off again
            </button>
            <p onClick={()=>this.setState(s=>({showDetail:!s.showDetail}))}
              style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:700,marginTop:20,cursor:"pointer"}}>
              {this.state.showDetail ? "Hide" : "Show"} details for grown-ups
            </p>
            {this.state.showDetail && (
              <pre style={{background:"rgba(0,0,0,0.3)",color:"rgba(255,255,255,0.8)",padding:12,borderRadius:10,
                fontSize:10,overflow:"auto",whiteSpace:"pre-wrap",textAlign:"left",maxHeight:160,marginTop:8}}>
                {this.state.error?.toString()}{"\n"}{this.state.error?.stack?.slice(0,600)}
              </pre>
            )}
          </div>
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
