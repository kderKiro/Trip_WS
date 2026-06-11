import Navbar from "../components/Navbar";
import Searcharea from "../components/Searchbar";
import Hotelcard2 from "../components/HotelCard2";
import Footer2 from "../components/Footer2";
import hotelIcon from './pics/hotel.png';
import top1 from './pics/Top1.jpg';
import top2 from './pics/top2.avif';
import { useRef, useState, useEffect } from "react";
import './css/page.css';

function Hotels() {
    const resultRef = useRef(null);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Store search params to pass to cards for calculation
    const [searchParams, setSearchParams] = useState({
        checkin: new Date().toISOString().split('T')[0],
        checkout: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
        people: 1, 
        children: 0
    });

    const fetchHotels = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            // Note: Ensure this path matches your XAMPP/WAMP folder structure exactly
            const response = await fetch("https://full-trip.onrender.com/oussama/hotels/hotelsearch.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            });
            if (!response.ok) throw new Error("Failed to connect to server");
            const data = await response.json();

            if (Array.isArray(data)) {
                setHotels(data.map(h => ({...h, status: h.status || 'Available'})));
            } else {
                setHotels([]); 
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch hotels.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels(); 
    }, []);

    // --- 🟢 FIX: Handles the booking request from the Child Component ---
    const handleBookHotel = async (hotelId, calculatedTotal, paymentData, bookingDates) => {
        const storedUser = localStorage.getItem("FT_user");
        if (!storedUser) return false;
        
        let userId;
        try {
             const parsed = JSON.parse(storedUser);
             userId = parsed.user_id || parsed.id || parsed.ID;
        } catch (e) { return false; }

        if (!userId) {
            alert("Please log in again.");
            return false;
        }

        try {
            // Pointing to your specific PHP path
            const response = await fetch("https://full-trip.onrender.com/oussama/hotels/hotelres.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    hotel_id: hotelId,
                    total_price: calculatedTotal, // Changed 'amount' to 'total_price' to match DB
                    checkin: bookingDates.checkin,
                    checkout: bookingDates.checkout,
                    guests: searchParams.people // Optional: pass guest count
                })
            });
            
            // Check if response is valid JSON
            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (err) {
                console.error("Server returned non-JSON:", text);
                alert("Server Error. Check console.");
                return false;
            }

            if (result.success) {
                // Update local state to show 'Reserved' button immediately
                setHotels(prev => prev.map(h => 
                    (h.hotel_id === hotelId || h.id === hotelId || h.h_id === hotelId) 
                    ? { ...h, status: 'Reserved' } : h
                ));
                return true; // Tells the card to show Green Success Popup
            } else {
                console.error("Booking Failed:", result);
                alert("Booking Failed: " + (result.message || result.error));
                return false; 
            }
        } catch (e) {
            console.error("Network Error:", e); 
            alert("Could not connect to server.");
            return false;
        }
    };

    const handleSearch = (formData) => {
        setSearchParams({
            checkin: formData.checkin || new Date().toISOString().split('T')[0],
            checkout: formData.checkout || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
            people: formData.people || 1,
            children: formData.children || 0
        });

        fetchHotels(formData);
        if (resultRef.current) resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <h1 className="header" style={{ cursor: "pointer" }}>
                <img src={hotelIcon} className="icon" alt="icon" /> Reserve Your Spot
            </h1>

            <section className="container">
                <div className="slider-wrapper">
                    <div className="slider">
                        <div className="slide" id="slide-1">
                            <img src={top1} alt="top1" />
                            <div className="pic-overlay"><h2>1. Capella Bangkok</h2></div>
                        </div>
                        <div className="slide" id="slide-2">
                             <img src={top2} alt="top2" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="output">
                <div className="search" ref={resultRef}>
                    <Searcharea onSearch={handleSearch} />
                </div>

                <div className="outputarea">
                    {loading ? (
                        <h3 style={{textAlign: "center", color: "white"}}>Loading hotels...</h3>
                    ) : error ? (
                        <h3 style={{textAlign: "center", color: "red"}}>{error}</h3>
                    ) : hotels.length > 0 ? (
                        hotels.map((hotel, index) => (
                            <Hotelcard2 
                                key={hotel.hotel_id || index} 
                                hotel={hotel} 
                                searchParams={searchParams} 
                                onBook={handleBookHotel}
                            />
                        ))
                    ) : (
                        <h3 style={{textAlign: "center", color: "white"}}>No hotels found.</h3>
                    )}
                </div>
            </div>
            <Footer2 />
        </>
    );
}

export default Hotels;
