import React from "react";
import "./css/NavBar.css";

function NavBar() {
  return (
    <nav id="navbar" className="navbar">
      <div id="nav-content" className="nav-content">

        {/* Left — Logo */}
        <div id="nav-logo" className="nav-logo">TravelWU</div>

        {/* Center — Navigation Items */}
        <ul id="navbar-list" className="navbar-list">
          <li id="nav-home" className="nav-item">Home</li>
          <li id="nav-hotels" className="nav-item">Hotels</li>
          <li id="nav-flights" className="nav-item">Flights</li>
          <li id="nav-carrental" className="nav-item">CarRental</li>
          <li id="nav-attractions" className="nav-item">Attractions</li>
          <li id="nav-fulltrip" className="nav-item">Full Trip</li>
        </ul>

        {/* Right — Sign In */}
        <button id="nav-signin" className="signin-btn">Sign In</button>

      </div>
    </nav>
  );
}

export default NavBar;
