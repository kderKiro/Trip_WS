import React, { useState, useEffect } from 'react';
// Removed useNavigate import since Edit logic is gone
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, faA, faM, faBolt, faGasPump, 
    faClock, faMapLocation, faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import './Styles/CarRentals.css';
import DefaultCar from './Images/bmw.svg'; 

function CarCard({ Car, onCancel }) {
    // 1. Calculate Days and Total Price dynamically
    const start = new Date(Car.pickup_d);
    const end = new Date(Car.return_d);
    const diffTime = Math.abs(end - start);
    const daysRented = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = daysRented * Number(Car.price);

    return (
        <div className="Section" style={{ backgroundColor: "white", marginBottom: "20px" }}>
            <div className='Car'>
                <img 
                    src={Car.car_image_url || DefaultCar} 
                    alt={Car.model} 
                    onError={(e) => {e.target.src = DefaultCar}} 
                />
                <div className='CarDetails'>
                    <div className='CarType'>{Car.car_type}</div>
                    <h2>{`${Car.car_brand} ${Car.model}`}</h2>

                    <div className='Amenities'>
                        <div className='Amenitie'> 
                            <FontAwesomeIcon icon={faUser} /> 
                            {`${Car.car_passengers} Passenger${(Car.car_passengers > 1) ? "s" : ""}`}
                        </div>
                        <div className='Amenitie'> 
                            <FontAwesomeIcon icon={(Car.transmission === "Automatic") ? faA : faM} /> 
                            {Car.transmission}
                        </div>
                        <div className='Amenitie'> 
                            <FontAwesomeIcon icon={(Car.fuel_type === "Electric" ? faBolt : faGasPump)} /> 
                            {Car.fuel_type}
                        </div>
                    </div>

                    <p className='Price'>Price/Day: <span>{Car.price} DA</span></p>
                    <p className='Price'>Total: <span>{totalPrice} DA</span></p>

                    <div className='Res_info'>
                        <div className="NightsRes">
                            <h4>Days Rented:</h4>
                            <p>{daysRented}</p>
                        </div>
                        <div className="HStatus">
                            <h4>Status:</h4>
                            <div className={Car.status}>{Car.status}</div>
                        </div>
                        <div className="DateIn">
                            <h4>Pick up:</h4>
                            <p><FontAwesomeIcon icon={faClock} className='Icon' /> {Car.pickup_d}</p>
                            <p><FontAwesomeIcon icon={faMapLocation} className='Icon' /> {Car.pickup_l}</p>
                        </div>
                        <div className="DateOut">
                            <h4>Return:</h4>
                            <p><FontAwesomeIcon icon={faClock} className='Icon' /> {Car.return_d}</p>
                            <p><FontAwesomeIcon icon={faMapLocation} className='Icon' /> {Car.return_l}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                    className="SecondaryB RemoveCard" 
                    onClick={() => onCancel(Car.creservation_id)}
                >
                    Cancel Reservation
                </button>
            </div>
        </div>
    );
}

// -------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------
function CarRentals() {
    // Removed navigate hook
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // 2. Fetch Logic
    useEffect(() => {
        const storedUser = localStorage.getItem("FT_user");
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser);
                const uid = userObj.user_id || userObj.id; 
                setUserId(uid);
                fetchReservations(uid);
            } catch (e) {
                console.error("User parse error");
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchReservations = async (uid) => {
        try {
            const response = await fetch(`http://localhost/FULL_TRIP_WS/backend/Mohammed/Cars/get_my_reservations.php?user_id=${uid}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setReservations(data);
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Cancel Logic
    const handleCancel = async (reservationId) => {
        if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

        try {
            const response = await fetch('https://full-trip.onrender.com/Mohammed/Cars/cancel_reservation.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // FIX: Changed cancelTargetId to reservationId so it matches the argument
                body: JSON.stringify({ reservation_id: reservationId })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Remove from UI immediately
                setReservations(prev => prev.filter(r => r.creservation_id !== reservationId));
            } else {
                alert("Action failed: " + (result.error || "Unknown error"));
            }
        } catch (error) {
            alert("Connection error");
        }
    };

    // REMOVED: handleEdit function is deleted.

    if (loading) {
        return (
            <div className="S_Container Section" style={{textAlign:'center', marginTop:'50px'}}>
                <h2><FontAwesomeIcon icon={faSpinner} spin /> Loading...</h2>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="S_Container Section" style={{textAlign:'center', marginTop:'50px'}}>
                <h2>Please log in to view your reservations.</h2>
            </div>
        );
    }

    return (
        <div className="S_Container Section">
            <div className="SecHeader">
                <h1>My Car Reservation</h1>
                <p>Manage your Car Rentals</p>
            </div>

            {reservations.length > 0 ? (
                reservations.map((res) => (
                    <CarCard 
                        key={res.creservation_id} 
                        Car={res} 
                        onCancel={handleCancel} 
                    />
                ))
            ) : (
                <div style={{textAlign:'center', padding:'40px', color:'#666'}}>
                    <h3>No reservations found.</h3>
                </div>
            )}
        </div>
    );
}

export default CarRentals;