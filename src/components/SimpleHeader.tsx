import React from "react";
import { Link } from "react-router-dom";
import moabomLogo from "../assets/moabom.svg";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="simple-header-container">
        <Link to="/" className="logo-container">
          <div className="logo-icon">
            <img src={moabomLogo} width="32" height="32" />
          </div>
          <h1 className="logo-text">모아봄</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
