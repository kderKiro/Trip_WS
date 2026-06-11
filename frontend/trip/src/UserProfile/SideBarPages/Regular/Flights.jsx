import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture, faClock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./Styles/Flights.css";

// Default Flight Icon image (optional, if you want an image for flights)
const DEFAULT_FLIGHT_IMAGE = "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&w=1080";

/* ================= Flight Card ================= */
function FlightCard({ Flight, onCancel }) {
  const departDate = Flight.DepartDate || "-";
  const arrivalDate = Flight.ArrivalDate || "-";
  const departTime = Flight.DepartTime || "-";
  const arrivalTime = Flight.ArrivalTime || "-";
  const stops = Flight.Stops ?? 0;
  const price = Flight.Price || "0$";

  return (
    <div className="Flights Section" style={{ backgroundColor: "white" }}>
      <h3 style={{ borderBottom: "2px solid black", paddingBottom: "10px" }}>
        {departDate} - {arrivalDate}
      </h3>

      <div className="FlightCard">

        <div className="Icon_Flight_Details">
          <FontAwesomeIcon icon={faPlaneDeparture} className="FlightIcon" />
          <div className="Airline">
            <h3>{Flight.Airline}</h3>
            <p>{Flight.AirPlane_Id}</p>
          </div>
        </div>

        <div className="FlightTimeDescription">
          <div className="Location_Description">
            <div>
              <h4>{Flight.DepartContry}</h4>
              <p className="Airport">{Flight.DepartAirport}</p>
            </div>
            <p>{departTime}</p>
          </div>

          <div className="Location_Description">
            <div className="Duration">
              <FontAwesomeIcon icon={faClock} className="Icon" />
              <p>{Flight.Duration}</p>
            </div>
            <hr />
            <div className="Stops">
              {stops === 0 ? "Non-Stop" : stops === 1 ? "1 Stop" : stops + " Stops"}
            </div>
          </div>

          <hr />
          <div className="FullCircle1"></div>
          <div className="EmptyCircle"></div>
          <div className="FullCircle2"></div>

          <div className="Location_Description">
            <div>
              <h4>{Flight.DestinationCountry}</h4>
              <p className="Airport">{Flight.DestinationAirport}</p>
            </div>
            <p>{arrivalTime}</p>
          </div>
        </div>

        <div className="FlightResInfo FlexH_spaceBetween">
          <div className="Price">
            <h3>Price</h3>
            <p>{price}</p>
          </div>
          <div className="Class">
            <h3>Class</h3>
            <div className={Flight.Class}>{Flight.Class}</div>
          </div>
          <div className="Status">
            <h3>Status</h3>
            <div className={Flight.Status}>{Flight.Status}</div>
          </div>
        </div>
      </div>

      {Flight.Status === "Active" && (
        <button className="SecondaryB RemoveCard" onClick={() => onCancel(Flight.freservation_id)}>
          Cancel Flight
        </button>
      )}
    </div>
  );
}

/* ================= Flights Page ================= */
function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("FT_user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        const uid = userObj.user_id || userObj.id;
        setUserId(uid);
        fetchFlights(uid);
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFlights = async (uid) => {
    try {
      const response = await fetch(
        `http://localhost/FULL_TRIP_WS/backend/oussama/flights/get_my_reservations.php?user_id=${uid}`
      );
      const data = await response.json();
      if (Array.isArray(data)) setFlights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm("Cancel this flight reservation?")) return;

    try {
      const response = await fetch(
        "http://localhost/FULL_TRIP_WS/backend/oussama/flights/cancel_reservation.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reservation_id: reservationId }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setFlights(prev => prev.filter(f => f.freservation_id !== reservationId));
      } else {
        alert(result.error || "Cancel failed");
      }
    } catch {
      alert("Connection error");
    }
  };

  if (loading) {
    return (
      <div className="S_Container Section" style={{ textAlign: "center" }}>
        <h2>
          <FontAwesomeIcon icon={faSpinner} spin /> Loading...
        </h2>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="S_Container Section" style={{ textAlign: "center" }}>
        <h2>Please log in to view your flights.</h2>
      </div>
    );
  }

  return (
    <div className="S_Container Section">
      <div className="SecHeader">
        <h1>My Flights</h1>
        <p>Manage your Current Flights</p>
      </div>

      {flights.length > 0 ? (
        flights.map(flight => (
          <FlightCard key={flight.freservation_id} Flight={flight} onCancel={handleCancel} />
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h3>No reservations found.</h3>
        </div>
      )}
    </div>
  );
}

export default Flights;
