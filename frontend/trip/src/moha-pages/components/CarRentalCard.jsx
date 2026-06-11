import React, { useState } from "react";
import "./css/CarRentalCard.css";
import PaymentForm from "./PaymentForm";
import SignUpForm from "../../landingPage/components/SignUpForm"; 

// ✅ Added 'searchParams' to props so we receive the real user search data
function CarRentalCard({ id, image, name, model, price, location, searchParams }) {
    const [showPayment, setShowPayment] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    // 1. Helper: Get User ID from FT_user
    const getUserId = () => {
        const storedUser = localStorage.getItem("FT_user");
        if (!storedUser) return null;
        try {
            const userObj = JSON.parse(storedUser);
            return userObj.user_id || userObj.id || null;
        } catch (e) {
            return null;
        }
    };

    const handleRentClick = () => {
        const userId = getUserId();
        if (userId) {
            setShowPayment(true);
        } else {
            setShowLogin(true);
        }
    };

    const handleLoginSuccess = () => {
        setShowLogin(false);
        setShowPayment(true);
    };

    // -----------------------------------------------------------
    // ✅ DATA PREPARATION
    // -----------------------------------------------------------
    
    const carDataForForm = {
        id: id,
        brand: name,      
        model: model,
        price_per_day: price,
        price: price      
    };

    // ✅ LOGIC UPDATE: Use passed searchParams if available, otherwise use defaults.
    // This allows the strict dates/locations from the search bar to pass through.
    const finalSearchParams = searchParams ? {
        ...searchParams,
        // Ensure location fallback if missing in searchParams
        location: searchParams.location || location, 
        dropoffLocation: searchParams.dropoffLocation || searchParams.location || location
    } : {
        // Fallback defaults (Today -> Tomorrow) if card is shown without a search
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        location: location,
        dropoffLocation: location // Default dropoff to same location
    };

    return (
        <>
            <div className="carrentalcard-card" id={`carrentalcard-card-${id}`}>
                <div className="carrentalcard-img-container">
                    <img src={image} alt={name} className="carrentalcard-img" />
                </div>

                <div className="carrentalcard-info">
                    <h2 className="carrentalcard-name">{name}</h2>
                    <p className="carrentalcard-model">Model: {model}</p>
                    <p className="carrentalcard-price">Price: {price} DA / day</p>
                    <p className="carrentalcard-location">📍 {location}</p>
                </div>

                <div className="carrentalcard-btn-container">
                    <button className="carrentalcard-rent-btn" onClick={handleRentClick}>
                        Rent Now
                    </button>
                </div>
            </div>

            {showLogin && (
                <div className="paymentform-overlay">
                    <SignUpForm 
                        formAppearing={setShowLogin} 
                        SetLoggedIn={() => handleLoginSuccess()}
                        SetUserInfo={() => {}} 
                    />
                </div>
            )}

            {showPayment && (
                <PaymentForm
                    car={carDataForForm} 
                    // ✅ We pass the merged params (User Search or Defaults)
                    searchParams={finalSearchParams} 
                    onClose={() => setShowPayment(false)}
                />
            )}
        </>
    );
}

export default CarRentalCard;