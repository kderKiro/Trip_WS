import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"; // Added Check Icon
import "./css/PaymentForm.css";

function PaymentForm({ car, searchParams, onClose }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // ✅ NEW: State to control Success View
  const [isSuccess, setIsSuccess] = useState(false);

  // --- 1. GET DATES & LOCATIONS FROM SEARCH PARAMS ---
  const startDateStr = searchParams?.startDate || new Date().toISOString().split('T')[0];
  const endDateStr = searchParams?.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const pickupLoc = searchParams?.location || "";
  const dropoffLoc = searchParams?.dropoffLocation || searchParams?.location || ""; 

  // --- 2. CALCULATE PRICE ---
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; 
  const pricePerDay = car.price || car.price_per_day || 0;
  const totalPrice = diffDays * pricePerDay;

  // --- 3. VALIDATION ---
  const validate = () => {
    const newErrors = {};

    if (!pickupLoc || !dropoffLoc) {
        alert("⚠️ Please go back and select a Pickup and Drop-off location.");
        onClose();
        return false;
    }

    if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ""))) newErrors.cardNumber = "Card number must be 16 digits";
    
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Use MM/YY";
    } else {
      const [month, year] = expiry.split("/").map(Number);
      const expiryDate = new Date(2000 + year, month - 1, 1);
      const now = new Date();
      now.setDate(1); 
      if (expiryDate < now) newErrors.expiry = "Card expired";
    }

    if (!/^\d{3}$/.test(cvv)) newErrors.cvv = "3 digits required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const storedUser = localStorage.getItem('FT_user');
    let userId = null;
    if (storedUser) {
        try { userId = JSON.parse(storedUser).user_id || JSON.parse(storedUser).id; } 
        catch (err) { console.error(err); }
    }

    if (!userId) {
        alert("Please log in to reserve.");
        setLoading(false);
        return;
    }

    const bookingData = {
        user_id: userId,
        car_id: car.id || car.car_id,
        pickup_d: startDateStr,
        return_d: endDateStr,
        pickup_l: pickupLoc,
        return_l: dropoffLoc
    };

    try {
        const response = await fetch('https://full-trip.onrender.com/Mohammed/Cars/reserve_car.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (result.success) {
            // ✅ CHANGED: Switch to Success View instead of Alert
            setIsSuccess(true);
        } else {
            alert(`❌ Failed: ${result.error || result.message}`);
        }
    } catch (error) {
        alert("❌ Connection Error.");
    } finally {
        setLoading(false);
    }
  };

  // -----------------------------------------------------------
  // ✅ 4. RENDER: SUCCESS MODAL VIEW
  // -----------------------------------------------------------
  if (isSuccess) {
    return (
      <div className="paymentform-overlay">
        <div className="paymentform-modal" style={{ textAlign: "center", padding: "40px" }}>
          
          <div style={{ color: "#28a745", fontSize: "60px", marginBottom: "20px" }}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>

          <h2 style={{ marginBottom: "10px", color: "#333" }}>Payment Successful!</h2>
          <p style={{ color: "#666", marginBottom: "25px", fontSize: "16px" }}>
             Your car has been reserved successfully.
          </p>

          {/* Recap of the Reservation */}
          <div style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", padding: "15px", marginBottom: "25px", textAlign: "left", fontSize: "14px", border: "1px solid #eee" }}>
             <p><strong>🚗 Car:</strong> {car.brand} {car.model}</p>
             <p><strong>📅 Dates:</strong> {startDateStr} to {endDateStr}</p>
             <p><strong>💰 Total:</strong> {totalPrice} DA</p>
          </div>

          <button 
            onClick={onClose}
            className="paymentform-submit-btn" // Reusing your existing button class
            style={{ backgroundColor: "#28a745", marginTop: "0" }}
          >
            Done
          </button>

        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // 5. RENDER: ORIGINAL FORM (Your existing Frontend)
  // -----------------------------------------------------------
  return (
    <div className="paymentform-overlay">
      <div className="paymentform-modal">
        <h2>Reserve: {car.brand} {car.model}</h2>

        <div style={{
            backgroundColor: "#f8f9fa", 
            padding: "15px", 
            borderRadius: "10px", 
            marginBottom: "20px",
            fontSize: "0.9rem",
            border: "1px solid #e9ecef"
        }}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px"}}>
                <div>
                    <strong>📍 Pickup:</strong><br/>
                    {pickupLoc || <span style={{color:"red"}}>Not selected</span>}
                </div>
                <div>
                    <strong>🏁 Drop-off:</strong><br/>
                    {dropoffLoc || <span style={{color:"red"}}>Same as Pickup</span>}
                </div>
            </div>
            
            <p style={{margin: "5px 0", borderTop:"1px solid #ddd", paddingTop:"8px"}}>
                <strong>📅 Dates:</strong> {startDateStr} <span style={{color:"#888"}}>➝</span> {endDateStr}
            </p>

            <p style={{marginTop: "10px", fontSize: "1.1rem", fontWeight: "bold", textAlign: "right", color: "#007bff"}}>
                Total: {totalPrice} DA <span style={{fontSize:"0.8rem", color:"#555", fontWeight:"normal"}}>({diffDays} days)</span>
            </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="paymentform-group">
            <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
            <div className="attraction-error">{errors.cardNumber}</div>
          </div>

          <div className="paymentform-group">
            <input type="text" placeholder="Expiry MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
            <div className="attraction-error">{errors.expiry}</div>
          </div>

          <div className="paymentform-group">
            <input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
            <div className="attraction-error">{errors.cvv}</div>
          </div>

          <div className="paymentform-buttons">
            <button type="submit" disabled={loading}>
                {loading ? "Processing..." : `Pay ${totalPrice} DA`}
            </button>
            <button type="button" className="paymentform-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentForm;