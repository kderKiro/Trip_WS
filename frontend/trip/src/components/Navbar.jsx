import { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/navbar.css';
import LOGO from '../pages/pics/pic1.png';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <img src={LOGO} alt="ourlogo" />
                <h2>TravelWUs</h2>
            </div>

            {/* Burger Button */}
            <button
                className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
                onClick={toggleMenu}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Links */}
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/hotels" onClick={closeMenu}>Hotels</Link></li>
                <li><Link to="/flights" onClick={closeMenu}>Flights</Link></li>
                <li><Link to="/carrental" onClick={closeMenu}>Car Rental</Link></li>
                <li><Link to="/attractions" onClick={closeMenu}>Attractions</Link></li>
                <li><Link to="/fulltrip" onClick={closeMenu}>Full Trip</Link></li>
            </ul>

            {/* Auth Buttons */}
            <div className="buttons">
                <Link to="/signin"><button>Sign in</button></Link>
                <Link to="/signup"><button>Sign up</button></Link>
            </div>

            {/* Dark overlay */}
            {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
        </nav>
    );
}

export default Navbar;

