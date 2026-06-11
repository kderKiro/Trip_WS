import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import FlightCard from "../components/FlightCard.jsx";
import Footer2 from "../components/Footer2"
import Searcharea from "../components/SearchbarF.jsx"; 
import { useLocation, useNavigate } from "react-router-dom"; 

// Images
import top1 from './pics/Atop1.jpg'
import top2 from './pics/Atop2.jpg'
import top3 from './pics/Atop3.jpg'
import top4 from './pics/Atop4.avif'
import top5 from './pics/Atop5.webp'
import top6 from './pics/Atop6.webp'
import top7 from './pics/Atop7.jpg'
import top8 from './pics/Atop8.avif'
import top9 from './pics/Atop9.webp'
import top10 from './pics/Atop10.avif'
import plane from './pics/plane-departure-solid-full.svg'

import './css/page.css'

function Flights() {
    const { state } = useLocation();
    const navigate = useNavigate(); 
    const refrence = useRef(null);
    
    // State
    const [flights, setFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState(null);

    // Scroll handling
    useEffect(() => {
        if (state) {
             window.scrollTo(0, 400);
        }
    }, [state]);

    // --- 1. THE FETCH FLIGHTS FUNCTION ---
    const fetchFlights = async (params = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            // Check this path matches your folder structure exactly
            const response = await fetch("https://full-trip.onrender.com/oussama/flights/flightssearch.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            });

            if (!response.ok) throw new Error("Failed to connect to server");

            const data = await response.json();

            if (data.outbound || data.return) {
                setFlights(data.outbound || []);
                setReturnFlights(data.return || []);
            } else if (Array.isArray(data)) {
                setFlights(data);
                setReturnFlights([]);
            } else {
                setFlights([]);
                setReturnFlights([]);
            }

        } catch (err) {
            console.error("Connection Error:", err);
            setError("Failed to fetch flights. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. LOAD INITIAL FLIGHTS ---
    useEffect(() => {
        fetchFlights({}); 
    }, []);

    // --- 3. HANDLE SEARCH ---
    const handleSearch = (params) => {
        setSearchParams(params);
        fetchFlights(params);
        
        if (refrence.current) {
            refrence.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    // --- 4. HANDLE BOOKING (UPDATED FOR REFRESH & RED STATUS) ---
    const handleBookFlight = async (flightId, price, paymentDetails) => {
        // 1. Check User Session
        const storedUser = localStorage.getItem("FT_user"); 

        if (!storedUser) {
            // ✅ FORCE BROWSER REFRESH TO LOGIN PAGE
            if (window.confirm("You must be logged in to book a flight. Go to Login page?")) {
                window.location.href = "/Login"; // This forces a full reload
            }
            return;
        }

        // 2. Parse User ID
        let userId = null;
        try {
            const userObj = JSON.parse(storedUser);
            userId = userObj.user_id || userObj.id;
        } catch (e) {
            console.error("JSON Parse Error:", e);
            localStorage.removeItem("FT_user");
            window.location.reload(); 
            return;
        }

        if (!userId) {
            alert("User ID not found. Please log in again.");
            return;
        }

        // 3. Send to Backend (Using book_flight.php)
        try {
            const response = await fetch("https://full-trip.onrender.com/oussama/flights/flightres.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    flight_id: flightId,
                    amount: price, 
                    payment_details: paymentDetails
                }),
            });

            const data = await response.json();

            if (data.success || response.ok) {
                alert("Reservation Successful! Flight Booked.");

                // ✅ UPDATE UI INSTANTLY: Set status to "Reserved" (Red)
                // This updates the local list without needing to refresh the page
                setFlights(prevFlights => prevFlights.map(flight => {
                    if (flight.flight_id === flightId || flight.id === flightId) {
                        return { ...flight, status: "Reserved" }; 
                    }
                    return flight;
                }));

                // Update Return Flights if they exist
                setReturnFlights(prev => prev.map(flight => {
                    if (flight.flight_id === flightId || flight.id === flightId) {
                        return { ...flight, status: "Reserved" };
                    }
                    return flight;
                }));

            } else {
                alert("Booking Failed: " + (data.message || data.error || "Unknown error"));
            }

        } catch (err) {
            console.error("Booking Fetch Error:", err);
            alert("An error occurred. Check if XAMPP is running.");
        }
    };

    function handleScroll() {
        refrence.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }

    return (
        <>
            <h1 className="header" onClick={handleScroll} style={{ cursor: "pointer" }}>
                <img src={plane} className="icon" alt="icon" /> Fly Beyond Limits
            </h1>

            <section className="container">
                <div className="slider-wrapper">
                    <div className="slider">
                        <div className="slide">
                            <img id="slide-1" src={top1} alt="top1" />
                            <div className="pic-overlay"><h2>1. Singapore Changi Airport (Singapore)</h2></div>
                        </div>
                        <div className="slide">
                            <img id="slide-2" src={top2} alt="top2" />
                            <div className="pic-overlay"><h2>2. Hamad International Airport (Doha, Qatar)</h2></div>
                        </div>
                         <div className="slide">
                            <img id="slide-3" src={top3} alt="top3" />
                             <div className="pic-overlay"><h2>3. Tokyo International Airport (Haneda)</h2></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="output">
                <div className="search" ref={refrence}>
                    <Searcharea
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        initialDate={state?.date}
                        initialDestination={state?.to}
                        initialBudget={state?.budget}
                    />
                </div>

                <div className="outputarea">
                    {isLoading && <h3 style={{textAlign: "center", color: "white"}}>Loading flights...</h3>}
                    
                    {error && <h3 style={{textAlign: "center", color: "red"}}>{error}</h3>}
                    
                    {!isLoading && !error && flights.length === 0 && (
                        <h3 style={{textAlign: "center", color: "white"}}>No flights found.</h3>
                    )}

                    {/* OUTBOUND FLIGHTS */}
                    {flights.map(flight => (
                        <FlightCard 
                            key={flight.flight_id || flight.id} 
                            flight={flight} 
                            // Using standard prop 'onBook' as discussed, or keep 'onBooked' if your card uses that
                            onBook={(id, price, payment) => handleBookFlight(id, price, payment)}
                        />
                    ))}

                    {/* RETURN FLIGHTS (If Round Trip) */}
                    {returnFlights.length > 0 && (
                        <>
                            <h2 style={{color: 'white', marginTop: '2rem', textAlign:'center'}}>Return Flights</h2>
                            <hr style={{width: '50%', margin: '10px auto'}}/>
                            {returnFlights.map(flight => (
                                <FlightCard 
                                    key={flight.flight_id || flight.id} 
                                    flight={flight} 
                                    onBook={(id, price, payment) => handleBookFlight(id, price, payment)}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
            
            <Footer2 />
        </>
    );
}

export default Flights;