import { useState } from "react";

import { Link, Outlet } from "react-router-dom";

import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <Link to={"/"}>CleanCloud</Link>
          </span>
            <Link to="/Einstellungen">Einstellungen</Link>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    
      <footer>
        <Link to="/Impressum">Impressum</Link>
      </footer>
    </>
  );
}

export default App;
