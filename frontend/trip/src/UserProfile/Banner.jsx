import "./Banner.css";
import "../index.css";
import sidePlane from "./SVG/Flight.svg";
import {
  faPlaneUp,
  faSuitcase,
  faHotel,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function Banner({ Username = "User" }) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimation] = useState(false);
  const Icons = [faCar, faHotel, faPlaneUp, faSuitcase];

  async function Shuffle() {
    for (let i = 0; i < Icons.length + 1; i++) {
      setIndex((prev) => (prev + 1) % Icons.length);
      await sleep(100);
      setAnimation(true);
    }
    await sleep(2000);
    setAnimation(false);
  }

  useEffect(() => {
    Shuffle(); //A call before the interval
    const timer = setInterval(() => {
      Shuffle();
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="Banner">
        <div className="WMessage">
          <FontAwesomeIcon
            className="BannerIc"
            icon={Icons[index]}
            style={{
              animation: animate ? "Pop 2s ease-in-out" : "",
            }}
          ></FontAwesomeIcon>
          <div>
            <h1>
              Hello <span>{Username}!</span>
            </h1>
            <p>Everything You need at one Place.</p>
            <p>Your next destination is just a click away.</p>
            <br />
          </div>
        </div>
        <img src={sidePlane} alt="Plane" className="sidePlane"></img>
      </div>
    </>
  );
}

export default Banner;
