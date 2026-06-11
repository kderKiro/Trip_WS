import React from "react";
import "./css/CarRentalCard.css"; 
import cardimg from '../img/Card.jpg'
function AttractionCard({ id, image, name, type, entryFee, rating, location }) {
  return (
    <div className="carrentalcard-card" id={`carrentalcard-card-${id}`}>

      {/* Image */}
      <div className="carrentalcard-img-container" id={`carrentalcard-img-${id}`}>
        <img src={image} alt={name} className="carrentalcard-img" />
      </div>

      {/* Info */}
      <div className="carrentalcard-info" id={`carrentalcard-info-${id}`}>
        <h2 className="carrentalcard-name">{name}</h2>
        <p className="carrentalcard-model">Type: {type}</p>
        <p className="carrentalcard-price">Entry Fee: {entryFee} DA</p>
        <p className="carrentalcard-location">⭐ {rating} •  {location}</p>
      </div>

      {/* Button */}
      {/* <div className="carrentalcard-btn-container" id={`carrentalcard-btn-${id}`}>
        <button className="carrentalcard-rent-btn">Visit Now</button>
      </div> */}

    </div>
  );
}

export default AttractionCard;
