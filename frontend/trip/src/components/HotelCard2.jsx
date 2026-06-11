import React, { useState } from 'react';
import './css/HotelCard2.css';
import SignUpForm from "../landingPage/components/SignUpForm"; 

function HotelCard2({ hotel, onBook, searchParams }) {
  // --- STATE ---
  const [showPayment, setShowPayment] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- DATA SETUP ---
  const id = hotel?.hotel_id || hotel?.id || hotel?.h_id;
  const name = hotel?.h_name || "The Grand Plaza Hotel";
  const location = hotel?.h_location || "Manhattan, New York";
  const basePrice = parseFloat(hotel?.price || 299);
  const description = hotel?.h_description || "Luxurious 5-star hotel in the heart of the city.";
  const rating = hotel?.h_rating || 9.2;
  const starCount = hotel?.h_stars ? parseInt(hotel.h_stars) : 5;
  const image = hotel?.h_image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
  const isReserved = hotel?.status === 'Reserved';

  const [paymentData, setPaymentData] = useState({
    name: "", cardNumber: "", expiry: "", cvv: ""
  });
  const [errors, setErrors] = useState({});

  // --- 🧮 CALCULATION LOGIC ---
  const calculateCosts = () => {
     const checkinStr = searchParams?.checkin || new Date().toISOString().split('T')[0];
     const checkoutStr = searchParams?.checkout || new Date(Date.now() + 86400000).toISOString().split('T')[0];
     
     const start = new Date(checkinStr);
     const end = new Date(checkoutStr);
     
     const diffTime = Math.abs(end - start);
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
     const nights = diffDays > 0 ? diffDays : 1;

     const adults = parseInt(searchParams?.people || 1);
     const children = parseInt(searchParams?.children || 0);
     const totalGuests = adults + children;

     const total = basePrice * nights * totalGuests;

     return { nights, totalGuests, total, start, end };
  };

  const { nights, totalGuests, total, start, end } = calculateCosts();

  // --- HANDLERS ---
  const getUserId = () => {
    const storedUser = localStorage.getItem("FT_user");
    try { 
        const u = JSON.parse(storedUser);
        return u?.user_id || u?.id || u?.ID; 
    } catch { return null; }
  };

  const handleReserve = () => {
    if (getUserId()) setShowPayment(true);
    else setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowPayment(true);
  };

  const handleClose = () => {
    setShowPayment(false);
    setPaymentData({ name: "", cardNumber: "", expiry: "", cvv: "" });
    setErrors({});
    setIsProcessing(false);
  };

  // --- 🟢 IMPROVED INPUT HANDLER (Auto-formatting) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Card Number: Allow only numbers, max 19 chars (16 digits + 3 spaces)
    if (name === "cardNumber") {
        const rawValue = value.replace(/\D/g, ""); // Remove non-digits
        // Add space every 4 digits
        newValue = rawValue.replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19); 
    }
    
    // Expiry: Allow numbers and '/', auto-insert slash
    if (name === "expiry") {
        // Prevent user from deleting the slash manually if they backspace
        if (value.length < paymentData.expiry.length && paymentData.expiry.endsWith('/')) {
             newValue = value.slice(0, -1);
        } else {
             const rawValue = value.replace(/\D/g, "");
             if (rawValue.length >= 2) {
                 newValue = rawValue.slice(0, 2) + '/' + rawValue.slice(2, 4);
             } else {
                 newValue = rawValue;
             }
        }
    }

    // CVV: Only numbers, max 3
    if (name === "cvv") {
        newValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setPaymentData(p => ({ ...p, [name]: newValue }));
    
    // Clear error for this field as user types
    if (errors[name]) setErrors(e => ({ ...e, [name]: "" }));
  };

  // --- 🟢 IMPROVED VALIDATION LOGIC ---
  const validate = () => {
    const err = {};
    const currentYear = new Date().getFullYear() % 100; // Get last 2 digits (e.g., 24)
    const currentMonth = new Date().getMonth() + 1; // 1-12

    // 1. Name
    if (!paymentData.name.trim()) err.name = "Name is required";

    // 2. Card Number (Check raw length without spaces)
    const rawCard = paymentData.cardNumber.replace(/\s/g, "");
    if (rawCard.length !== 16) err.cardNumber = "Must be 16 digits";

    // 3. Expiry Date
    if (!paymentData.expiry) {
        err.expiry = "Required";
    } else {
        const [month, year] = paymentData.expiry.split('/');
        
        if (!month || !year || month.length !== 2 || year.length !== 2) {
            err.expiry = "Format MM/YY";
        } else {
            const m = parseInt(month, 10);
            const y = parseInt(year, 10);

            if (m < 1 || m > 12) {
                err.expiry = "Invalid Month";
            } else if (y < currentYear || (y === currentYear && m < currentMonth)) {
                err.expiry = "Card expired";
            }
        }
    }

    // 4. CVV
    if (paymentData.cvv.length !== 3) err.cvv = "Must be 3 digits";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsProcessing(true);

    if (onBook) {
        const formattedCheckin = start.toISOString().split('T')[0];
        const formattedCheckout = end.toISOString().split('T')[0];

        const isSuccess = await onBook(id, total, paymentData, {
            checkin: formattedCheckin,
            checkout: formattedCheckout
        });
        
        if (isSuccess) {
            handleClose(); 
            setShowSuccess(true);
        } 
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="hotel-card">
        <div className="hotel-image">
          <img src={image} alt={name} />
        </div>
        
        <div className="hotel-details">
          <div className="header-section">
            <div>
              <h1 className="hotel-name">{name}</h1>
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < starCount ? 'filled' : ''}`}>★</span>
                ))}
              </div>
            </div>
            <div className="rating-badge">{rating}</div>
          </div>

          <div className="location">
              <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>{location}</span>
          </div>

          <p className="description">{description}</p>

          <div className="amenities">
            <span className="amenity">Wi-Fi</span>
            <span className="amenity">Parking</span>
            <span className="amenity">Breakfast</span>
            <span className="amenity">Gym</span>
          </div>

          <div className="pricing">
            <div className="price">
              <span className="amount">${basePrice}</span>
              <span className="per-night">per person/night</span>
            </div>
            <div className="total">
              <span className="total-label">{nights} nights x {totalGuests} guests</span>
              <span className="total-amount">${total}</span>
            </div>
          </div>

          {isReserved ? (
             <button className="reserve-btn" style={{backgroundColor: '#e74c3c', cursor: 'default'}} disabled>
                Reserved
             </button>
          ) : (
             <button className="reserve-btn" onClick={handleReserve}>
                Reserve
             </button>
          )}
        </div>
      </div>

      {showLogin && (
        <div className="payment-modal"> 
           <div style={{background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius:'10px'}}>
               <SignUpForm formAppearing={setShowLogin} SetLoggedIn={handleLoginSuccess} SetUserInfo={() => {}} />
           </div>
        </div>
      )}

      {showPayment && (
        <div className="payment-modal">
          <div className="payment-content">
            <h2>Complete Payment</h2>
            
            <div className="payment-summary-box">
                <div className="summary-row">
                    <div className="summary-item">
                        <span className="summary-label">Hotel</span>
                        <span className="summary-value">{name}</span>
                    </div>
                </div>
                <div className="summary-row">
                    <div className="summary-item">
                        <span className="summary-label">Check-in</span>
                        <span className="summary-value">{start.toLocaleDateString()}</span>
                    </div>
                    <div className="summary-item" style={{alignItems: 'flex-end'}}>
                        <span className="summary-label">Check-out</span>
                        <span className="summary-value">{end.toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-total">
                      <span className="total-due-label">Total Due</span>
                      <span className="total-due-amount">${total}</span>
                </div>
            </div>
            
            <form className="payment-form" onSubmit={handleSubmit}>
              <label>
                Card Name
                <input className={errors.name ? "input-error" : ""} type="text" name="name" placeholder="John Doe" value={paymentData.name} onChange={handleChange} />
                {errors.name && <span className="error">{errors.name}</span>}
              </label>

              <label>
                Card Number
                <input className={errors.cardNumber ? "input-error" : ""} type="text" name="cardNumber" maxLength={19} placeholder="0000 0000 0000 0000" value={paymentData.cardNumber} onChange={handleChange} />
                {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
              </label>

              <div className="row">
                <label>
                   Expiry (MM/YY)
                   <input className={errors.expiry ? "input-error" : ""} type="text" name="expiry" maxLength={5} placeholder="MM/YY" value={paymentData.expiry} onChange={handleChange} />
                   {errors.expiry && <span className="error">{errors.expiry}</span>}
                </label>
                <label>
                   CVV
                   <input className={errors.cvv ? "input-error" : ""} type="text" name="cvv" placeholder="123" maxLength={3} value={paymentData.cvv} onChange={handleChange} />
                   {errors.cvv && <span className="error">{errors.cvv}</span>}
                </label>
              </div>

              <button type="submit" className="pay-btn" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Pay $${total}`}
              </button>
            </form>
            <button className="close-btn" onClick={handleClose}>×</button>
          </div>
        </div>
      )}

      {/* --- SUCCESS POPUP --- */}
      {showSuccess && (
        <div className="payment-modal">
           <div className="payment-content success-content">
              <div className="success-icon-container">
                 <svg className="success-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                 </svg>
              </div>
              <h2 className="success-title">Payment Successful!</h2>
              <p className="success-text">
                 Your reservation at <strong>{name}</strong> has been confirmed.
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

export default HotelCard2;