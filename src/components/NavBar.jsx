import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <svg
          className="pats-icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 2L3 20h18L12 2z" />
        </svg>

        <span className="nav-logo">PATS</span>
      </div>

      <div className="nav-right">
        <Link className="nav-link" to="/">Kits</Link>
        <Link className="nav-link" to="/assemblies">Assemblies</Link>
        <Link className="nav-link" to="/movements">Movements</Link>
        <Link className="nav-link" to="/valves">Valves</Link>
        <Link className="nav-link" to="/test-chambers">Test Chambers</Link>
        <Link className="nav-link" to="/test-events">Test Events</Link>
        <Link className="nav-link" to="/work-orders">Work Orders</Link>
      </div>
    </nav>
  );
}
