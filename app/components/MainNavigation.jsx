import { NavLink } from "@remix-run/react";
export default function MainNavigation({ user }) {
  return (
    <div>
      <nav id="main-navigation">
        <ul>
          <li className="nav-item">
            <NavLink to="/myNotes" className="mynote">
              myNotes
            </NavLink>
          </li>
          {user ? (
            <li>
              <form action="/logout" method="post" className="logout">
                <button type="submit" className="btn">
                  Logout{" " + user.username}
                </button>
              </form>
            </li>
          ) : (
            <li className="nav-item">
              <NavLink to="/login" className="login">
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
