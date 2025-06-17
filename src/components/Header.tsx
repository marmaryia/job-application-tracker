import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <h1>TRACTION</h1>
      <Link to="/register">Register</Link>
      <Link to="/login">Log in</Link>
    </header>
  );
}

export default Header;
