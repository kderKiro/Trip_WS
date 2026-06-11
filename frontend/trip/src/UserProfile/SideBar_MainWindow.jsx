import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense, lazy } from "react";

import {
  faBars,
  faCaretDown,
  faPlane,
  faHotel,
  faCarSide,
  faCompass,
  faRightFromBracket,
  faGear,
  faChartDiagram,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./SideBar._MainWindow.css";
import { Component, useContext, useEffect, useState } from "react";
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
//Regular-------------------------------------
// Regular Pages
const Flights = lazy(() => import('./SideBarPages/Regular/Flights'));
const Hotels = lazy(() => import('./SideBarPages/Regular/Hotels'));
const CarRentals = lazy(() => import('./SideBarPages/Regular/CarRentals'));
const Tours = lazy(() => import('./SideBarPages/Regular/Tours'));

// Agency Pages
const AgencyOverview = lazy(() => import('./SideBarPages/Agency/AgencyOverview'));
const AgencyTours = lazy(() => import('./SideBarPages/Agency/AgencyTours'));
const Ag_Costumers = lazy(() => import('./SideBarPages/Agency/AgencyCostumers'));

// Mutual
const Settings = lazy(() => import('./SideBarPages/Regular/Settings'));
import ProfileHeader from "./ProfileHeader";



import UserContext from "./UserContext";






function SideBar_MainWindow() {

  const [FlipAn, setFlipAn] = useState(false);
  const [rotateIndex, setRotateIndex] = useState(null);
  const [DashBoard, setDashBoard] = useState(true);
  const UserInfo = useContext(UserContext);



  //SideBar Items:


  const BottomMenu = [
    { Section: "Settings", icon: faGear, Component: Settings },
    { Section: "Logout", icon: faRightFromBracket, Component: Settings },

  ];
  const RegUserSideBar = [

    { Section: "Flights", icon: faPlane, Component: Flights },
    { Section: "Hotels", icon: faHotel, Component: Hotels },
    { Section: "Car Rentals", icon: faCarSide, Component: CarRentals },
    { Section: "Tours", icon: faCompass, Component: Tours },
  ];
  const AgencySideBar = [

    { Section: "Overview", icon: faChartDiagram, Component: AgencyOverview },
    { Section: "Agency Tours", icon: faCompass, Component: AgencyTours },
    { Section: "Costumers", icon: faUsers, Component: Ag_Costumers }
  ]

  const SideBar = (UserInfo.U_type === "agency") ? AgencySideBar : RegUserSideBar;

  //SideBar Functions

  function ToogleDashBoard() {
    FliPButton();
    setDashBoard(!DashBoard);

  }

  function FliPButton() {
    setFlipAn(true);
    setTimeout(() => {
      setFlipAn(false);
    }, 500);
  }



  return (
    <>
      <div className={DashBoard ? "Container" : "Container Closed"}>
        <div className={DashBoard ? "SideBar" : "SideBar Closed"}>
          <div className="MenuHead">

            <h2 style={{ width: DashBoard ? "100%" : "0", overflow: "hidden", transition: "0.5s" }}>Dashboard</h2>
            <button
              className="SButton ToogleMenu"
              onClick={ToogleDashBoard}
              style={{ animation: FlipAn ? "Flip 0.5s ease-in-out" : "" }}
            >
              <FontAwesomeIcon icon={faBars} size="xl" />
            </button>
          </div>


          {/* SideBar */}
          <div className="Menu">
            <ul style={{ padding: DashBoard ? "15px" : "15px 10px" }}>
              {SideBar.map((item, index) => (
                <li key={index}  >
                  <NavLink className="MainLink" to={`/Profile/${item.Section}`} >
                    <FontAwesomeIcon icon={item.icon} className="Icon" style={{ fontSize: DashBoard ? "1.2em" : "1.3em" }}></FontAwesomeIcon>
                    <p style={{ display: DashBoard ? "" : "none" }}>{item.Section}</p>

                    {item.hasSubM && (
                      <button
                        onClick={() => {
                          setRotateIndex(rotateIndex === index ? null : index);
                        }

                        }
                        className={`SButton SubMenuToogle ${rotateIndex === index ? "Rotate" : ""
                          }`}
                      >
                        <FontAwesomeIcon icon={faCaretDown} />
                      </button>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
            {/* Bottom List ------------------------------------------------------------------------------------- */}
            <ul className="BottomMenu" style={{ padding: DashBoard ? "15px" : "15px 10px" }}>
              <li>
                <NavLink to={`/Profile/${BottomMenu[0].Section}`} className="MainLink">
                  <FontAwesomeIcon icon={BottomMenu[0].icon} className="Icon" style={{ fontSize: DashBoard ? "1.2em" : "1.3em" }}></FontAwesomeIcon>
                  <p style={{ display: DashBoard ? "" : "none" }}>{BottomMenu[0].Section}</p>
                </NavLink>

              </li>


            </ul>
          </div>
        </div>
        {/*Main Window -------------------------------------------------------------------------------------------------*/}
        <div className="MainWindow">
          <ProfileHeader Username={UserInfo.Username



          } U_type={UserInfo.U_type}></ProfileHeader>
          <div style={{ padding: "20px" }}>
            <Routes>
              <Route index element={<Navigate to={(UserInfo.U_type === "agency") ? "Overview" : "Flights"} replace />} />

              {
                SideBar.map((item, index) => (

                  <Route key={index} path={`${item.Section}/*`} element={<Suspense fallback={<h2 style={{textAlign:"center"}}>Loading ...</h2>}><item.Component /></Suspense>} ></Route>

                ))

              }
              <Route path="Settings/*" element={<Suspense fallback={<h2 style={{textAlign:"center"}}>Loading...</h2>} ><Settings /></Suspense>}></Route>
            </Routes>

          </div>
        </div>
      </div>
    </>
  );
}
export default SideBar_MainWindow;

