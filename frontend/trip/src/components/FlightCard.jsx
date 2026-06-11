import React, { useState } from "react";
import "./css/FlightCard.css"; 
import SignUpForm from "../landingPage/components/SignUpForm"; 

function formatTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function FlightCard({ flight, returnDate = null, onBooked }) {
  // --- STATE ---
  const [showPayment, setShowPayment] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 

  // --- 🟢 UPDATED PAYMENT STATE (Consolidated for easier management) ---
  const [paymentData, setPaymentData] = useState({
    cardName: "", 
    cardNumber: "", 
    expiry: "", 
    cvv: ""
  });
  const [errors, setErrors] = useState({});

  // --- 1. USER CHECK HELPER ---
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

  // --- 2. HANDLE RESERVE CLICK ---
  const handleReserveClick = () => {
    const userId = getUserId();
    if (userId) {
      setShowPayment(true);
    } else {
      setShowLogin(true);
    }
  };

  // --- 3. HANDLE LOGIN SUCCESS ---
  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowPayment(true);
  };

  // --- DATA MAPPING ---
  const f = flight ? {
    id: flight.flight_id || flight.id,
    departure_time: flight.departure_full_iso || new Date().toISOString(), 
    arrival_time: flight.arrival_full_iso || new Date().toISOString(),
    departure_code: flight.depart_airport || "DEP",
    departure_city: flight.depart_country || "Departure City",
    arrival_code:   flight.des_airport    || "ARR",
    arrival_city:   flight.des_country    || "Arrival City",
    airline_name:   flight.airline_name || `Flight #${flight.flight_id}`,
    flight_number:  `FL-${flight.flight_id}`,
    duration:       flight.duration_formatted || "0h",
    stops:          flight.stops === 0 ? "Non-Stop" : `${flight.stops} Stop(s)`,
    price:          Number(flight.price) || 0,
    class:          flight.class || "Economy",
    status:         flight.status || "Scheduled"
  } : null;

  if (!f) return null;

  // --- PAYMENT HANDLERS ---
  const handleClose = () => {
    setShowPayment(false);
    setPaymentData({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
    setErrors({});
  };

  // --- 🟢 NEW: INPUT CHANGE HANDLER (Auto-formatting) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Card Number: Add space every 4 digits
    if (name === "cardNumber") {
        const rawValue = value.replace(/\D/g, ""); 
        newValue = rawValue.replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19); 
    }
    
    // Expiry: Auto-insert slash
    if (name === "expiry") {
        if (value.length < paymentData.expiry.length && paymentData.expiry.endsWith('/')) {
             newValue = value.slice(0, -1); // Handle backspace
        } else {
             const rawValue = value.replace(/\D/g, "");
             if (rawValue.length >= 2) {
                 newValue = rawValue.slice(0, 2) + '/' + rawValue.slice(2, 4);
             } else {
                 newValue = rawValue;
             }
        }
    }

    // CVV: Numbers only
    if (name === "cvv") {
        newValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setPaymentData(p => ({ ...p, [name]: newValue }));
    
    // Clear error for this field as user types
    if (errors[name]) setErrors(e => ({ ...e, [name]: "" }));
  };

  // --- 🟢 NEW: ROBUST VALIDATION LOGIC ---
  const validate = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear() % 100; // Last 2 digits
    const currentMonth = new Date().getMonth() + 1; 

    // 1. Validate Name
    if (!paymentData.cardName.trim()) newErrors.cardName = "Name is required";
    
    // 2. Validate Card Number (Length check)
    const cleanCardNum = paymentData.cardNumber.replace(/\s/g, "");
    if (cleanCardNum.length !== 16) {
      newErrors.cardNumber = "Must be 16 digits";
    }

    // 3. Validate Expiry (Date Logic)
    if (!paymentData.expiry) {
        newErrors.expiry = "Required";
    } else {
        const [month, year] = paymentData.expiry.split('/');
        
        if (!month || !year || month.length !== 2 || year.length !== 2) {
            newErrors.expiry = "Format MM/YY";
        } else {
            const m = parseInt(month, 10);
            const y = parseInt(year, 10);

            if (m < 1 || m > 12) {
                newErrors.expiry = "Invalid Month";
            } else if (y < currentYear || (y === currentYear && m < currentMonth)) {
                newErrors.expiry = "Card expired";
            }
        }
    }

    // 4. Validate CVV
    if (paymentData.cvv.length !== 3) {
      newErrors.cvv = "Must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop if validation fails

    if (onBooked) {
        await onBooked(f.id, f.price, paymentData);
    }
    
    // Close Payment Modal
    setShowPayment(false);
    // Reset Fields
    setPaymentData({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
    setErrors({});
    // Show Success Modal
    setShowSuccess(true);
  };

  const dateLabel = returnDate
    ? `${formatDate(f.departure_time)} - ${formatDate(returnDate)}`
    : formatDate(f.departure_time);

  return (
    <>
      {/* --- FLIGHT CARD UI --- */}
      <div className="flight-card">
        <div className="date-header">{dateLabel}</div>

        <div className="flight-content">
          <div className="airline-section">
            <div className="airline-logo">
               <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
            </div>
            <div className="airline-info">
              <h2 className="airline-name">{f.airline_name}</h2>
              <p className="flight-number">{f.flight_number}</p>
            </div>
          </div>

          <div className="flight-details">
            <div className="location-section">
              <h3 className="location-label">{f.departure_code}</h3>
              <p className="location-name">{f.departure_city}</p>
              <div className="departure-dot"></div>
              <p className="time">{formatTime(f.departure_time)}</p>
            </div>

            <div className="flight-path">
              <div className="duration-container">
                <svg className="plane-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                <span className="duration">{f.duration}</span>
              </div>
              <div className="path-line"></div>
              <div className="stop-indicator">
                <div className="stop-dot"></div>
                <span className="stop-label">{f.stops}</span>
              </div>
            </div>

            <div className="location-section">
              <h3 className="location-label">{f.arrival_code}</h3>
              <p className="location-name">{f.arrival_city}</p>
              <div className="arrival-dot"></div>
              <p className="time">{formatTime(f.arrival_time)}</p>
            </div>
          </div>

          <div className="booking-info">
            <div className="info-group">
              <span className="info-label">Price</span>
              <span className="price">${f.price.toFixed(0)}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Class</span>
              <span className="class-badge">{f.class}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Status</span>
              <span className={`status-badge ${f.status === 'Scheduled' ? 'green' : 'gray'}`} 
                   style={{color: f.status === 'Scheduled' ? 'green' : 'gray'}}>
                {f.status}
              </span>
            </div>
          </div>
        </div>

        <div className="action-section">
          <button className="reserve-btn" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>
      
      {/* --- LOGIN OVERLAY --- */}
      {showLogin && (
        <div className="flight-payment-overlay"> 
           <div style={{background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius:'10px'}}>
               <SignUpForm 
                 formAppearing={setShowLogin} 
                 SetLoggedIn={handleLoginSuccess}
                 SetUserInfo={() => {}} 
               />
           </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {showPayment && (
        <div className="flight-payment-overlay">
           <div className="flight-payment-modal">
             <button className="flight-payment-close" onClick={handleClose}>×</button>
             <h2>Payment Details</h2>
             
             <form className="flight-payment-form" onSubmit={handleSubmit}>
                
                {/* CARD NAME */}
                <div className="flight-payment-group">
                    <label>Card Name</label>
                    <input 
                        type="text"
                        name="cardName"
                        className={errors.cardName ? "input-error" : ""}
                        value={paymentData.cardName} 
                        onChange={handleChange}
                        placeholder="John Doe"
                    />
                    {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                </div>

                {/* CARD NUMBER */}
                <div className="flight-payment-group">
                    <label>Card Number</label>
                    <input 
                        type="text"
                        name="cardNumber"
                        className={errors.cardNumber ? "input-error" : ""}
                        value={paymentData.cardNumber} 
                        onChange={handleChange}
                        maxLength="19"
                        placeholder="0000 0000 0000 0000"
                    />
                    {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>
                
                <div className="flight-payment-row">
                    {/* EXPIRY */}
                    <div className="flight-payment-group" style={{width: '100%'}}>
                        <label>Expiry</label>
                        <input 
                            type="text"
                            name="expiry"
                            className={errors.expiry ? "input-error" : ""}
                            value={paymentData.expiry} 
                            onChange={handleChange}
                            placeholder="MM/YY"
                            maxLength="5"
                        />
                        {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                    </div>

                    {/* CVV */}
                    <div className="flight-payment-group" style={{width: '100%'}}>
                        <label>CVV</label>
                        <input 
                            type="text"
                            name="cvv"
                            className={errors.cvv ? "input-error" : ""}
                            value={paymentData.cvv} 
                            onChange={handleChange}
                            maxLength="3"
                            placeholder="123"
                        />
                        {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                    </div>
                </div>
                
                <button type="submit" className="flight-pay-btn">
                    Pay ${f.price.toFixed(0)}
                </button>
             </form>
           </div>
        </div>
      )}

      {/* --- SUCCESS POPUP --- */}
      {showSuccess && (
        <div className="flight-payment-overlay">
           <div className="flight-payment-modal success-content">
              <div className="success-icon-container">
                 <svg className="success-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                 </svg>
              </div>
              <h2 className="success-title">Payment Successful!</h2>
              <p className="success-text">
                 Your flight to <strong>{f.arrival_city}</strong> has been booked successfully.
              </p>
              <button className="done-btn" onClick={() => setShowSuccess(false)}>
                 Done
              </button>
           </div>
        </div>
      )}
    </>
  );
}

export default FlightCard;