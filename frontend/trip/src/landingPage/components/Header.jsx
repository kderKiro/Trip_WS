import '../styles/header&signUp.css'
import React, { useState } from 'react'
import titIcon from '../images/title-icon.svg'
import SignUpForm from './SignUpForm'
import { Route, Routes } from 'react-router-dom'

import Home from './HomePage'
import Explore from './Explore/Explore'
import AboutUs from './AboutUs'
import Feedback from './Feedback/Feedback'
import Footer from './Footer'
import Flights from '../../pages/Flights'
import Hotels from '../../pages/Hotels'
import FullTrip from '../../pages/FullTrip'
import CarRental from '../../moha-pages/pages/CarRental'
import Attraction from '../../moha-pages/pages/Attractions'


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink } from 'react-router-dom'



export default function Header({ setUserInfo, userInfo }) {
  const [formAppear, setFormAppear] = React.useState(false);
  const [hiddenMenu, setHideMenu] = React.useState(true);
  const [LoggedIn, SetLoggedIn] = useState(false);
  const [active, setActive] = useState('');

  userInfo = userInfo || { UserName: 'Default', UserType: 'Agency' };

  React.useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        if (typeof userInfo !== 'undefined' && userInfo && userInfo.UserName && userInfo.UserName !== 'Default') {
          SetLoggedIn(true);
          if (typeof setUserInfo === 'function') setUserInfo(userInfo);
          return;
        }

        const resp = await fetch('https://full-trip.onrender.com/Frosty/Routes', {
          method: 'GET',
          credentials: 'include'
        });

        if (!resp.ok) {
          throw new Error('Server error while checking session');
        }

        const body = await resp.json();
        if (cancelled) return;

        if (body.logged_in && body.user) {
          const u = body.user;
          const uObj = { UserName: u.first_name || u.email, UserType: u.role || 'user', ...u };
          localStorage.setItem('FT_user', JSON.stringify(uObj));
          SetLoggedIn(true);
          if (typeof setUserInfo === 'function') setUserInfo(uObj);
        } else {
          localStorage.removeItem('FT_user');
          SetLoggedIn(false);
          if (typeof setUserInfo === 'function') setUserInfo({ UserName: 'Default', UserType: 'Agency' });
        }
      } catch (e) {
        try {
          const s = localStorage.getItem('FT_user');
          if (s) {
            const user = JSON.parse(s);
            SetLoggedIn(true);
            if (typeof setUserInfo === 'function') setUserInfo(user);
          } else {
            SetLoggedIn(false);
          }
        } catch (ex) {
          SetLoggedIn(false);
        }
      }
    }

    checkSession();

    return () => { cancelled = true; };
  }, [userInfo]);

  async function handleLogout() {
    localStorage.removeItem('FT_user');
    try {
      await fetch('https://full-trip.onrender.com/Kad_Be/routes/logout.php', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.warn('Server-side logout failed:', err);
    }

    SetLoggedIn(false);
    if (typeof setUserInfo === 'function') setUserInfo({ UserName: 'Default', UserType: 'Agency' });
  }



  const [navBarContent] = React.useState(['Home', 'Hotels', 'Flights', 'Car Rental', 'Attraction', 'Tours']);
  const navContent = navBarContent.map(navContent => (
    <NavLink
      to={`/${navContent}`}>
      <li
        className={active === navContent ? 'active' : ''}
        onClick={() => setActive(navContent)
        }
        key={navContent}>
        {navContent}</li>
    </NavLink>
  ))

  const hideMenu = () => {
    setHideMenu(true);
  }

  function showMenu() {
    setHideMenu(false);
  }

  function showForm() {
    setFormAppear(true);
  }

  React.useEffect(() => {
    const home = document.querySelector('.main-page');
    const header = document.querySelector('header');
    if (formAppear) {

      if (home) home.classList.add('dimmed');
      if (header) header.classList.add('dimmed');

      document.body.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      if (home) home.classList.remove('dimmed');
      if (header) header.classList.remove('dimmed');
    }
  }, [formAppear]);


  return (
    <>
      <div className='header-div'>
        <header>
          <div className="slogo">
            <img src={titIcon}></img>
            <h1>TravelWUs</h1>
          </div>
          <ul
            id={hiddenMenu ? 'hideMin' : 'showMin'}
            className='navBar'>
            <li><button onClick={hideMenu} name='return'><i class='bx  bx-x'  ></i> </button></li>
            {navContent}</ul>
          <div className='SignLogIn'>

            {LoggedIn ?
              <>
                <Link to={'/Profile'} className='PrimrayB'><FontAwesomeIcon size='xl' icon={faUser}></FontAwesomeIcon></Link>
                <button onClick={handleLogout} className='secondaryB'>Logout</button>
              </> :
              <button onClick={showForm}>Log In</button>
            }

          </div>
          <div className='menu'>
            <i
              class='bxr  bx-menu'
              onClick={showMenu}></i>
          </div>
        </header >
        {
          formAppear && <SignUpForm
            formAppearing={setFormAppear} SetLoggedIn={SetLoggedIn} SetUserInfo={setUserInfo} />
        }
      </div >

      <Routes>
        <Route path="Home" element={
          <>
            <Home />
            <Explore />
            <AboutUs />
            <Feedback />
            <Footer />
          </>
        } />
        <Route path="Flights" element={<Flights />} />
        <Route path="Car Rental" element={<CarRental />} />
        <Route path="Hotels" element={<Hotels />} />
        <Route path="Tours" element={<FullTrip />} />
        <Route path='Attraction' element={<Attraction />}></Route>
        <Route path='Car Rental' element={<CarRental />}></Route>
      </Routes>
    </>



  )
}
