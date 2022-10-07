import Avatar from "../assets/avatars/SVG/Asset9.svg";

const HeaderDropdown = (props) => {

  return (
    <div className="dropdown text-end">
      <a href="https://superkabayan.herokuapp.com/" className="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <img src={Avatar} alt="mdo" width="32" height="32" className="rounded-circle" />
      </a>

      <ul className="dropdown-menu text-small">
        <li><a className="dropdown-item" href="https://superkabayan.herokuapp.com/profile/">Profile</a></li>
        <li><a className="dropdown-item" href="https://superkabayan.herokuapp.com/settings/">Settings</a></li>
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item" onClick={() => props.logOut(localStorage.removeItem("token"), false)}>Sign out</button></li>
      </ul>
    </div>
  );
};

export default HeaderDropdown;
