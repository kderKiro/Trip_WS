import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faClock, faMapLocation } from "@fortawesome/free-solid-svg-icons";
import "./Styles/Hotels.css";



/* ================= Hotel Card ================= */

function HotelCard({ Hotel, onCancel }) {

    return (
        <div className="Section" style={{ backgroundColor: "white", marginBottom: "20px" }}>
            <div className="Hotel">
                <img
                    src={Hotel.h_image_url || "https://images.unsplash.com/photo-1501117716987-c8e9c1a0b1c3?crop=entropy&cs=tinysrgb&fit=max&w=1080"}
                    alt={Hotel.h_name}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501117716987-c8e9c1a0b1c3?crop=entropy&cs=tinysrgb&fit=max&w=1080" }}    
                />

                <div className="HotelDetails">
                    <h2>{Hotel.h_name}</h2>
                    <p className="Location">{Hotel.h_location}</p>

                    <p className="Price">
                        Price/Night: <span>{Hotel.price} DA</span>
                    </p>
                    <p className="Price">
                        Total: <span>{Hotel.total} DA</span>
                    </p>

                    <div className="Res_info">
                        <div>
                            <h4>Nights:</h4>
                            <p>{Hotel.nights}</p>
                        </div>

                        <div>
                            <h4>Status:</h4>
                            <div className={Hotel.status}>{Hotel.status}</div>
                        </div>

                        <div>
                            <h4>Check In:</h4>
                            <p>
                                <FontAwesomeIcon icon={faClock} /> {Hotel.start_d}
                            </p>
                        </div>

                        <div>
                            <h4>Check Out:</h4>
                            <p>
                                <FontAwesomeIcon icon={faClock} /> {Hotel.end_d}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {Hotel.status === "Active" && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        className="SecondaryB RemoveCard"
                        onClick={() => onCancel(Hotel.hreservation_id)}
                    >
                        Cancel Reservation
                    </button>
                </div>
            )}
        </div>
    );
}

/* ================= Hotels Page ================= */

function Hotels() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("FT_user");

        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser);
                const uid = userObj.user_id || userObj.id;
                setUserId(uid);
                fetchReservations(uid);
            } catch (e) {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchReservations = async (uid) => {
        try {
            const response = await fetch(
                `http://localhost/FULL_TRIP_WS/backend/oussama/hotels/get_my_reservations.php?user_id=${uid}`
            );
            const data = await response.json();
            if (Array.isArray(data)) setReservations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (reservationId) => {
        if (!window.confirm("Cancel this reservation?")) return;

        try {
            const response = await fetch(
                "http://localhost/FULL_TRIP_WS/backend/oussama/hotels/cancel_reservation.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reservation_id: reservationId }),
                }
            );

            const result = await response.json();

            if (result.success) {
                setReservations((prev) =>
                    prev.filter((r) => r.hreservation_id !== reservationId)
                );
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
                <h2>Please log in to view your hotel reservations.</h2>
            </div>
        );
    }

    return (
        <div className="S_Container Section">
            <div className="SecHeader">
                <h1>My Hotel Reservations</h1>
                <p>Manage your hotel bookings</p>
            </div>

            {reservations.length > 0 ? (
                reservations.map((res) => (
                    <HotelCard
                        key={res.hreservation_id}
                        Hotel={res}
                        onCancel={handleCancel}
                    />
                ))
            ) : (
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <h3>No reservations found.</h3>
                </div>
            )}
        </div>
    );
}

export default Hotels;
