import React, { useState } from "react";
import "./css/Fulltrip.css";

export default function TravelBooking() {
  const [bookingData] = useState({
    title: "Paris: City of Lights",
    location: "Paris, France",
    duration: "7 Days / 6 Nights",
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=600&fit=crop",
    includes: [
      { icon: "✈️", label: "Flight" },
      { icon: "🏨", label: "Hotel" },
      { icon: "🍽️", label: "Meals" },
      { icon: "📸", label: "Tours" }
    ],
    highlights: [
      "Eiffel Tower",
      "Seine River cruise with dinner",
      "Day Trip to Versailles Palace",
      "Louis Museum Tour"
    ],
    pricePerPerson: 2999,
    tickets: 2,
    status: "Active",
    departureDate: "Dec 15 2025"
  });

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });

  const totalPrice = bookingData.pricePerPerson * bookingData.tickets;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiry || !paymentInfo.cvv) {
      alert("Please fill in all fields");
      return;
    }
    setPaymentCompleted(true);
    setShowPaymentForm(false);
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <div className="booking-header">
          <h1>{bookingData.title}</h1>
          <div className="rating">
            ⭐ {bookingData.rating} ({bookingData.reviews})
          </div>
        </div>

        <div className="booking-content">
          <div className="booking-image">
            <img src={bookingData.image} alt={bookingData.title} />
          </div>

          <div className="booking-details">
            <div className="location-duration">
              <div>📍 {bookingData.location}</div>
              <div>⏰ {bookingData.duration}</div>
            </div>

            <div className="includes-section">
              <h2>Includes:</h2>
              <div className="includes-list">
                {bookingData.includes.map((item, index) => (
                  <div key={index} className="include-item">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="highlights-section">
              <h2>Highlights:</h2>
              {bookingData.highlights.map((h, i) => (
                <div key={i}>📸 {h}</div>
              ))}
            </div>

            <div className="pricing">
              <div>${bookingData.pricePerPerson} / Person</div>
              <div>Total: ${totalPrice}</div>
            </div>

            <div className="booking-info">
              <div>👥 Tickets: {bookingData.tickets}</div>
              <div>Status: {bookingData.status}</div>
              <div>Departure: {bookingData.departureDate}</div>
            </div>

            {!paymentCompleted && !showPaymentForm && (
              <button className="reserve-button" onClick={() => setShowPaymentForm(true)}>
                Pay Now
              </button>
            )}

            {showPaymentForm && (
              <form className="payment-form" onSubmit={handlePaymentSubmit}>
                <input name="cardNumber" placeholder="Card Number" onChange={handleInputChange} />
                <input name="cardName" placeholder="Name on Card" onChange={handleInputChange} />
                <input name="expiry" placeholder="MM/YY" onChange={handleInputChange} />
                <input name="cvv" placeholder="CVV" onChange={handleInputChange} />
                <button type="submit">Confirm Payment</button>
              </form>
            )}

            {paymentCompleted && (
              <div className="payment-success">
                ✅ Payment Confirmed. Reservation Complete!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
