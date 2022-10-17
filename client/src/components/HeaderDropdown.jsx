import Avatar from "../assets/avatars/SVG/Asset9.svg";

const HeaderDropdown = (props) => {

  return (
    <div className="dropdown-center">
      <a href="/" className="d-block link-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <img src={Avatar} alt="mdo" width="32" height="32" className="rounded-circle" />
      </a>
      <ul className="dropdown-menu mt-3">
        <li><a className="dropdown-item" href="http://localhost:3000/profile/">Profile</a></li>
        <li><a className="dropdown-item" href="http://localhost:3000/settings/">Settings</a></li>
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item" onClick={() => props.logOut(localStorage.removeItem("token"), false)}>Sign out</button></li>
      </ul>
    </div>
  );
};

export default HeaderDropdown;
