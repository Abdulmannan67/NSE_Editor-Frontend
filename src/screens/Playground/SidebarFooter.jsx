import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SidebarFooter = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault(); // Prevent default link behavior
    localStorage.removeItem('token')
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="sidebar-footer" style={footerStyle}>
      <div style={userInfoStyle}>
        <span style={onlineDotStyle}></span>
        <span>{username}</span>
      </div>
      <LogoutButton href="#" onClick={handleLogout}>
        <i className="fa fa-power-off"></i>
      </LogoutButton>

    </div>
  );
};

const footerStyle = {
    position: "sticky",
    bottom: 0,
    width: "100%", // Ensures full width of the sidebar
    padding: "10px",
    backgroundColor: "#2c2c2c",
    color: "white",
    borderTop: "2px solid #3e3ab4",
    borderBottom: "2px solid transparent", // Make border transparent
    borderImage: "linear-gradient(90deg, rgba(62, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)",
    borderImageSlice: 1, // Ensures full gradient covers the border
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

const userInfoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const onlineDotStyle = {
  width: "10px",
  height: "10px",
  backgroundColor: "green",
  borderRadius: "50%",
};

const LogoutButton = styled.a`
  position: relative;
  font-size: 20px;
  color: white;
  text-decoration: none;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: red; /* Highlight effect */
  }

  &:hover::after {
  margin-right: 30px;
    content: "Logout";
    position: absolute;
    bottom: 45px; /* Adjust position */
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 10px;
    border-radius: 5px;
    font-size: 11px;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  &::after {
    opacity: 0;
  }
`;


export default SidebarFooter;