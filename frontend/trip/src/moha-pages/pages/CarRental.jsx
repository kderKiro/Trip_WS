import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Added for routing
import NavBar from "../components/NavBar";
import Slider from "../components/Slider";
import CarRentalForm from "../components/CarRentalForm";
import CarRentalCard from "../components/CarRentalCard";
import Footer from "../../landingPage/components/Footer"
import "./css/CarRental.css";

// IMPORT SLIDER IMAGES
import top1 from "../img/CarRental/Uber.jpg";
import top2 from "../img/CarRental/Yassir.png";
import top3 from "../img/CarRental/inDrive.png";
import top4 from "../img/CarRental/heetch.png";
import top5 from "../img/CarRental/Careem.svg";
import top6 from "../img/CarRental/turo.webp";

// IMPORT DEFAULT CAR IMAGE
import carImg from "../img/Car.webp";

function CarRental() {
  const formRef = useRef(null);
  
  // 1. ROUTER HOOKS
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we are in Edit Mode (passed from CarRentals.jsx)
  const { editMode, reservationToEdit } = location.state || {};

  // 2. STATE MANAGEMENT
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSearchParams, setCurrentSearchParams] = useState(null);
  const [sortType, setSortType] = useState("");

  // 3. FETCH FUNCTION (Search Logic)
  const fetchCars = async (searchCriteria = {}) => {
    setLoading(true);
    try {
      const response = await fetch("https://full-trip.onrender.com/Mohammed/Cars/search_cars.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchCriteria),
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setCars(data);
        setSortType(""); 
      } else {
        console.error("PHP Error:", data);
        setCars([]);
      }
    } catch (error) {
      console.error("Connection Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch default cars if NOT in edit mode
  useEffect(() => {
    if (!editMode) {
        fetchCars(); 
    }
  }, [editMode]);

  // 4. HANDLE SEARCH SUBMIT (Normal Mode)
  const handleSearch = (formData) => {
    const payload = {
      car_type: formData.carType,       
      location: formData.pickupLocation, 
      brand_model: ""                    
    };

    setCurrentSearchParams({
        startDate: formData.pickupDate,
        endDate: formData.dropoffDate,
        location: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation
    });

    fetchCars(payload);
  };

  // Slider Logic
  const sliderImages = [
    { src: top1, label: "Uber" },
    { src: top2, label: "Yassir" },
    { src: top3, label: "In Drive" },
    { src: top4, label: "Heetch" },
    { src: top5, label: "Careem" },
    { src: top6, label: "Turo" }
  ];

  const scrollToForm = () => {
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="carrental-main-container">

      <h1 style={{marginTop:"50px"}} className="carrental-scroll-h1" onClick={scrollToForm}>
        <span className="carrental-h1-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.8em" height="1.8em">
            <path d="M3 13h1v-2H3v2zm2-4h16l1.5 4h-19L5 9zm16 6c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-12 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm14-8h-3V4c0-1.1-.9-2-2-2H7C5.9 2 5 2.9 5 4v3H2v2h1v6c0 1.1.9 2 2 2h1c0 1.1.9 2 2 2s2-.9 2-2h4c0 1.1.9 2 2 2s2-.9 2-2h1c1.1 0 2-.9 2-2v-6h1V7z" />
          </svg>
        </span>
        {editMode ? "Update Your Reservation" : "Book Your Ride"}
      </h1>

      {/* Only show slider in normal mode */}
      {!editMode && <Slider images={sliderImages} />}

      <div className="carrental-form-wrapper" ref={formRef}>
        <CarRentalForm onSearch={handleSearch} />
      </div>

      <div className="carrental-cards-container">
        {loading ? (
           <h3 style={{color:'white', textAlign:'center'}}>Loading available cars...</h3>
        ) : cars.length > 0 ? (
          cars.map((car) => (
            <CarRentalCard
              key={car.car_id}
              id={car.car_id}
              image={car.car_image_url ? car.car_image_url : carImg}
              name={`${car.car_brand} ${car.model}`}
              model={car.car_type} 
              price={car.price}
              location={car.location || "Algeria"}
              
              // ✅ CRITICAL UPDATE: Pass the search params to the card
              // If user hasn't searched yet, this sends 'null' and Card uses defaults
              searchParams={currentSearchParams} 
            />
          ))
        ) : (
          <h3 style={{color:'white', textAlign:'center'}}>No cars found matching your criteria.</h3>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default CarRental;